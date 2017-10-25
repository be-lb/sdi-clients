
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
import * as uuid from 'uuid';
import { dispatch, observe } from 'sdi/shape';
import { AppLayout } from '../shape/types';
import {
    fetchAlias,
    fetchAllDatasetMetadata,
    fetchCategories,
    fetchDatasetMetadata,
    fetchLayer,
    fetchMap,
    fetchUser,
    postLayerInfo,
    postMap,
    postUser,
    putMap,
    upload,
} from '../remote';
import {
    defaultStyle,
    Feature,
    ILayerInfo,
    IMapBaseLayer,
    IMapInfo,
    Inspire,
    IUser,
    MessageRecord,
} from 'sdi/source';
import queries from '../queries/app';
import { addLayer, removeLayerAll } from '../ports/map';
import { initialLegendEditorState } from '../components/legend-editor/index';

const logger = debug('sdi:events/app');


export const toDataURL = (f: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.onabort = reject;
        reader.readAsDataURL(f);
    });
};

observe('data/user', (user: IUser) => {
    if (user) {
        logger(`user changed, loading maps ${user.maps}`);
        user.maps.forEach((mid) => {
            events.loadMap(queries.getApiUrl(`maps/${mid}`));
        });
        user.layers.forEach((lid) => {
            events.loadDatasetMetadata(lid, queries.getApiUrl(`dataset-metadata/${lid}`));
        });
    }
});




observe('data/maps', () => {
    const info = queries.getMapInfo();
    if (info) {
        info.layers.forEach((l) => {
            fetchDatasetMetadata(queries.getApiUrl(`metadatas/${l.metadataId}`))
                .then((md) => {
                    events.loadLayer(md.uniqueResourceIdentifier,
                        queries.getApiUrl(`layers/${md.uniqueResourceIdentifier}`));
                })
                .catch(err => logger(`observe(data/maps) ${err}`));
        });
    }
});


observe('app/current-map', () => {
    const info = queries.getMapInfo();
    if (info) {
        removeLayerAll();
        info.layers.forEach((l) => {
            // events.loadLayer(l.id, queries.getApiUrl(`layers/${l.id}`));
            // addLayer(() => queries.getLayerInfo(l.id));
            fetchDatasetMetadata(queries.getApiUrl(`metadatas/${l.metadataId}`))
                .then((md) => {
                    events.loadLayer(md.uniqueResourceIdentifier,
                        queries.getApiUrl(`layers/${md.uniqueResourceIdentifier}`));
                    addLayer(() => queries.getLayerInfo(l.id));
                })
                .catch(err => logger(`observe(app/current-map) ${err}`));
        });
    }
});


const makeMap = (): IMapInfo => {
    return {
        title: { fr: '.', nl: '.' },
        description: { fr: '.', nl: '.' },
        attachments: [],
        layers: [],
        categories: [],
        lastModified: Date.now(),
        url: '',
        baseLayer: {
            name: {
                fr: 'urbisFRGray',
                nl: 'urbisNLGray', // ?
            },
            srs: 'EPSG:31370',
            params: {
                LAYERS: {
                    fr: 'urbisFRGray',
                    nl: 'urbisNLGray', // ?
                },
                VERSION: '1.1.1',
            },
            url: {
                fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            },
        },
    };
};

