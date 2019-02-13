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

import { dispatch, observe, dispatchK } from 'sdi/shape';
import { Feature, IMapInfo, MessageRecord } from 'sdi/source';
import { removeLayerAll, addLayer } from 'sdi/map';
import { getApiUrl } from 'sdi/app';
import { scopeOption } from 'sdi/lib';

import { AppLayout } from '../shape/types';
import { fetchLayer, fetchAlias, fetchAllMaps, fetchCategories, fetchDatasetMetadata, fetchMap, fetchAttachment, fetchBaseLayer, fetchBaseLayerAll, fetchLinks } from '../remote';
// import { addAppIdToFeature } from '../util/app';
import queries from '../queries/app';
import { fromNullable, none } from 'fp-ts/lib/Option';

const logger = debug('sdi:events/app');



const loadMap =
    (info: IMapInfo, delay?: number) => {
        const mapIsReady = queries.mapReady();
        logger(`loadMap ${info.id} ${mapIsReady} ${delay}`);
        if (mapIsReady) {
            removeLayerAll();
            info.layers.forEach((l) => {
                const url = getApiUrl(`metadatas/${l.metadataId}`);
                fetchDatasetMetadata(url)
                    .then((md) => {
                        const ruid = md.uniqueResourceIdentifier;
                        const url = getApiUrl(`layers/${ruid}`);
                        dispatch('data/datasetMetadata', (state) => {
                            state[md.id] = md;
                            return state;
                        });
                        if (l.visible) {
                            events.loadLayerData(ruid, url);
                            addLayer(
                                () => queries.getLayerInfo(l.id),
                                () => queries.getLayerData(ruid));
                        }
                    })
                    .catch(err => logger(`Failed to load MD ${l.metadataId}: ${err}`));
            });
        }
        else {
            const d = (delay !== undefined) ? (2 * delay) : 2;
            setTimeout(() => loadMap(info, d), d);
        }
    };

observe('data/maps',
    () => fromNullable(queries.getMapInfo()).map((mapInfo) => {
        mapInfo.layers.forEach(({ id }) => {
            const { info, metadata } = queries.getLayerInfo(id);
            if (info && metadata && info.visible) {
                queries.getLayerData(metadata.uniqueResourceIdentifier)
                    .map((data) => {
                        if (data.isNone()) {
                            const url = getApiUrl(`layers/${metadata.uniqueResourceIdentifier}`);
                            events.loadLayerData(metadata.uniqueResourceIdentifier, url);
                            addLayer(
                                () => queries.getLayerInfo(id),
                                () => queries.getLayerData(metadata.uniqueResourceIdentifier));
                        }
                    });
            }
        });
    }));


const findMap = (mid: string) => fromNullable(queries.getMap(mid));


const attachments = dispatchK('data/attachments');

observe('data/maps',
    () => fromNullable(queries.getMapInfo())
        .map(
            info => info.attachments.forEach(
                aid => fetchAttachment(getApiUrl(`attachments/${aid}`))
                    .then(a => attachments(s => s.concat([a]))))));

const loadLinks =
    (mid: string) =>
        fetchLinks(getApiUrl(`map/links/${mid}`))
            .then((links) => {
                dispatch('data/links', data => ({ ...data, [mid]: links }));
            });

