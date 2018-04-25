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

import { Option, none } from 'fp-ts/lib/Option';

import { queryK } from 'sdi/shape';
import {
    TableDataRow,
    TableDataType,
    tableQueries,
    emptySource,
} from 'sdi/components/table';
import {
    FeatureCollection,
    Feature,
    Properties,
} from 'sdi/source';
import { getLayerPropertiesKeys } from 'sdi/util';

import appQueries from './app';


// Layer / FeatureCollection

export const getLayer =
    (): Option<FeatureCollection> => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        if (metadata !== null) {
            return appQueries.getLayerData(metadata.uniqueResourceIdentifier).getOrElse(none);

        }
        return none;
    }

export const getLayerOption =
    () => getLayer();

export const getFeatureData =
    (numRow: number): Feature | null =>
        getLayer().fold(null,
        (layer) => {
            if (layer && numRow >= 0 && numRow < layer.features.length) {
                return layer.features[numRow];
            }
            return null;
        });

const getLayerData =
    (layer: FeatureCollection): TableDataRow[] => {
        const keys = getLayerKeys(layer);
        const features = layer.features;

        return (
            features.map<TableDataRow>((f) => {
                if ('properties' in f) {
                    const props: Properties = f.properties;
                    const row = keys.map((k) => {
                        if (props && props[k] && props[k] != null) {
                            return props[k].toString();
                        }

                        return '';
                    });
                    return { from: f.id, cells: row };
                }

                return { from: 'empy-row', cells: [] };
            }).filter(r => r.cells.length > 0)
        );
    }

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
    () => getLayerOption().fold(emptySource(),
        layer => ({
            data: getLayerData(layer),
            keys: getLayerKeys(layer),
            types: getLayerTypes(layer),
        }));



export const layerTableQueries = tableQueries(queryK('component/table'), getSource);

export const getSelectedFeature =
    () => layerTableQueries.getSelected();

export const getFeatureRow =
    (idx: number) => layerTableQueries.getRow(idx);

export const getSelectedFeatureRow =
    () => getFeatureRow(getSelectedFeature());


