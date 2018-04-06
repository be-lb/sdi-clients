/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as debug from 'debug';
import { fromNullable } from 'fp-ts/lib/Option';
import { Map, View, source, layer, proj, Feature, Collection, Extent } from 'openlayers';

import { SyntheticLayerInfo } from '../app';
import { translateMapBaseLayer, hashMapBaseLayer } from '../util';
import { IMapBaseLayer, MessageRecord, getMessageRecord, DirectGeometryObject, Feature as GeoFeature, Position as GeoPosition, FeatureCollection } from '../source';

import {
    ExtractOptions,
    FeaturePathGetter,
    FetchData,
    formatGeoJSON,
    IMapOptions,
    InteractionGetter,
    MarkOptions,
    MeasureOptions,
    PositionOptions,
    PrintOptions,
    SelectOptions,
    TrackerOptions,
} from './index';
import { StyleFn, lineStyle, pointStyle, polygonStyle } from './style';
import { scaleLine, zoomControl, rotateControl, fullscreenControl, loadingMon } from './controls';
import { select, highlight } from './actions';
import { measure, track, extract, mark, print, position } from './tools';
import { credit } from './credit';
// import { setTimeout } from 'timers';
import { fromRecord } from '../locale';


const logger = debug('sdi:map');

const baseLayerCollection = new Collection<layer.Tile>();
const baseLayerGroup = new layer.Group({
    layers: baseLayerCollection,
});

const mainLayerCollection = new Collection<layer.Vector>();
const mainLayerGroup = new layer.Group({
    layers: mainLayerCollection,
});

const toolsLayerCollection = new Collection<layer.Vector>();
const toolsLayerGroup = new layer.Group({
    layers: toolsLayerCollection,
});


const isTracking = false;
const isMeasuring = false;

const isWorking =
    () => {
        return (isTracking || isMeasuring);
    };

const loadingMonitor = loadingMon();


const getResolutionForZoom =
    (projectionLike: string | proj.Projection) => {
        const view = new View({
            projection: proj.get(projectionLike),
            center: [0, 0],
            rotation: 0,
            zoom: 0,
        });
        // should be if types were up to date
        //    return (z: number) => view.getResolutionForZoom(z)

        // from https://github.com/openlayers/openlayers/blob/v4.6.4/src/ol/view.js#L845
        return (z: number | undefined, defaultVal: number) => (
            view.constrainResolution(
                view.getMaxResolution(), z === undefined ?
                    defaultVal : z, 0)
        );
    };

const getResolutionForZoomL72 = getResolutionForZoom('EPSG:31370');


const featureBatchInterval = 160;

const loadLayerData =
    (vs: source.Vector, fc: FeatureCollection, featureBatchSize = 1000) => {
        logger(`loadLayerData  ${fc.features.length}`);
        const ts = performance.now();
        const lid = vs.get('id');
        const featuresRef = fc.features;
        const featuresSlice = featuresRef.slice(0, featureBatchSize);
        const data: FeatureCollection = Object.assign(
            {}, fc, { features: featuresSlice });
        const features = formatGeoJSON.readFeatures(data);
        vs.addFeatures(features);
        vs.forEachFeature((f) => {
            f.set('lid', lid, true);
            // if (!f.getId()) {
            //     f.setId(f.getProperties()['__app_id__']);
            // }
        });
        const timed = performance.now() - ts;
        const newBatchSized = timed > 16 ? featureBatchSize - 10 : featureBatchSize + 1;
        if (featuresRef.length >= newBatchSized) {
            const featuresNext = featuresRef.slice(newBatchSized);
            const nextData: FeatureCollection = Object.assign(
                {}, fc, { features: featuresNext });
            setTimeout(() => loadLayerData(vs, nextData), featureBatchInterval);
        }
    };

