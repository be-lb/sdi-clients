
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
import { Map, View, source, layer, proj, format, Feature } from 'openlayers';
import events from '../events/map';
import queries, { setMapReference } from '../queries/map';
import appQueries, { SyntheticLayerInfo } from '../queries/app';
import { StyleFn, lineStyle, pointStyle, polygonStyle } from './map-style';
import { ILayerInfo } from 'sdi/source';
import { scaleLine, zoomControl } from './map-controls';
import { translateMapBaseLayer, hashMapBaseLayer } from '../util/app';
import { addActions } from './map-actions';


const logger = debug('sdi:map');
export const formatGeoJSON = new format.GeoJSON();

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
const isTracking = false;
const isMeasuring = false;

const isWorking =
    () => {
        return (isTracking || isMeasuring);
    };


export interface LayerRef {
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
            vs.forEachFeature((f) => {
                if (!f.getId()) {
                    f.setId(f.getProperties()['__app_id__']);
                }
            });
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
        return null;
    };


export const create =
    (options?: IMapOptions) => {
        if (map) {
            throw (new Error('DuplicatedMapCreation'));
        }

        const view = new View({
            projection: proj.get('EPSG:31370'),
            center: [0, 0],
            rotation: 0,
            zoom: 0,
        });


        const baseLayer = appQueries.getCurrentBaseLayer();
        if (!baseLayer) {
            throw (new Error('NoBaseMapConfigured'));
        }
        const baseLayerTranslated = translateMapBaseLayer(baseLayer);

        const baseSource = new source.ImageWMS({
            projection: proj.get(baseLayerTranslated.srs),
            params: {
                ...baseLayerTranslated.params,
            },
            url: baseLayerTranslated.url,
        });
        baseSource.set('id', hashMapBaseLayer(baseLayer));

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

        // map.getInteractions().on('add', (o: any) => {
        //     logger(`add interaction ${o.type}`);
        // });
        // map.getInteractions().on('remove', (o: any) => {
        //     logger(`remove interaction ${o.type}`);
        // });


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

        const updateActions = addActions(map, localLayersRef);


        // map update
        const update = () => {
            const viewState = queries.getView();
            const queriedBaseLayer = appQueries.getCurrentBaseLayer();
            const mapInfo = appQueries.getMapInfo();


            if (queriedBaseLayer) {
                const id = hashMapBaseLayer(queriedBaseLayer);
                const layer0 = map.getLayers().item(0);
                const source0 = layer0.get('source');
                const sourceId = source0.get('id');
                if (sourceId !== id) {
                    const queriedBaseLayerTranslated = translateMapBaseLayer(queriedBaseLayer);
                    const newSource = new source.ImageWMS({
                        projection: proj.get(queriedBaseLayerTranslated.srs),
                        params: {
                            ...queriedBaseLayerTranslated.params,
                        },
                        url: queriedBaseLayerTranslated.url,
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
                map.getLayers().forEach((layer) => {
                    layer.changed();
                });
                map.render();
                logger('will render');
            }

            updateActions();
            setTimeout(updateSize, 1);
        };


        const setTarget = (t: string | Element) => {
            map.setTarget(t);
        };

        setMapReference(map);
        return { update, setTarget };
    };

logger('loaded');
