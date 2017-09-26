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

import { dispatch, observe } from './index';
import { AppLayout } from '../shape';
import { Feature, IMapInfo } from 'sdi/source';
import { fetchLayer, fetchAlias, fetchAllMaps, fetchCategories, fetchDatasetMetadata } from '../remote';
// import { addAppIdToFeature } from '../util/app';
import { removeLayerAll, addLayer } from '../ports/map';
import queries from '../queries/app';
import * as debug from 'debug';

const logger = debug('sdi:events/app');

const loadMap =
    (info: IMapInfo, delay?: number) => {
        const mapIsReady = queries.mapReady();
        logger(`loadMap ${info.id} ${mapIsReady} ${delay}`);
        if (mapIsReady) {
            info.layers.forEach((l) => {
                const url = queries.getApiUrl(`metadatas/${l.metadataId}`);
                fetchDatasetMetadata(url)
                    .then((md) => {
                        const ruid = md.uniqueResourceIdentifier;
                        const url = queries.getApiUrl(`layers/${ruid}`);
                        dispatch('data/datasetMetadata', (state) => {
                            state[md.id] = md;
                            return state;
                        });
                        events.loadLayer(ruid, url);
                    })
                    .catch(err => logger(`Failed to load MD ${l.metadataId}: ${err}`));
            });
        }
        else {
            const d = (delay !== undefined) ? (2 * delay) : 2;
            setTimeout(() => loadMap(info, d), d);
        }
    };

observe('app/current-map', () => {
    const info = queries.getMapInfo();
    if (info) {
        loadMap(info);
    }
});


const reloadLayers =
    () => {
        const info = queries.getMapInfo();
        logger(`reload layers ${info}`);
        if (info) {
            removeLayerAll();
            info.layers.forEach((l) => {
                addLayer(() => queries.getLayerInfo(l.id));
            });
        }
    };

observe('data/layers', reloadLayers);
observe('data/datasetMetadata', reloadLayers);

const events = {
    setLang(lc: 'fr' | 'nl') {
        dispatch('app/lang', () => lc);
    },

    setLayout(l: AppLayout) {
        logger(`setLayout ${AppLayout[l]}`);
        dispatch('app/layout', state => state.concat([l]));
    },

    signalReadyMap() {
        dispatch('app/map-ready', () => true);
    },

    bootMap() {
        const mid = queries.getCurrentMap();
        if (mid) {
            const info = queries.getMap(mid);
            events.setLayout(AppLayout.MapAndInfo);
            if (!info) {
                setTimeout(events.bootMap, 100);
            }
            else {
                loadMap(info);
            }
        }
    },

    loadMaps(url: string) {
        fetchAllMaps(url)
            .then((maps) => {
                dispatch('data/maps', () => maps);
            });
    },

    loadLayer(id: string, url: string) {
        fetchLayer(url)
            .then((layer) => {
                dispatch('data/layers', (state) => {
                    // layer.features.forEach(addAppIdToFeature);
                    logger(`Put layer ${id} ${url} on state`);
                    state[id] = layer;
                    return state;
                });
            })
            .catch(err => logger(`Failed to load layer at ${url} due to ${err}`));
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

    setCurrentLayer(id: string) {
        dispatch('app/current-layer', () => id);
        dispatch('app/current-feature', () => null);
        dispatch('component/table', (state) => {
            state.selected = -1;
            return state;
        });
    },

    setCurrentFeature(data: Feature | null) {
        dispatch('app/current-feature', () => data);
    },

    unsetCurrentFeature() {
        dispatch('app/current-feature', () => null);
    },
};

export default events;


logger('loaded');