const getLayerData =
    (fetchData: FetchData, vs: source.Vector, vl: layer.Vector, title: MessageRecord) => {
        const fetcher =
            (count: number) => {
                logger(`getLayerData ${fromRecord(title)} ${count}`);

                const data = fetchData();
                if (data) {
                    const complete = () => loadLayerData(vs, data);
                    if (vl.getVisible()) {
                        complete();
                    }
                    else {
                        // setTimeout(complete, 3000 + (Math.random() * 10000));
                        vl.once('change:visible', complete);
                    }
                    loadingMonitor.remove(title);
                }
                else if (count < 100) {
                    setTimeout(() => fetcher(count + 1), 1000);
                }
                else {
                    logger(`getLayerData GiveUp on ${fromRecord(title)}`);
                }
            };

        fetcher(0);
    };

export const removeLayer =
    (lid: string) => {
        const l = mainLayerGroup.getLayers().get(lid);
        mainLayerGroup.getLayers().remove(l);
    };

export const removeLayerAll =
    () => {
        const lyrs = mainLayerGroup.getLayers();
        lyrs.getArray()
            .slice(1)
            .forEach(l => lyrs.remove(l));
    };


export const addLayer =
    (layerInfo: () => SyntheticLayerInfo, fetchData: FetchData, retryCount = 0) => {
        const { info, metadata } = layerInfo();
        if (info && metadata) {
            logger(`===== addLayer ${info.id} ====`);
            const layers = mainLayerGroup.getLayers();
            const alayers = layers.getArray();
            const title = getMessageRecord(metadata.resourceTitle);
            if (alayers.find(l => l.get('id') === info.id)) {
                logger(`addLayer.abort`);
                return;
            }


            const styleFn: StyleFn = (a: Feature, b?: number) => {
                const { info } = layerInfo();
                if (info) {
                    switch (info.style.kind) {
                        case 'polygon-continuous':
                        case 'polygon-discrete':
                        case 'polygon-simple':
                            return polygonStyle(info.style)(a, b);
                        case 'point-discrete':
                        case 'point-simple':
                        case 'point-continuous':
                            return pointStyle(info.style)(a, b);
                        case 'line-simple':
                        case 'line-discrete':
                        case 'line-continuous':
                            return lineStyle(info.style)(a, b);
                    }
                }
                return [];
            };


            const vs = new source.Vector();
            const vl = new layer.Vector({
                renderMode: 'image', // IMPORTANT
                source: vs,
                style: styleFn,
                maxResolution: getResolutionForZoomL72(info.minZoom, 0),
                minResolution: getResolutionForZoomL72(info.maxZoom, 30),
            });
            vs.set('id', info.id);
            vl.set('id', info.id);
            vl.setVisible(info.visible);

            loadingMonitor.add(title);
            layers.push(vl);
            // logger(`addLayer.commit ${fromRecord(title)} ${layers.getArray().map(l => l.get('id')).join('; ')}`);
            getLayerData(fetchData, vs, vl, title);

            // vl.on('render', (_e: any) => {
            //     logger(`Layer Render ${info.id} ${vs.getState()} `);
            // });

            // return vl;
        }
        else if (retryCount < 120) {
            setTimeout(() => {
                addLayer(layerInfo, fetchData, retryCount + 1);
            }, retryCount * retryCount * 250);
        }
        // return null;
    };


const fromBaseLayer =
    (baseLayer: IMapBaseLayer) => {
        const baseLayerTranslated = translateMapBaseLayer(baseLayer);
        const l = new layer.Tile({
            source: new source.TileWMS({
                projection: proj.get(baseLayerTranslated.srs),
                params: {
                    ...baseLayerTranslated.params,
                    TILED: true,
                },
                url: baseLayerTranslated.url,
            }),
        });
        l.set('id', hashMapBaseLayer(baseLayer));
        return l;
    };

type UpdateFn = () => void;
interface Updatable {
    name: string;
    fn: UpdateFn;
}

const updateBaseLayer =
    (getBaseLayer: IMapOptions['getBaseLayer']) =>
        () => fromNullable(getBaseLayer())
            .map((queriedBaseLayer) => {
                const currentBaseLayer = baseLayerCollection.item(0);
                const id = hashMapBaseLayer(queriedBaseLayer);
                if ((!currentBaseLayer)
                    || (currentBaseLayer && (currentBaseLayer.get('id') !== id))) {
                    baseLayerCollection.clear();
                    baseLayerCollection.push(fromBaseLayer(queriedBaseLayer));
                }
            });

