
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
import * as proj4 from 'proj4';
import { Map, View, source, layer, proj, interaction, Feature, format, Collection, Geolocation, geom, style as olStyle } from 'openlayers';
import { ILayerInfo, IMapBaseLayer, Feature as IOFeature } from 'sdi/source';
import events from '../events/map';
import queries, { setMapReference } from '../queries/map';
import appQueries, { SyntheticLayerInfo } from '../queries/app';
import appEvents from '../events/app';
import { AppLayout } from '../shape';
import { StyleFn, fontSizeExtractRegexp, fontSizeReplaceRegexp, polygonStyle, pointStyle, lineStyle } from './map-style';
import { scaleLine, zoomControl } from './map-controls';
import { translateMapBaseLayer, hashMapBaseLayer } from '../util/app';


const logger = debug('sdi:map');
const formatGeoJSON = new format.GeoJSON();

proj.setProj4(proj4);
proj4.defs('EPSG:31370',
    '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.8686,52.2978,-103.7239,-0.3366,0.457,-1.8422,-1.2747 +units=m +no_defs');

const EPSG31370 = new proj.Projection({
    code: 'EPSG:31370',
    extent: [14697.30, 22635.80, 291071.84, 246456.18],
});

proj.addProjection(EPSG31370);


export interface IMapOptions {
    element: Element;
}

let map: Map;
let isTracking = false;
let isMeasuring = false;

const isWorking = () => {
    return (isTracking || isMeasuring);
};


interface LayerRef {
    info: ILayerInfo;
    layer: layer.Vector;
}

const localLayersRef: LayerRef[] = [];


const getLayerData =
    (vs: source.Vector, id: string, count: number) => {
        const data = appQueries.getLayerData(id);
        if (data) {
            const features = formatGeoJSON.readFeatures(data);

            vs.addFeatures(features);
            // vs.forEachFeature((f) => {
            //     f.setId(f.getProperties()['__app_id__']);
            // });
        }
        else if (count < 100) {
            setTimeout(() => {
                getLayerData(vs, id, count + 1);
            }, 500);
        }
        else {
            logger(`could not get data for layer ${id}`);
        }
    };

export const removeLayer =
    (lid: string) => {
        if (map) {
            const l = map.getLayers().get(lid);
            map.getLayers().remove(l);
        }
    };

export const removeLayerAll =
    () => {
        logger('remove all layers');
        if (map) {
            const lyrs = map.getLayers();
            lyrs.getArray()
                .slice(1)
                .forEach(l => lyrs.remove(l));
        }
    };