const events = {

    loadUser(url: string) {
        fetchUser(url)
            .then((user) => {
                logger(`got user`)
                dispatch('data/user', () => user);
            });
    },




    setLayout(l: AppLayout) {
        dispatch('app/layout', state => state.concat([l]));
    },

    signalReadyMap() {
        dispatch('app/map-ready', () => true);
    },


    loadMap(url: string) {
        fetchMap(url)
            .then((map) => {
                dispatch('data/maps', (state) => {
                    return (
                        state.filter(m => m.id !== map.id)
                            .concat([map])
                    );
                });
            });
    },


    loadLayer(id: string, url: string) {
        const lyr = queries.getLayerData(id);
        if (!lyr) {
            fetchLayer(url)
                .then((layer) => {
                    dispatch('data/layers', (state) => {
                        if (id in state) {
                            return state;
                        }
                        // layer.features.forEach(addAppIdToFeature);
                        state[id] = layer;
                        return state;
                    });
                })
                .catch(e => logger(e));

        }
    },

    loadCategories(url: string) {
        fetchCategories(url)
            .then((categories) => {
                dispatch('data/categories', () => categories);
            });
    },

    loadAlias(url: string) {
        fetchAlias(url)
            .then((alias) => {
                dispatch('data/alias', () => alias);
            });
    },


    loadDatasetMetadata(id: string, url: string) {
        fetchDatasetMetadata(url)
            .then((datasetMetadata) => {
                dispatch('data/datasetMetadata', (state) => {
                    if (!(id in state)) {
                        state[id] = datasetMetadata;
                    }

                    return state;
                });
            });
    },

    loadAllDatasetMetadata() {
        fetchAllDatasetMetadata(queries.getApiUrl('metadatas'))
            .then((mds) => {
                mds.forEach((md) => {
                    dispatch('data/datasetMetadata', (state) => {
                        const id = md.id;
                        if (!(id in state)) {
                            state[id] = md;
                        }
                        return state;
                    });
                });
            });
    },


    setLayerVisibility(id: string, visible: boolean) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                maps[idx].layers.forEach((l) => {
                    if (l.id === id) {
                        l.visible = visible;
                    }
                });
            }
            return maps;
        });
    },


    setCurrentMapId(id: string) {
        dispatch('app/current-map', () => id);
        dispatch('app/current-layer', () => null);
        dispatch('app/current-feature', () => null);
    },

    setCurrentLayerId(id: string) {
        dispatch('app/current-layer', () => id);
        dispatch('app/current-feature', () => null);
        dispatch('component/table', (state) => {
            state.selected = -1;
            return state;
        });
    },

    setCurrentFeatureData(data: Feature) {
        dispatch('app/current-feature', () => data);
    },

    unsetCurrentFeatureData() {
        dispatch('app/current-feature', () => null);
    },


    setMapTitle(r: MessageRecord) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.title = r;
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },

    setMapDescription(r: MessageRecord) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.description = r;
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },

    addMapLayer(i: Inspire) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                const id = uuid();
                const info: ILayerInfo = {
                    id,
                    metadataId: i.id,
                    visible: true,
                    featureViewOptions: { type: 'default' },
                    style: defaultStyle(i.geometryType),
                };
                postLayerInfo(queries.getApiUrl(`layerinfos`), info)
                    .then((result) => {
                        logger(`Recorded Layer ${result.id} / ${result.metadataId}`);
                        m.layers.push(result);
                        putMap(queries.getApiUrl(`maps/${mid}`), m)
                            .then(() => {
                                addLayer(() => queries.getLayerInfo(result.id));
                                events.setCurrentLayerId(result.id);
                            })
                            .catch(err => logger(`addMapLayer map ${err}`));

                    })
                    .catch(err => logger(`addMapLayer layer info ${err}`));

            }
            return maps;
        });
    },

    newMap() {
        postMap(queries.getApiUrl(`maps`), makeMap())
            .then((map) => {
                if (map.id) {
                    const mid = map.id;
                    dispatch('data/maps', state => state.concat([map]));
                    dispatch('data/user', (user) => {
                        if (user && user.id) {
                            user.maps = user.maps.concat([mid]);
                            postUser(
                                queries.getApiUrl(`users/${user.id}`), user);
                        }
                        return user;
                    });
                    events.setCurrentMapId(mid);
                    events.setLayout(AppLayout.MapAndInfo);
                }
            });
    },

    setAttachmentName(k: number, name: MessageRecord) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                if (k < m.attachments.length) {
                    m.attachments[k].name = name;
                }
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },

    removeAttachment(k: number) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                if (k < m.attachments.length) {
                    m.attachments.splice(k, 1);
                }
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },

    addAttachment() {
        const mid = queries.getCurrentMap();

        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.attachments.push({
                    url: { nl: '', fr: '' },
                    name: { nl: '', fr: '' },
                });

                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }

            return maps;
        });
    },

    removeCategory(c: string) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.categories = m.categories.filter(mc => mc !== c);
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },

    addCategory(c: string) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.categories.push(c);
                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }

            return maps;
        });
    },

    uploadAttachmentFile(k: number, f: File) {
        const mid = queries.getCurrentMap();
        const name = f.name;
        const lc = queries.getLang();
        const ts = Date.now().toString();

        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);

            if (idx !== -1) {
                const m = maps[idx];
                const attachment = m.attachments[k];
                attachment.name[lc] = name;
                attachment.url[lc] = ts;

                upload('/documents/documents/', f)
                    .then((data) => {
                        const { url } = data;
                        dispatch('data/maps', (maps) => {
                            const idx = maps.findIndex(m => m.id === mid);

                            if (idx !== -1) {
                                const m = maps[idx];
                                const aidx = m.attachments.findIndex(a => a.url[lc] === ts);

                                if (aidx !== -1) {
                                    m.attachments[aidx].url[lc] = url;

                                    setTimeout(() => {
                                        putMap(queries.getApiUrl(`maps/${mid}`), m);
                                    }, 1);
                                }
                            }

                            return maps;
                        });
                    }).catch(() => {
                        dispatch('data/maps', (maps) => {
                            const idx = maps.findIndex(m => m.id === mid);

                            if (idx !== -1) {
                                const m = maps[idx];
                                const aidx = m.attachments.findIndex(a => a.url[lc] === ts);

                                if (aidx !== -1) {
                                    m.attachments[aidx].name[lc] = '';
                                    m.attachments[aidx].url[lc] = '';

                                    setTimeout(() => {
                                        putMap(queries.getApiUrl(`maps/${mid}`), m);
                                    }, 1);
                                }
                            }

                            return maps;
                        });
                    });
            }

            return maps;
        });

    },


    removeMapInfoIllustration() {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);

            if (idx !== -1) {
                maps[idx].imageUrl = undefined;

                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), maps[idx]);
                }, 1);
            }

            return maps;
        });
    },


    setMapBaseLayer(l: IMapBaseLayer) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);

            if (idx !== -1) {
                const m = maps[idx];
                m.baseLayer = l;

                setTimeout(() => {
                    putMap(queries.getApiUrl(`maps/${mid}`), m);
                }, 1);
            }

            return maps;
        });
    },

    resetLegendEditor() {
        dispatch('component/legend-editor', () => initialLegendEditorState());
    },
};

export default events;

logger('loaded');
