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
import { Map, View, source, layer, proj, Feature, Collection } from 'openlayers';

import { SyntheticLayerInfo } from '../app';
import { translateMapBaseLayer, hashMapBaseLayer } from '../util';

import {
    IMapOptions,
    formatGeoJSON,
    FetchData,
    TrackerOptions,
    MeasureOptions,
    SelectOptions,
    InteractionGetter,
} from './index';
import { StyleFn, lineStyle, pointStyle, polygonStyle } from './style';
import { scaleLine, zoomControl } from './controls';
import { select } from './actions';
import { IMapBaseLayer } from '../source/index';
import { measure, track } from './tools';


const logger = debug('sdi:map');

const baseLayerCollection = new Collection<layer.Image>();
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

// const isGroup =
//     (l: layer.Base): l is layer.Group => l instanceof layer.Group;


const isTracking = false;
const isMeasuring = false;

const isWorking =
    () => {
        return (isTracking || isMeasuring);
    };



const getLayerData =
    (fetchData: FetchData, vs: source.Vector, count: number) => {
        const data = fetchData();
        if (data) {
            const features = formatGeoJSON.readFeatures(data);

            vs.addFeatures(features);
            vs.forEachFeature((f) => {
                if (!f.getId()) {
                    f.setId(f.getProperties()['__app_id__']);
                }
            });
        }
        else if (count < 100) {
            setTimeout(() => {
                getLayerData(fetchData, vs, count + 1);
            }, 500);
        }
        else {
            logger('getLayerData GiveUp');
        }
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
    (layerInfo: () => (SyntheticLayerInfo), fetchData: FetchData) => {
        const { info, metadata } = layerInfo();
        if (info && metadata) {
            let layerAlreadyAdded = false;
            mainLayerGroup.getLayers().forEach((l) => {
                if (l.get('id') === info.id) {
                    layerAlreadyAdded = true;
                }
            });
            if (layerAlreadyAdded) {
                return null;
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
                source: vs,
                style: styleFn,
            });
            vl.set('id', info.id);
            vl.setVisible(info.visible);
            mainLayerCollection.push(vl);
            getLayerData(fetchData, vs, 0);

            vl.on('render', (_e: any) => {
                logger(`Layer Render ${info.id} ${vs.getState()} `);
            });

            return vl;
        }
        return null;
    };


const fromBaseLayer =
    (baseLayer: IMapBaseLayer) => {
        const baseLayerTranslated = translateMapBaseLayer(baseLayer);
        const l = new layer.Image({
            source: new source.ImageWMS({
                projection: proj.get(baseLayerTranslated.srs),
                params: {
                    ...baseLayerTranslated.params,
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
                mapInfo.layers.forEach((info) => {
                    const { id, visible } = info;
                    mainLayerGroup.getLayers()
                        .forEach((l) => {
                            if (id === <string>(l.get('id'))) {
                                l.setVisible(visible);
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
const updateView =
    (map: Map,
        getView: IMapOptions['getView'],
        setView: IMapOptions['updateView'],
    ) =>
        () => {
            const { dirty, zoom, rotation, center } = getView();
            const view = map.getView();
            const eq = viewEquals(zoom, rotation, center);

            if (dirty === 'geo'
                && !eq(view.getZoom(), view.getRotation(), view.getCenter())) {
                view.animate({ zoom, rotation, center });
                setView({ dirty: 'none' });
            }
            else if (dirty === 'style') {
                forceRedraw();
                setView({ dirty: 'none' });
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

export const create =
    (options: IMapOptions) => {
        const view = new View({
            projection: proj.get('EPSG:31370'),
            center: [0, 0],
            rotation: 0,
            zoom: 0,
        });
        const map = new Map({
            view,
            layers: [
                baseLayerGroup,
                mainLayerGroup,
                toolsLayerGroup,
            ],
            controls: [
                scaleLine({
                    setScaleLine: options.setScaleLine,
                    minWidth: 100,
                }),
                zoomControl(),
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

        view.on('change', () => {
            if (!isWorking()) {
                options.updateView({
                    dirty: 'geo',
                    center: view.getCenter(),
                    rotation: view.getRotation(),
                    zoom: view.getZoom(),
                });
            }
        });



        const update =
            () => {
                const us = updatables.map((u) => {
                    u.fn();
                    return u.name;
                });
                logger(`updated ${us.join(', ')}`);
            };


        const setTarget =
            (t: string | Element) =>
                map.setTarget(t);


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


        return {
            setTarget,
            update,
            selectable,
            trackable,
            measurable,
        };
    };

logger('loaded');
