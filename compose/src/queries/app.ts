
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

import { Option, none, some } from 'fp-ts/lib/Option';
import { Either, right, left } from 'fp-ts/lib/Either';

import { query } from 'sdi/shape';
import { getMessageRecord, FeatureCollection } from 'sdi/source';
import { SyntheticLayerInfo } from 'sdi/app';

import { getDatasetMetadata } from './metadata';


type FCContext = (fc: FeatureCollection) => FeatureCollection;


const queries = {

    getUserData() {
        return query('data/user');
    },


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


    getLayerData(id: string): Either<string, Option<FeatureCollection>> {
        const layers = query('data/layers');
        const errors = query('remote/errors');
        if (id in layers) {
            return right(some<FeatureCollection>(layers[id]));
        }
        else if (id in errors) {
            return left(errors[id]);
        }
        return right(none);
    },


    getLayerDataWithContext(id: string, context: FCContext) {
        const layers = query('data/layers');
        if (id && id in layers) {
            return context(layers[id]);
        }
        return null;
    },


    getMap(mid: string) {
        const maps = query('data/maps');
        return maps.find(m => m.id === mid);
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
                return getDatasetMetadata(layerInfo.metadataId).fold<SyntheticLayerInfo>(
                    { name: null, info: null, metadata: null },
                    metadata => ({
                        name: getMessageRecord(metadata.resourceTitle),
                        info: layerInfo,
                        metadata,
                    })
                );
            }
        }
        return { name: null, info: null, metadata: null };
    },


    getCurrentMap() {
        return query('app/current-map');
    },


    getCurrentLayerId() {
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

    getCurrentBaseLayer() {
        const name = queries.getCurrentBaseLayerName();
        const bls = query('data/baselayers');
        if (name && name in bls) {
            return bls[name];
        }
        return null;
    },


    getCategories() {
        return query('data/categories');
    },


    getSplash() {
        return query('component/splash');
    },
};

export default queries;
