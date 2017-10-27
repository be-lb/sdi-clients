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

import { FeatureCollection, Feature } from 'sdi/source';
import { getLayerPropertiesKeys } from 'sdi/util';
import { TableDataRow, TableDataType } from 'sdi/components/table';

import appQueries from './app';


type ObjOrNull = { [k: string]: any } | null;

const queries = {



    // Layer / FeatureCollection

    getLayer(): FeatureCollection | null {
        const { metadata } = appQueries.getCurrentLayerInfo();
        if (metadata !== null) {
            const layer = appQueries.getLayerData(metadata.uniqueResourceIdentifier);

            if (layer !== null) {
                return layer;
            }
        }
        return null;
    },

    getFeatureData(numRow: number): Feature | null {
        const layer = queries.getLayer();
        if (layer && numRow >= 0 && numRow < layer.features.length) {
            return layer.features[numRow];
        }
        return null;
    },

    loadLayerKeys() {
        const layer = queries.getLayer();
        if (layer) {
            return getLayerPropertiesKeys(layer);
        }
        return null;
    },

    loadLayerData(): TableDataRow[] {
        const layer = queries.getLayer();
        const keys = queries.loadLayerKeys();
        if (keys && layer && layer.features.length > 0) {
            const features = layer.features;

            return (
                features.map<TableDataRow>((f, idx) => {
                    if ('properties' in f) {
                        const props: ObjOrNull = f.properties;
                        const row = keys.map((k) => {
                            if (props && props[k] && props[k] != null) {
                                return props[k].toString();
                            }

                            return '';
                        });
                        return { from: idx, cells: row };
                    }

                    return { from: -1, cells: [] };
                }).filter(r => r.from >= 0)
            );
        }

        return [];
    },

    loadLayerTypes(): TableDataType[] {
        const layer = queries.getLayer();
        const keys = queries.loadLayerKeys();
        if (keys && layer && layer.features.length > 0) {
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
    },


    // // layers list
    // loadLayerListKeys(): string[] {
    //     return ([
    //         'id',
    //         'resourceTitle',
    //         'temporalReference',
    //         'topicCategory',
    //         'responsibleOrganisation',
    //     ]);
    // },

    // loadLayerListTypes(): TableDataType[] {
    //     return ([
    //         'string',
    //         'string',
    //         'string',
    //         'string',
    //         'string',
    //     ]);
    // },

    // loadLayerListData(): TableDataRow[] {
    //     const mds = query('data/datasetMetadata');
    //     const getFreeText = (ft: FreeText) => {
    //         if (isAnchor(ft)) {
    //             return fromRecord(ft.text);
    //         }

    //         return fromRecord(ft);
    //     };

    //     const getTemporalReference = (a: TemporalReference[]) => {
    //         const latest = a.reduce((acc, t) => {
    //             if (isTemporalExtent(t)) {
    //                 return Math.max(acc, Date.parse(t.end));
    //             }
    //             return Math.max(acc, Date.parse(t.revision));
    //         }, 0);
    //         return formatDate(new Date(latest));
    //     };

    //     return (
    //         Object.keys(mds).map((id, from) => {
    //             const md = mds[id];
    //             const cells = [
    //                 id,
    //                 getFreeText(md.resourceTitle),
    //                 getTemporalReference(md.temporalReference),
    //                 md.topicCategory[0],
    //                 md.responsibleOrganisation.reduce((acc, ri, idx) => {
    //                     const sep = idx === 0 ? '' : '; ';
    //                     return acc + sep + getFreeText(ri.organisationName);
    //                 }, ''),
    //             ];
    //             return { from, cells };
    //         }));
    // },

};

export default queries;