const updateLayers =
    (getMapInfo: IMapOptions['getMapInfo']) =>
        () => fromNullable(getMapInfo())
            .map((mapInfo) => {
                const ids = mapInfo.layers.map(info => info.id);
                mainLayerGroup
                    .getLayers()
                    .forEach((l) => {
                        if (l) {
                            const lid = <string>(l.get('id'));
                            if (ids.indexOf(lid) < 0) {
                                mainLayerGroup.getLayers().remove(l);
                            }
                        }
                    });
                mapInfo.layers.forEach((info, z) => {
                    const { id, visible } = info;
                    mainLayerGroup.getLayers()
                        .forEach((l) => {
                            if (id === <string>(l.get('id'))) {
                                logger(`Layer ${id} ${visible} ${z}`);
                                l.setVisible(visible);
                                l.setZIndex(z);
                                l.setMaxResolution(
                                    getResolutionForZoomL72(info.minZoom, 0));
                                l.setMinResolution(
                                    getResolutionForZoomL72(info.maxZoom, 30));
                            }
                        });
                });
            });


const forceRedraw =
    () => {
        mainLayerCollection.forEach((layer) => {
            layer.changed();
        });
    };

const viewEquals =
    (z: number, r: number, c: [number, number]) =>
        (rz: number, rr: number, rc: [number, number]) => (
            z === rz && r === rr && c[0] === rc[0] && c[1] === rc[1]
        );

// concat :: ([a],[a]) -> [a]
const concat =
    <A>(xs: A[], ys: A[]) =>
        xs.concat(ys);

const flatten =
    <T>(xs: T[][]) =>
        xs.reduce(concat, []);

const flattenCoords =
    (g: DirectGeometryObject): GeoPosition[] => {
        switch (g.type) {
            case 'Point': return [g.coordinates];
            case 'MultiPoint': return g.coordinates;
            case 'LineString': return g.coordinates;
            case 'MultiLineString': return flatten(g.coordinates);
            case 'Polygon': return flatten(g.coordinates);
            case 'MultiPolygon': return flatten(flatten(g.coordinates));
        }
    };

const getExtent =
    (feature: GeoFeature, buf = 10): Extent => {
        const initialExtent: Extent = [
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MIN_VALUE,
            Number.MIN_VALUE,
        ];

        if (feature.geometry.type === 'Point') {
            const [x, y] = feature.geometry.coordinates;
            return [x - buf, y - buf, x + buf, y + buf];
        }

        return flattenCoords(feature.geometry).reduce<Extent>((acc, c) => {
            return [
                Math.min(acc[0], c[0]),
                Math.min(acc[1], c[1]),
                Math.max(acc[2], c[0]),
                Math.max(acc[3], c[1]),
            ];
        }, initialExtent);
    };

const updateView =
    (map: Map,
        getView: IMapOptions['getView'],
        setView: IMapOptions['updateView'],
    ) =>
        () => {
            const { dirty, zoom, rotation, center, feature, extent } = getView();
            const view = map.getView();
            const eq = viewEquals(zoom, rotation, center);
            const size = map.getSize();
            const mapExtent = () => view.calculateExtent(size);

            if (dirty === 'geo/feature' && feature !== null) {
                const extent = getExtent(feature);
                view.fit(extent, {
                    size,
                    callback: () => setView({ dirty: 'none', extent }),
                });
            }
            else if (dirty === 'geo/extent' && extent !== null) {
                view.fit(extent, {
                    size: map.getSize(),
                    callback: () => setView({ dirty: 'none', extent }),
                });
            }
            else if (dirty === 'geo'
                && !eq(view.getZoom(), view.getRotation(), view.getCenter())) {
                view.animate({ zoom, rotation, center },
                    () => setView({ dirty: 'none', extent: mapExtent() }));
            }
            else if (dirty === 'style') {
                window.setTimeout(() => setView({ dirty: 'none', extent: mapExtent() }), 0);
                forceRedraw();
            }
        };

const updateSize =
    (map: Map) => {
        let containerWidth = 0;
        let containerHeight = 0;

        const inner =
            () => {
                const container = map.getViewport();
                const rect = container.getBoundingClientRect();
                if ((rect.width !== containerWidth)
                    || (rect.height !== containerHeight)) {
                    containerHeight = rect.height;
                    containerWidth = rect.width;
                    map.updateSize();
                }
            };

        return () => setTimeout(inner, 1);
    };


