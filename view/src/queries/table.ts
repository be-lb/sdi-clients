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

import { FeatureCollection, Feature } from 'sdi/source';
import { queryK, subscribe } from 'sdi/shape';
import { getLayerPropertiesKeys } from 'sdi/util';
import {
    TableDataRow,
    TableDataType,
    tableQueries,
    emptySource,
} from 'sdi/components/table';

import appQueries from './app';
import { withExtract } from './map';


type ObjOrNull = { [k: string]: any } | null;


// Layer / FeatureCollection

export const getLayer =
    (): FeatureCollection | null => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        if (metadata !== null) {
            const layer = appQueries.getLayerData(metadata.uniqueResourceIdentifier);

            if (layer !== null) {
                return layer;
            }
        }
        return null;
    }

export const getLayerOption =
    () => fromNullable(getLayer());

export const getFeatureData =
    (numRow: number): Feature | null => {
        const layer = getLayer();
        if (layer && numRow >= 0 && numRow < layer.features.length) {
            return layer.features[numRow];
        }
        return null;
    }

const getLayerData =
    (layer: FeatureCollection): TableDataRow[] => {
        const keys = getLayerKeys(layer);
        const features = withExtract().fold(
            () => layer.features,
            ({ state }) => layer.features.filter(f => state.findIndex(fe => (
                fe.featureId === f.id)) >= 0)
        );

        return (
            features.map<TableDataRow>((f) => {
                if ('properties' in f) {
                    const props: ObjOrNull = f.properties;
                    const row = keys.map((k) => {
                        if (props && props[k] && props[k] != null) {
                            return props[k].toString();
                        }

                        return '';
                    });
                    return { from: f.id, cells: row };
                }

                return { from: -1, cells: [] };
            }).filter(r => r.from >= 0)
        );
    };

const getLayerKeys =
    (layer: FeatureCollection) => getLayerPropertiesKeys(layer);

const getLayerTypes =
    (layer: FeatureCollection): TableDataType[] => {
        const keys = getLayerKeys(layer);
        if (layer.features.length > 0) {
            const row = layer.features[0].properties;
            if (row != null) {
                return keys.map((k) => {
                    const val = row[k];

                    if (val == null) {
                        return 'null';
                    }
                    else {
                        switch (typeof val) {
                            case 'string': return 'string';
                            case 'number': return 'number';
                            case 'boolean': return 'boolean';
                        }
                    }

                    return 'invalid';
                });
            }
        }

        return [];
    }

export const getSource =
    subscribe('app/current-layer',
        () => getLayerOption().fold(emptySource,
            layer => ({
                data: getLayerData(layer),
                keys: getLayerKeys(layer),
                types: getLayerTypes(layer),
            })),
        'app/current-map',
        'data/layers',
        'data/maps',
        'port/map/interaction');



export const layerTableQueries = tableQueries(queryK('component/table'), getSource);
