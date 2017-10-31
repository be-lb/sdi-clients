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
import { Map, View, source, layer, proj, Feature, Collection } from 'openlayers';

import { SyntheticLayerInfo } from '../app';
import { translateMapBaseLayer, hashMapBaseLayer } from '../util';

import { LayerRef, IMapOptions, formatGeoJSON, FetchData, EditOptions } from './index';
import { StyleFn, lineStyle, pointStyle, polygonStyle } from './style';
import { scaleLine, zoomControl } from './controls';
import { addActions } from './actions';
import { fromNullable } from 'fp-ts/lib/Option';
import { IMapBaseLayer } from '../source/index';


const logger = debug('sdi:map');

let map: Map;
const isTracking = false;
const isMeasuring = false;

const isWorking =
    () => {
        return (isTracking || isMeasuring);
    };

const localLayersRef: LayerRef[] = [];


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
    (layerInfo: () => (SyntheticLayerInfo), fetchData: FetchData) => {
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
            getLayerData(fetchData, vs, 0);

            localLayersRef.push({
                layer: vl,
                info,
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
    }


export const create =
    (options: IMapOptions) => {
        if (map) {
            throw (new Error('DuplicatedMapCreation'));
        }

        const view = new View({
            projection: proj.get('EPSG:31370'),
            center: [0, 0],
            rotation: 0,
            zoom: 0,
        });


        const baseLayerCollection = new Collection<layer.Image>();
        const baseLayerGroup = new layer.Group({
            layers: baseLayerCollection,
        });

        fromNullable(options.getBaseLayer())
            .map((baseLayer) => {
                baseLayerCollection.push(fromBaseLayer(baseLayer));
            });

        const layers = [baseLayerGroup];


        map = new Map({
            view,
            layers,
            controls: [
                scaleLine({
                    setScaleLine: options.setScaleLine,
                    minWidth: 100,
                }),
                zoomControl(),
            ],
        });
        if (options.element) {
            map.setTarget(options.element);
        }

        // map.getInteractions().on('add', (o: any) => {
        //     logger(`add interaction ${o.type}`);
        // });
        // map.getInteractions().on('remove', (o: any) => {
        //     logger(`remove interaction ${o.type}`);
        // });


        // state update
        view.on('change', () => {
            if (!isWorking()) {
                options.updateView({
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

        let updateActions: null | (() => void) = null;


        // map update
        const update = () => {
            const viewState = options.getView();
            const queriedBaseLayer = options.getBaseLayer();
            const currentBaseLayer = baseLayerCollection.item(0);
            const mapInfo = options.getMapInfo();



            if (queriedBaseLayer) {
                const id = hashMapBaseLayer(queriedBaseLayer);
                if ((!currentBaseLayer)
                    || (currentBaseLayer && (currentBaseLayer.get('id') !== id))) {
                    baseLayerCollection.clear();
                    baseLayerCollection.push(fromBaseLayer(queriedBaseLayer));
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

            if (updateActions) {
                updateActions();
            }
            setTimeout(updateSize, 1);
        };


        const setTarget = (t: string | Element) => {
            map.setTarget(t);
        };

        const editable =
            (edOptions: EditOptions) => {
                updateActions = addActions(edOptions, map, localLayersRef);
            }

        return { update, setTarget, editable };
    };

logger('loaded');