export const addLayer =
    (layerInfo: () => (SyntheticLayerInfo)) => {
        const { info, metadata } = layerInfo();
        if (map && info && metadata) {
            logger(`addLayer ${metadata.uniqueResourceIdentifier}`);
            let layerAlreadyAdded = false;
            map.getLayers().forEach((l) => {
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
            map.addLayer(vl);
            getLayerData(vs, metadata.uniqueResourceIdentifier, 0);

            localLayersRef.push({
                layer: vl,
                info,
            });

            return vl;
        }
        logger(`Failed to add layer info(${info}), metadata(${metadata})`);
        return null;
    };


const tracker = (geoloc: Geolocation) => () => {
    events.updateTrack({
        coord: geoloc.getPosition(),
        accuracy: geoloc.getAccuracy(),
    });
};


const startMeasureLength = (e: any) => {
    const feature: Feature = e.feature;
    const line = <geom.LineString>feature.getGeometry();
    line.on('change', () => {
        logger('measure line change');
        events.updateMeasureCoordinates(line.getCoordinates());
    });
};

const stopMeasureLength = (s: source.Vector) => () => {
    s.clear();
    isMeasuring = false;
};


const startMeasureArea = (e: any) => {
    const feature: Feature = e.feature;
    const polygon = <geom.Polygon>feature.getGeometry();
    polygon.on('change', () => {
        events.updateMeasureCoordinates(
            polygon.getLinearRing(0).getCoordinates());
    });
};

const stopMeasureArea = (s: source.Vector) => () => {
    s.clear();
    isMeasuring = false;
};

const trackerStyles = (accuracy: number, res: number) => ([
    new olStyle.Style({
        image: new olStyle.Circle({
            radius: accuracy / res,
            fill: new olStyle.Fill({
                color: 'rgba(255,255,255,.3)',
            }),
            stroke: new olStyle.Stroke({
                color: '#FF4C00',
                width: 1,

            }),
        }),
    }),
    new olStyle.Style({
        image: new olStyle.Circle({
            radius: 6,
            fill: new olStyle.Fill({
                color: '#3399CC',
            }),
            stroke: new olStyle.Stroke({
                color: '#fff',
                width: 2,
            }),
        }),
    }),
]);


const fontSizeIncrement = (s: string) => {
    const result = fontSizeExtractRegexp.exec(s);
    if (!result) {
        return s;
    }
    if (result.length !== 2) {
        return s;
    }
    const ret = parseFloat(result[1]) * 1.3;
    if (isNaN(ret)) {
        return s;
    }
    return s.replace(fontSizeReplaceRegexp,
        (_m: string, p1: string, p2: string) => (
            `${p1} ${ret.toFixed(1)}px ${p2}`
        ));
};

const getSelectionStyleForPoint = (style: olStyle.Style) => {
    const text = style.getText();
    if (text && text.getText()) {
        return (new olStyle.Style({
            text: new olStyle.Text({
                font: fontSizeIncrement(text.getFont()),
                text: text.getText(),
                textAlign: text.getTextAlign(),
                textBaseline: text.getTextBaseline(),
                offsetX: text.getOffsetX(),
                offsetY: text.getOffsetY(),
                fill: new olStyle.Fill({
                    color: '#3FB2FF',
                }),
                stroke: new olStyle.Stroke({
                    width: 2,
                    color: 'white',
                }),
            }),
        }));
    }
    return (new olStyle.Style());
};


const ensureArray = <T>(a: T | T[]): T[] => {
    if (Array.isArray(a)) {
        return a;
    }
    return [a];
};

const getStylesForFeature = (f: Feature, res: number) => {
    const fn = f.getStyleFunction();
    if (fn) {
        return ensureArray<olStyle.Style>(fn.call(f, res));
    }
    const fs = f.getStyle();
    if (fs) {
        if (typeof fs === 'function') {
            return ensureArray<olStyle.Style>(fs.call(f, res));
        }
        return ensureArray(fs);
    }


    const layerRef = localLayersRef.reduce<LayerRef | null>((result, ref) => {
        if (ref.layer.getSource().getFeatureById(f.getId())) {
            return ref;
        }
        return result;
    }, null);

    if (layerRef) {
        const fn = layerRef.layer.getStyleFunction();
        if (fn) {
            return ensureArray(fn(f, res));
        }
        const fs = layerRef.layer.getStyle();
        if (fs) {
            if (typeof fs === 'function') {
                return ensureArray(fs(f, res));
            }
            return ensureArray(fs);
        }
    }
    return null;
};

const selectionStyle = (f: Feature, res: number) => {
    const geometryType = f.getGeometry().getType();
    if (geometryType === 'Point') {
        const styles = getStylesForFeature(f, res);
        if (styles) {
            return styles.map(getSelectionStyleForPoint);
        }
    }
    else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
        return [
            new olStyle.Style({
                stroke: new olStyle.Stroke({
                    width: 4,
                    color: 'white',
                }),
            }),
            new olStyle.Style({
                stroke: new olStyle.Stroke({
                    width: 2,
                    color: '#3FB2FF',
                }),
            }),
        ];
    }

    return [new olStyle.Style({
        fill: new olStyle.Fill({
            color: '#3FB2FF',
        }),
        stroke: new olStyle.Stroke({
            width: 2,
            color: 'white',
        }),
    })];
};


const findFeature = (appId: string) => {
    return localLayersRef.reduce<Feature | null>((result, ref) => {
        const f = ref.layer.getSource().getFeatureById(appId);
        if (f) {
            return f;
        }
        return result;
    }, null);
};

const baseLayerId = (l: IMapBaseLayer) => {
    return `${l.url}/${l.name}`;
};

export const create = (options?: IMapOptions) => {
    if (map) {
        throw (new Error('DuplicatedMapCreation'));
    }

    const view = new View({
        projection: proj.get('EPSG:31370'),
        center: [0, 0],
        rotation: 0,
        zoom: 0,
    });


    const baseLayer = queries.getBaseLayer();
    if (!baseLayer) {
        throw (new Error('NoBaseMapConfigured'));
    }
    const baseLayerT = translateMapBaseLayer(baseLayer);

    const baseSource = new source.ImageWMS({
        projection: proj.get(baseLayerT.srs),
        params: {
            ...baseLayerT.params,
        },
        url: baseLayerT.url,
    });
    baseSource.set('id', baseLayerId(baseLayer));

    const layers = [
        new layer.Image({
            source: baseSource,
        }),
    ];




    map = new Map({
        view,
        target: options ? options.element : undefined,
        layers,
        controls: [
            scaleLine({ minWidth: 100 }),
            zoomControl(),
        ],
    });




    // geolocation
    const geolocation = new Geolocation({
        projection: proj.get('EPSG:31370'),
        tracking: false,
    });

    geolocation.on('change', tracker(geolocation));

    const geolocationSource = new source.Vector();
    const geolocationLayer = new layer.Vector({
        source: geolocationSource,
    });


    // measure
    const measureSource = new source.Vector();
    const measureLayer = new layer.Vector({
        source: measureSource,
    });
    const measureLength = new interaction.Draw({
        type: 'LineString',
        source: measureSource,
    });
    const measureArea = new interaction.Draw({
        type: 'Polygon',
        source: measureSource,
    });

    measureLength.on('drawstart', startMeasureLength);
    measureLength.on('drawend', stopMeasureLength);
    measureArea.on('drawstart', startMeasureArea);
    measureArea.on('drawend', stopMeasureArea);


    // selection
    const selectedFeature = new Collection<Feature>();
    const select = new interaction.Select({
        style: selectionStyle,
        features: selectedFeature,
    });
    select.on('select', () => {
        if (selectedFeature.getLength() > 0) {
            // selectedFeature.forEach(f => logger(`select ${f.getId()}`));
            const f = selectedFeature.item(0);
            const j = JSON.parse(formatGeoJSON.writeFeature(f));
            const info = localLayersRef.reduce<ILayerInfo | null>((result, ref) => {
                if (ref.layer.getSource().getFeatureById(f.getId())) {
                    return ref.info;
                }
                return result;
            }, null);

            if (j && info) {
                const geojson: IOFeature = j;
                appEvents.setCurrentLayer(info.id);
                appEvents.setCurrentFeature(geojson);
                appEvents.setLayout(AppLayout.MapAndFeature);
            }
        }
        else {
            appEvents.setCurrentFeature(null);
            appEvents.setLayout(AppLayout.MapAndInfo);
        }
    });
    map.addInteraction(select);


    // state update
    view.on('change', () => {
        if (!isWorking()) {
            events.updateMapView({
                dirty: false,
                center: view.getCenter(),
                rotation: view.getRotation(),
                zoom: view.getZoom(),
            });
        }
    });

    let containerWidth = 0;
    let containerHeight = 0;

    const updateSize = () => {
        const container = map.getViewport();
        const rect = container.getBoundingClientRect();
        if ((rect.width !== containerWidth)
            || (rect.height !== containerHeight)) {
            containerHeight = rect.height;
            containerWidth = rect.width;
            map.updateSize();
        }
    };

    // map update
    const update = () => {
        const viewState = queries.getView();
        const queriedBaseLayer = queries.getBaseLayer();
        const trackingState = queries.getTracking();
        const measureState = queries.getMeasure();
        const currentFeature = appQueries.getCurrentFeature();
        const mapInfo = appQueries.getMapInfo();


        if (queriedBaseLayer) {
            const id = hashMapBaseLayer(queriedBaseLayer);
            const trBaseLayer = translateMapBaseLayer(queriedBaseLayer);
            const layer0 = map.getLayers().item(0);
            const source0 = layer0.get('source');
            const sourceId = source0.get('id');
            if (sourceId !== id) {

                const newSource = new source.ImageWMS({
                    projection: proj.get(trBaseLayer.srs),
                    params: {
                        ...trBaseLayer.params,
                    },
                    url: trBaseLayer.url,
                });
                newSource.set('id', id);
                const newLayer =
                    new layer.Image({
                        source: newSource,
                    });

                map.removeLayer(layer0);
                map.getLayers().insertAt(0, newLayer);
            }
        }

        if (mapInfo) {
            mapInfo.layers.forEach((info) => {
                const { id, visible } = info;
                map.getLayers()
                    .forEach((l) => {
                        if (id === <string>(l.get('id'))) {
                            l.setVisible(visible);
                        }
                    });
            });
        }

        if (viewState.dirty) {
            view.animate({
                zoom: viewState.zoom,
                rotation: viewState.rotation,
                center: viewState.center,
            });
        }

        const shouldTrack = trackingState.active;
        isTracking = geolocation.getTracking();
        if (isTracking !== shouldTrack) {
            if (shouldTrack) {
                events.resetTrack();
                map.addLayer(geolocationLayer);
                logger('start tracking');
            }
            else {
                map.removeLayer(geolocationLayer);
            }
            geolocation.setTracking(shouldTrack);
            isTracking = shouldTrack;
        }

        if (isTracking) {
            geolocationSource.clear();
            const features = trackingState.track.map((coords, idx) => {
                logger(`track #${idx} ${coords}`);
                const accuracy = coords.accuracy;
                const f = new Feature({
                    geometry: new geom.Point(coords.coord),
                });
                f.setStyle((r: number) => {
                    logger(`style ${accuracy} ${r}`);
                    return trackerStyles(accuracy, r);
                });
                return f;
            });
            geolocationSource.addFeatures(features);
            if (trackingState.track.length > 0) {
                const last = trackingState.track[trackingState.track.length - 1];
                view.setCenter(last.coord);
            }
        }

        const shouldMeasure = measureState.active;
        if (isMeasuring !== shouldMeasure) {
            if (shouldMeasure) {
                measureSource.clear();
                map.addLayer(measureLayer);
                if (measureState.geometryType === 'LineString') {
                    map.addInteraction(measureLength);
                }
                else {
                    map.addInteraction(measureArea);
                }
                map.removeInteraction(select);
                logger(`start measure ${measureState.geometryType}`);
            }
            else {
                map.removeLayer(measureLayer);
                map.removeInteraction(measureArea);
                map.removeInteraction(measureLength);
                map.addInteraction(select);
            }
            isMeasuring = shouldMeasure;
        }


        // check selection state
        if (!currentFeature && (selectedFeature.getLength() > 0)) {
            selectedFeature.clear();
        }
        if (currentFeature) {
            const fprops = currentFeature.properties;
            if (fprops) {
                const f = findFeature(<string>fprops['__app_id__']);
                if (f) {
                    selectedFeature.clear();
                    selectedFeature.push(f);
                }
            }
        }

        setTimeout(updateSize, 1);
    };


    const setTarget = (t: string | Element) => {
        map.setTarget(t);
    };

    setMapReference(map);
    return { update, setTarget };
};

logger('loaded');
