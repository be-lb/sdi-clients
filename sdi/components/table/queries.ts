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

import {
    Filter,
    ITableSort,
    TableDataRow,
    TableDataType,
    TableWindow,
    TableQuerySet,
    TableGetter,
} from './index';


type RFilter = {
    col: number;
    pat: RegExp;
};




export const tableQueries =
    (getTable: TableGetter): TableQuerySet => {

        const filter =
            (data: TableDataRow[], filters: Filter[]) => {
                const fs: RFilter[] = filters.map(f => ({
                    col: f[0],
                    pat: new RegExp(`.*${f[1]}.*`, 'i'),
                }));
                return data.filter(row =>
                    fs.map((f) => {
                        const cell = row.cells[f.col];
                        return f.pat.test(cell);
                    }).reduce((acc, v) => !v ? v : acc, true));
            };

        const getFilteredData =
            () => {
                const { search, data } = getTable();
                return filter(data, search.filters);
            };

        const queries = {

            isLoaded() {
                return getTable().loaded;
            },

            getKeys(): string[] {
                return getTable().keys;
            },

            getFilters() {
                const { search } = getTable();
                return search.filters;
            },



            getTypes(): TableDataType[] {
                return getTable().types;
            },

            getSort(): ITableSort {
                return getTable().sort;
            },

            getData(window?: TableWindow): TableDataRow[] {
                if (window) {
                    return getFilteredData().slice(window.offset, window.offset + window.size);
                }
                else {
                    return getFilteredData();
                }
            },


            getActiveResult(): number {
                return getTable().search.activeResult;
            },

            getResultCount(): number {
                return getTable().search.resultMap.length;
            },


            rowCount() {
                const rows = queries.getData();
                return rows.length;
            },

            tableWindow() {
                return getTable().window;
            },

            rowHeight() {
                return getTable().rowHeight;
            },

            viewHeight() {
                return getTable().viewHeight;
            },

            position() {
                return getTable().position;
            },

            isSelected(idx: number) {
                return (getTable().selected === idx);
            },

            getSelected() {
                return getTable().selected;
            },

            getRow(idx?: number) {
                const selected = (idx !== undefined) ? idx : queries.getSelected();
                const data = queries.getData();
                if (selected < 0 || selected >= data.length) {
                    return null;
                }
                return data[selected];
            },
        };


        return queries;
    };

