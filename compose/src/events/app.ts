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
import { Setoid } from 'fp-ts/lib/Setoid';

import { dispatch, observe } from 'sdi/shape';
import {
    defaultStyle,
    Feature,
    ILayerInfo,
    IMapInfo,
    Inspire,
    MessageRecord,
} from 'sdi/source';
import { getApiUrl } from 'sdi/app';
import { addLayer, removeLayerAll } from 'sdi/map';
import { uniq } from 'sdi/util';

import {
    fetchAlias,
    fetchAllDatasetMetadata,
    fetchCategories,
    fetchDatasetMetadata,
    fetchLayer,
    fetchMap,
    fetchUser,
    fetchBaseLayer,
    postLayerInfo,
    postMap,
    putMap,
    deleteMap,
} from '../remote';
import queries from '../queries/app';
import { AppLayout } from '../shape/types';
import { initialLegendEditorState } from '../components/legend-editor/index';
import { getDatasetMetadata } from '../queries/metadata';
import { navigateMap, navigateHome } from './route';

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

const inspireS: Setoid<Inspire> = {
    equals(a, b) {
        return a.id === b.id;
    },
};

const uniqInspire = uniq(inspireS);

// observe('data/user', (user: IUser) => {
//     if (user) {
//         logger(`user changed, loading maps ${user.maps}`);
//         user.maps.forEach((mid) => {
//             events.loadMap(getApiUrl(`maps/${mid}`));
//         });
//         user.layers.forEach((lid) => {
//             events.loadDatasetMetadata(getApiUrl(`dataset-metadata/${lid}`));
//         });
//     }
// });


const loadLayerData =
    (md: Inspire) => events.loadLayer(md.uniqueResourceIdentifier,
        getApiUrl(`layers/${md.uniqueResourceIdentifier}`));

observe('data/maps', () => {
    const info = queries.getMapInfo();
    if (info) {
        info.layers.forEach((l) => {
            getDatasetMetadata(l.metadataId)
                .foldL(
                    () =>
                        fetchDatasetMetadata(getApiUrl(`metadatas/${l.metadataId}`))
                            .then(loadLayerData)
                            .catch(err => logger(`observe(data/maps) ${err}`)),
                    md => Promise.resolve(loadLayerData(md)));
        });
    }
});


observe('app/current-map', () => {
    const info = queries.getMapInfo();
    if (info) {
        removeLayerAll();
        info.layers.forEach((l) => {
            fetchDatasetMetadata(getApiUrl(`metadatas/${l.metadataId}`))
                .then((md) => {
                    events.loadLayer(md.uniqueResourceIdentifier,
                        getApiUrl(`layers/${md.uniqueResourceIdentifier}`));
                    addLayer(
                        () => queries.getLayerInfo(l.id),
                        () => queries.getLayerData(md.uniqueResourceIdentifier),
                    );
                })
                .catch(err => logger(`observe(app/current-map) ${err}`));
        });
    }
});


const makeMap =
    (): IMapInfo => {
        return {
            status: 'draft',
            title: { fr: '', nl: '' },
            description: { fr: '', nl: '' },
            attachments: [],
            layers: [],
            categories: [],
            lastModified: Date.now(),
            url: '',
            baseLayer: 'urbis.irisnet.be/urbis_gray',
        };
    };

const events = {

    loadUser(url: string) {
        fetchUser(url)
            .then((user) => {
                logger(`got user`);
                dispatch('data/user', () => user);
                user.maps.forEach((mid) => {
                    events.loadMap(getApiUrl(`maps/${mid}`));
                });
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

    loadBaseLayer(id: string, url: string) {
        fetchBaseLayer(url)
            .then((bl) => {
                dispatch('data/baselayers', state => ({ ...state, [id]: bl }));
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

    loadDatasetMetadata(url: string) {
        fetchDatasetMetadata(url)
            .then(md =>
                dispatch('data/datasetMetadata',
                    state => state.filter(i => i.id !== md.id).concat([md])));
    },

    loadAllDatasetMetadata(done?: () => void) {
        dispatch('component/table',
            ts => ({ ...ts, loaded: 'loading' }));

        fetchAllDatasetMetadata(getApiUrl('metadatas'))(
            (frame) => {
                dispatch('data/datasetMetadata',
                    state => uniqInspire(state.concat(frame.results)));
                dispatch('component/table',
                    ts => ({ ...ts, loaded: 'loading' }));
                dispatch('component/splash', () => Math.floor(frame.page * 100 / frame.total));
            },
            () => {
                dispatch('component/table',
                    ts => ({ ...ts, loaded: 'done' }));
                if (done) {
                    done();
                }
            });
    },


    setLayerVisibility(id: string, visible: boolean) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.layers.forEach((l) => {
                    if (l.id === id) {
                        l.visible = visible;
                    }
                });
                setTimeout(() => {
                    putMap(getApiUrl(`maps/${mid}`), m);
                }, 1);
            }
            return maps;
        });
    },


    setCurrentMapId(id: string | null) {
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
                    putMap(getApiUrl(`maps/${mid}`), m);
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
                    putMap(getApiUrl(`maps/${mid}`), m);
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
                    group: null,
                    legend: null,
                    minZoom: 0,
                    maxZoom: 30,
                };
                postLayerInfo(getApiUrl(`layerinfos`), info)
                    .then((result) => {
                        logger(`Recorded Layer ${result.id} / ${result.metadataId}`);
                        m.layers.push(result);
                        putMap(getApiUrl(`maps/${mid}`), m)
                            .then(() => {
                                addLayer(
                                    () => queries.getLayerInfo(result.id),
                                    () => queries.getLayerData(i.uniqueResourceIdentifier),
                                );
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
        postMap(getApiUrl(`maps`), makeMap())
            .then((map) => {
                if (map.id) {
                    const mid = map.id;
                    dispatch('data/maps', state => state.concat([map]));
                    dispatch('data/user', (user) => {
                        if (user && user.id) {
                            user.maps = user.maps.concat([mid]);
                        }
                        return user;
                    });
                    navigateMap(mid);
                }
            });
    },

    deleteMap(id: string) {
        navigateHome();
        deleteMap(getApiUrl(`maps/${id}`))
            .then(() =>
                dispatch('data/maps', state => state.filter(m => m.id !== id)))
            .catch(err => logger(`Failed to delete map ${id} ${err}`));
    },


    removeCategory(c: string) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                m.categories = m.categories.filter(mc => mc !== c);
                setTimeout(() => {
                    putMap(getApiUrl(`maps/${mid}`), m);
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
                    putMap(getApiUrl(`maps/${mid}`), m);
                }, 1);
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
                    putMap(getApiUrl(`maps/${mid}`), maps[idx]);
                }, 1);
            }

            return maps;
        });
    },


    setMapBaseLayer(id: string) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);

            if (idx !== -1) {
                const m = maps[idx];
                m.baseLayer = id;

                setTimeout(() => {
                    putMap(getApiUrl(`maps/${mid}`), m);
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