const events = {


    setLayout(l: AppLayout) {
        logger(`setLayout ${AppLayout[l]}`);
        dispatch('app/layout', state => state.concat([l]));
    },

    signalReadyMap() {
        dispatch('app/map-ready', () => true);
    },


    loadMap() {
        fromNullable(queries.getCurrentMap())
            .map(
                (mid) => {
                    findMap(mid)
                        .foldL(
                            () => {
                                fetchMap(getApiUrl(`maps/${mid}`))
                                    .then((info) => {
                                        dispatch('data/maps', maps => maps.concat([info]));
                                        loadMap(info);
                                    })
                                    .then(() => loadLinks(mid));
                            },
                            (info) => {
                                loadLinks(mid);
                                loadMap(info);
                            },
                        );


                });
    },

    loadBaseLayer(id: string, url: string) {
        fetchBaseLayer(url)
            .then((bl) => {
                dispatch('data/baselayers', state => ({ ...state, [id]: bl }));
            });
    },

    loadAllBaseLayers(url: string) {
        fetchBaseLayerAll(url)
            .then((blc) => {
                dispatch('data/baselayers', () => blc);
            });
    },

    loadAllMaps() {
        fetchAllMaps(getApiUrl(`maps`))
            .then((maps) => {
                dispatch('data/maps', () => maps);
            });
    },

    loadLayerData(id: string, url: string) {
        fetchLayer(url)
            .then((layer) => {
                dispatch('data/layers', (state) => {
                    logger(`Put layer ${id} ${url} on state`);
                    state[id] = layer;
                    return state;
                });
            })
            .catch((err) => {
                logger(`Failed to load layer at ${url} due to ${err}`);
                dispatch('remote/errors', state => ({ ...state, [id]: `${err}` }));
            });
    },

    loadAlias(url: string) {
        fetchAlias(url)
            .then((alias) => {
                dispatch('data/alias', () => alias);
            });
    },

    loadCategories(url: string) {
        fetchCategories(url)
            .then((categories) => {
                dispatch('data/categories', () => categories);
            });
    },

    setLayerVisibility(id: string, visible: boolean) {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const mapInfo = maps.find(m => m.id === mid);
            if (mapInfo) {
                mapInfo.layers.forEach((l) => {
                    if (l.id === id) {
                        l.visible = visible;
                    }
                });
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
            }

            return maps;
        });
    },

    setCurrentLayer(id: string) {
        dispatch('app/current-layer', () => id);
        dispatch('app/current-feature', () => null);
        dispatch('component/table', state => ({
            ...state,
            selected: -1,
            loaded: 'none',
        }));
    },

    setCurrentFeature(data: Feature | null) {
        dispatch('app/current-feature', () => data);
    },


    /**
     * s => s.m.layers.reduce((acc, l) => {
                const { metadata } = queries.getLayerInfo(l.id);
                if (metadata) {
                    const data = queries.getLayerData(metadata.uniqueResourceIdentifier);
                    if ()
                }
     */

    setCurrentFeatureById(layerInfoId: string, id: string | number) {

        scopeOption()
            .let('md',
                () => fromNullable(
                    queries.getLayerInfo(layerInfoId).metadata))
            .let('data',
                s => queries.getLayerData(
                    s.md.uniqueResourceIdentifier).getOrElse(none))
            .let('feature',
                s => fromNullable(
                    s.data.features.find(f => f.id === id)))
            .map(({ feature }) => {
                dispatch('app/current-layer', () => layerInfoId);
                dispatch('app/current-feature', () => feature);
            });

        // scopeOption()
        //     .let('mid', fromNullable(queries.getCurrentMap()))
        //     .let('cm', s => fromNullable(queries.getMap(s.mid)))
        //     .map(({ cm }) => fromNullable(cm.layers.find)(
        //         l => getFeature().map((f) => {
        //             dispatch('app/current-layer', () => l.id);
        //             dispatch('app/current-feature', () => f);
        //         })));
    },

    unsetCurrentFeature() {
        dispatch('app/current-feature', () => null);
    },

    clearMap() {
        dispatch('app/current-map', () => null);
        dispatch('app/current-layer', () => null);
        dispatch('app/current-feature', () => null);
        dispatch('component/table', (state) => {
            state.selected = -1;
            return state;
        });
    },
};

export default events;

export const setPrintTitle =
    (customTitle: MessageRecord) =>
        dispatch('component/print',
            s => ({ ...s, customTitle }));

export const resetPrintTitle =
    () =>
        dispatch('component/print',
            s => ({ ...s, customTitle: null }));


logger('loaded');
