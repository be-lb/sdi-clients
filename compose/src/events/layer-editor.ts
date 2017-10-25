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

import { dispatch } from 'sdi/shape';
import { TableDataRow } from 'sdi/components/table';
import {
    defaultStyle,
    DirectGeometryObject,
    Feature,
    IMapInfo,
    Inspire,
} from 'sdi/source';
import tableEvents from './table';
import appEvents from './app';
import queries from '../queries/layer-editor';
import appQueries from '../queries/app';
import { AppLayout } from '../shape/types';
import { removeLayerAll, addLayer } from '../ports/map';
import * as uuid from 'uuid';
import { syncLayer } from '../util/app';

type NotNullProperties = { [k: string]: any };

const makeLayerMapId =
    (i: Inspire) => `layer-map/${i.uniqueResourceIdentifier}`;

const makeLayerMap =
    (id: string, md: Inspire): IMapInfo => ({
        id,
        title: { fr: '-', nl: '-' },
        description: { fr: '-', nl: '-' },
        attachments: [],
        categories: [],
        layers: [{
            id: makeLayerMapId(md),
            metadataId: md.id,
            featureViewOptions: { type: 'default' },
            visible: true,
            style: defaultStyle(md.geometryType),
        }],
        lastModified: Date.now(),
        url: '',
        baseLayer: {
            name: {
                fr: 'urbisFRGray',
                nl: 'urbisNLGray',
            },
            srs: 'EPSG:31370',
            params: {
                LAYERS: {
                    fr: 'urbisFRGray',
                    nl: 'urbisNLGray',
                },
                VERSION: '1.1.1',
            },
            url: {
                fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            },
        },
    });


const showLayer =
    (i: Inspire) => {
        const mid = uuid();
        const lm = makeLayerMap(mid, i);
        dispatch('data/maps', maps => maps.concat(lm));
        tableEvents.reset();
        appEvents.setCurrentMapId(mid);
        appEvents.setCurrentLayerId(makeLayerMapId(i));
        appEvents.loadLayer(i.uniqueResourceIdentifier,
            appQueries.getApiUrl(`layers/${i.uniqueResourceIdentifier}`));
        removeLayerAll();
        addLayer(() => appQueries.getLayerInfo(makeLayerMapId(i)));
    };


const editFeature =
    (fidx: number) => {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const layer = appQueries.getLayerData(lid);
            if (layer) {
                const feature = layer.features[fidx];
                if (!feature) {
                    return;
                }
                appEvents.setCurrentFeatureData(feature);

                if (queries.isReadonly()) {
                    appEvents.setLayout(AppLayout.LayerViewAndRow);
                }
                else {
                    appEvents.setLayout(AppLayout.LayerEditAndRow);
                }

                dispatch('component/layer-editor', (state) => {
                    const cp: NotNullProperties = {};
                    const props: NotNullProperties = !feature.properties ? {} : feature.properties;
                    Object.keys(props)
                        .forEach(k => cp[k] = props[k]);
                    state.rowForm = cp;
                    return state;
                });

                dispatch('port/map/editable', (state) => {
                    state.mode = 'modify';
                    state.selected = feature.id;
                    return state;
                });
            }
        }
    };

const events = {
    view(i: Inspire) {
        showLayer(i);
        dispatch('component/layer-editor', (state) => {
            state.readOnly = true;
            return state;
        });
        appEvents.setLayout(AppLayout.LayerViewAndInfo);
    },

    edit(i: Inspire) {
        showLayer(i);
        dispatch('component/layer-editor', (state) => {
            state.readOnly = false;
            return state;
        });

        dispatch('port/map/editable', (state) => {
            state.mode = 'select';
            state.geometryType = i.geometryType;
            state.selected = null;
            return state;
        });

        appEvents.setLayout(AppLayout.LayerEditAndInfo);
    },

    setCreateMode() {
        dispatch('port/map/editable', (state) => {
            state.mode = 'create';
            state.selected = null;
            return state;
        });
    },

    setSelectMode() {
        dispatch('port/map/editable', (state) => {
            state.mode = 'select';
            state.selected = null;
            return state;
        });
    },

    // When it comes from table
    editRow(row: TableDataRow) {
        editFeature(row.from);
    },

    // When it comes from map
    editFeature(fid: string | number) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const layer = appQueries.getLayerData(lid);
            if (layer) {
                editFeature(layer.features.findIndex(f => f.id === fid));
            }
        }
    },



    setFeatureProp(k: string, v: any) {
        dispatch('component/layer-editor', (state) => {
            if (null === state.rowForm) {
                state.rowForm = {};
            }
            state.rowForm[k] = v;
            return state;
        });
    },

    setGeometry(geom: DirectGeometryObject) {
        dispatch('component/layer-editor', (state) => {
            state.rowGeometry = geom;
            return state;
        });
    },


    cancelEdit() {
        dispatch('component/layer-editor', (state) => {
            state.rowForm = null;
            return state;
        });
        dispatch('port/map/editable', (state) => {
            state.mode = 'select';
            state.selected = null;
            return state;
        });
        appEvents.setLayout(AppLayout.LayerEditAndInfo);
    },

    saveEdit(id: string | number) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const updateLayer =
                (props: { [k: string]: any }, geom: DirectGeometryObject | null) =>
                    () => {
                        dispatch('data/layers', (layers) => {
                            const layer = layers[lid];
                            if (layer) {
                                const feature = layer.features.find(f => id === f.id);
                                if (feature) {
                                    feature.properties = props;
                                    if (geom) {
                                        feature.geometry = geom;
                                    }
                                }
                            }
                            syncLayer(lid, layer);
                            return layers;
                        });
                    };

            dispatch('component/layer-editor', (state) => {
                const props = state.rowForm;
                const geom = state.rowGeometry;
                if (props) {
                    setTimeout(updateLayer(props, geom), 1);
                }
                state.rowForm = null;
                return state;
            });
            dispatch('port/map/editable', (state) => {
                state.mode = 'select';
                state.selected = null;
                return state;
            });
            tableEvents.reset();
            appEvents.setLayout(AppLayout.LayerEditAndInfo);
        }
    },

    deleteFeature(id: string | number) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/layers', (layers) => {
                const layer = layers[lid];
                if (layer) {
                    const features = layer.features;
                    const idx = features.findIndex(f => id === f.id);
                    if (idx >= 0) {
                        layer.features.splice(idx, 1);
                    }
                }
                syncLayer(lid, layer);
                return layers;
            });

            dispatch('port/map/editable', (state) => {
                state.mode = 'select';
                state.selected = null;
                return state;
            });

            tableEvents.reset();
            removeLayerAll();
            addLayer(() => appQueries.getLayerInfo(lid));
        }
    },

    addFeature(feature: Feature) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/layers', (layers) => {
                const layer = layers[lid];
                if (layer) {
                    layer.features.push(feature);
                }
                syncLayer(lid, layer);
                return layers;
            });
            dispatch('component/layer-editor', (state) => {
                state.rowForm = null;
                return state;
            });
            dispatch('port/map/editable', (state) => {
                state.mode = 'modify';
                state.selected = feature.id;
                return state;
            });
            appEvents.setCurrentFeatureData(feature);
            appEvents.setLayout(AppLayout.LayerEditAndRow);
            tableEvents.reset();
        }
    },
};

export default events;