const makeControlBox =
    () => {
        const element = document.createElement('div');
        element.setAttribute('class', 'control-box');
        element.appendChild(credit());
        return element;
    };

export const create =
    (options: IMapOptions) => {
        const view = new View({
            projection: proj.get('EPSG:31370'),
            center: [0, 0],
            rotation: 0,
            zoom: 0,
        });

        const controlBox = makeControlBox();

        const map = new Map({
            view,
            renderer: 'canvas',
            layers: [
                baseLayerGroup,
                mainLayerGroup,
                toolsLayerGroup,
            ],
            controls: [
                rotateControl(controlBox),
                zoomControl(controlBox),
                fullscreenControl(controlBox),
                scaleLine({
                    setScaleLine: options.setScaleLine,
                    minWidth: 100,
                }),
            ],
        });



        const updatables: Updatable[] = [
            { name: 'BaseLayer', fn: updateBaseLayer(options.getBaseLayer) },
            { name: 'Layers', fn: updateLayers(options.getMapInfo) },
            { name: 'View', fn: updateView(map, options.getView, options.updateView) },
            { name: 'Size', fn: updateSize(map) },
        ];


        fromNullable(options.element)
            .map(e => map.setTarget(e));

        fromNullable(options.setLoading)
            .map(s => loadingMonitor.onUpdate(s));

        view.on('change', () => {
            if (!isWorking()) {
                options.updateView({
                    dirty: 'none',
                    center: view.getCenter(),
                    rotation: view.getRotation(),
                    zoom: view.getZoom(),
                    extent: view.calculateExtent(map.getSize()),
                });
            }
        });



        const update =
            () => {
                const us = updatables.map((u) => {
                    u.fn();
                    return u.name;
                });
                logger(`updated ${us.join(', ')} @ z${view.getZoom()}`);
            };


        const setTarget =
            (t: Element | null) => {
                if (t) {
                    map.setTarget(t);
                    t.appendChild(controlBox);
                }
            };


        const selectable =
            (o: SelectOptions, g: InteractionGetter) => {
                const { init, update } = select(o, mainLayerCollection);
                init(map);
                updatables.push({ name: 'Select', fn: () => update(g()) });
            };


        const trackable =
            (o: TrackerOptions, g: InteractionGetter) => {
                const { init, update } = track(o);
                init(map, toolsLayerCollection);
                updatables.push({ name: 'Tracker', fn: () => update(g()) });
            };


        const measurable =
            (o: MeasureOptions, g: InteractionGetter) => {
                const { init, update } = measure(o);
                init(map, toolsLayerCollection);
                updatables.push({ name: 'Measure', fn: () => update(g()) });
            };


        const extractable =
            (o: ExtractOptions, g: InteractionGetter) => {
                const { init, update } = extract(o);
                init(map, mainLayerCollection);
                updatables.push({ name: 'Extract', fn: () => update(g()) });
            };


        const markable =
            (o: MarkOptions, g: InteractionGetter) => {
                const { init, update } = mark(o);
                init(map);
                updatables.push({ name: 'Mark', fn: () => update(g()) });
            };

        const highlightable =
            (fpg: FeaturePathGetter) => {
                const { init, update } = highlight(fpg);
                init(mainLayerCollection, toolsLayerCollection);
                updatables.push({ name: 'Highlight', fn: () => update() });
            };

        const printable =
            <T>(o: PrintOptions<T>, g: InteractionGetter) => {
                const { init, update } = print(o);
                init(map, baseLayerCollection);
                updatables.push({ name: 'Print', fn: () => update(g()) });
            };

        const positionable =
            (o: PositionOptions, g: InteractionGetter) => {
                const { init, update } = position(o);
                init(map);
                updatables.push({ name: 'Position', fn: () => update(g()) });
            }


        return {
            setTarget,
            update,
            selectable,
            trackable,
            measurable,
            extractable,
            markable,
            highlightable,
            printable,
            positionable,
        };
    };

logger('loaded');
