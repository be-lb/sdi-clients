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
 
import { query } from './index';
import appQueries from './app';
import { TableWindow, TableDataRow, ITableSort, TableDataType } from '../components/table/base';
import { getLayerPropertiesKeys } from '../util/app';
import { FeatureCollection, Feature, TemporalReference, FreeText, isAnchor, isTemporalExtent } from 'sdi/source';
import { fromRecord, formatDate } from '../locale';


type ObjOrNull = { [k: string]: any } | null;

const queries = {

    isLoaded() {
        return query('component/table').loaded;
    },

    getKeys(): string[] {
        return query('component/table').keys;
    },

    getSearchCol(): number | null {
        return query('component/table').search.col;
    },



    getTypes(): TableDataType[] {
        return query('component/table').types;
    },

    getSort(): ITableSort {
        return query('component/table').sort;
    },

    getData(window?: TableWindow): TableDataRow[] {
        const data = query('component/table').data;
        if (window) {
            return data.slice(window.offset, window.offset + window.size);
        }
        else {
            return data;
        }
    },


    getActiveResult(): number {
        return query('component/table').search.activeResult;
    },

    getResultCount(): number {
        return query('component/table').search.resultMap.length;
    },


    rowCount() {
        const rows = queries.getData();
        return rows.length;
    },

    tableWindow() {
        return query('component/table').window;
    },

    rowHeight() {
        return query('component/table').rowHeight;
    },

    viewHeight() {
        return query('component/table').viewHeight;
    },

    position() {
        return query('component/table').position;
    },

    isSelected(idx: number) {
        return (query('component/table').selected === idx);
    },

    getSelected() {
        return query('component/table').selected;
    },

    getRow(idx?: number) {
        const selected = (idx !== undefined) ? idx : queries.getSelected();
        const data = queries.getData();
        if (selected < 0 || selected >= data.length) {
            return null;
        }
        return data[selected];
    },


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


    // layers list
    loadLayerListKeys(): string[] {
        return ([
            'id',
            'resourceTitle',
            'temporalReference',
            'topicCategory',
            'responsibleOrganisation',
        ]);
    },

    loadLayerListTypes(): TableDataType[] {
        return ([
            'string',
            'string',
            'string',
            'string',
            'string',
        ]);
    },

    loadLayerListData(): TableDataRow[] {
        const mds = query('data/datasetMetadata');
        const getFreeText = (ft: FreeText) => {
            if (isAnchor(ft)) {
                return fromRecord(ft.text);
            }

            return fromRecord(ft);
        };

        const getTemporalReference = (t: TemporalReference) => {
            if (isTemporalExtent(t)) {
                return formatDate(new Date(Date.parse(t.end)));
            }
            return formatDate(new Date(Date.parse(t.revision)));

        };

        return (
            Object.keys(mds).map((id, from) => {
                const md = mds[id];
                const cells = [
                    id,
                    getFreeText(md.resourceTitle),
                    getTemporalReference(md.temporalReference),
                    md.topicCategory[0],
                    md.responsibleOrganisation.reduce((acc, ri, idx) => {
                        const sep = idx === 0 ? '' : '; ';
                        return acc + sep + getFreeText(ri.organisationName);
                    }, ''),
                ];
                return { from, cells };
            }));
    },

};

export default queries;
