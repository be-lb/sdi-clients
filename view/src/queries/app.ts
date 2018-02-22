
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

import { fromNullable } from 'fp-ts/lib/Option';

import { query } from 'sdi/shape';
import { getMessageRecord, IMapInfo } from 'sdi/source';
import { SyntheticLayerInfo } from 'sdi/app';


const queries = {
    mapReady() {
        return query('app/map-ready');
    },

    getLayout() {
        const ll = query('app/layout');
        if (ll.length === 0) {
            throw (new Error('PoppingEmptyLayoutList'));
        }
        return ll[ll.length - 1];
    },

    getLayerData(id: string) {
        const layers = query('data/layers');
        if (id in layers) {
            return layers[id];
        }
        return null;
    },

    getMap(mid: string) {
        const maps = query('data/maps');
        return maps.find(m => m.id === mid);
    },

    getDatasetMetadata(id: string) {
        const collection = query('data/datasetMetadata');
        if (id in collection) {
            return collection[id];
        }
        return null;
    },

    getMapInfo() {
        const mid = query('app/current-map');
        const info = query('data/maps').find(m => m.id === mid);
        return (info !== undefined) ? info : null;
    },

    getLayerInfo(layerId: string): SyntheticLayerInfo {
        const mid = query('app/current-map');
        const info = query('data/maps').find(m => m.id === mid);
        if (info) {
            const layers = info.layers;
            const layerInfo = layers.find(l => l.id === layerId);
            if (layerInfo) {
                const metadata = queries.getDatasetMetadata(layerInfo.metadataId);
                if (metadata) {
                    return {
                        name: getMessageRecord(metadata.resourceTitle),
                        info: layerInfo,
                        metadata,
                    };
                }
            }
        }
        return { name: null, info: null, metadata: null };
    },

    getCurrentMap() {
        return query('app/current-map');
    },

    getCurrentLayer() {
        return query('app/current-layer');
    },

    getCurrentLayerInfo() {
        const lid = query('app/current-layer');
        if (lid) {
            return queries.getLayerInfo(lid);
        }
        return { name: null, info: null, metadata: null };
    },

    getCurrentFeature() {
        return query('app/current-feature');
    },

    getCurrentBaseLayerName() {
        const mid = query('app/current-map');
        const map = query('data/maps').find(m => m.id === mid);
        if (map) {
            return map.baseLayer;
        }
        return null;
    },

    gteBaseLayer(id: string | null) {
        const bls = query('data/baselayers');
        if (id && id in bls) {
            return bls[id];
        }
        return null;
    },

    getCurrentBaseLayer() {
        const name = queries.getCurrentBaseLayerName();
        return queries.gteBaseLayer(name);
    },

    getBaseLayerServices() {
        const names = Object.keys(query('data/baselayers')).map(id => id.split('/')[0]);
        return names.reduce<string[]>((acc, name) => {
            if (acc.indexOf(name) >= 0) {
                return acc;
            }
            return acc.concat([name]);
        }, []);
    },

    getBaseLayersForService(name: string) {
        const collection = query('data/baselayers');
        const layers =
            Object.keys(collection)
                .filter(id => id.split('/')[0] === name);
        return layers;
    },

};

export default queries;


export const hasPrintTitle =
    () => null === query('component/print').customTitle;

export const getPrintTitle =
    (info: IMapInfo) =>
        fromNullable(query('component/print').customTitle)
            .fold(
                info.title,
                s => s);

