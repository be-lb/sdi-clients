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
import { compose } from 'fp-ts/lib/function';

import {
    Filter,
    ITableSort,
    TableDataRow,
    TableDataType,
    TableWindow,
    TableQuerySet,
    TableGetter,
    TableSourceGetter,
    SortDirection,
} from '.';

const logger = debug('sdi:table/queries');

type RFilter = {
    col: number;
    pat: RegExp;
};

interface numberSortMapEntry { index: number; value: number; }
interface stringSortMapEntry { index: number; value: string; }

type sortMapEntry = numberSortMapEntry | stringSortMapEntry;

const makeSortMap = (sortList: sortMapEntry[], direction: SortDirection) => {
    const sortMap = sortList.sort((a: sortMapEntry, b: sortMapEntry) => (+(a.value > b.value) || +(a.value === b.value) - 1));
    if (direction === SortDirection.descending) {
        sortMap.reverse();
    }

    return sortMap;
};

// Attach a sort column to the table.
const stringSort = (data: TableDataRow[], col: number, direction: SortDirection) => {
    const treated = data.map((r, k) => ({ index: k, value: r.cells[col].toLowerCase() }));
    return makeSortMap(treated, direction);
};

/**
 * Sort data by selected column as numbers
 * @param data TableDataRow[]
 * @param col column name string
 * @param direction SortDirection
 */
const numberSort = (data: TableDataRow[], col: number, direction: SortDirection) => {
    const treated = data.map((r, k) => ({ index: k, value: +(r.cells[col]) }));
    return makeSortMap(treated, direction);
};




export const tableQueries =
    (getTable: TableGetter, getSource: TableSourceGetter): TableQuerySet => {

        const filter =
            (filters: Filter[]) =>
                (data: TableDataRow[]) => {
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

        const sorter =
            (col: number | null, direction: SortDirection, types: string[]) =>
                (data: TableDataRow[]) => {

                    if (col !== null) {
                        const type = types[col];
                        let sortMap: sortMapEntry[] = [];

                        if (type === 'number') {
                            sortMap = numberSort(data, col, direction);
                        }
                        else {
                            sortMap = stringSort(data, col, direction);
                        }

                        return sortMap.map(entry => data[entry.index]);
                    }
                    return data;
                };


        const getFilteredData =
            () => {
                // const source = getSource();
                // logger(`getFilteredData ${source.data}`);
                const { data, types } = getSource();
                const { search, sort } = getTable();
                const f = filter(search.filters);
                const g = sorter(sort.col, sort.direction, types);
                const c = compose(g, f);
                return c(data);
            };



        const queries = {

            isLoaded() {
                return getTable().loaded;
            },

            getKeys(): string[] {
                return getSource().keys;
            },

            getFilters() {
                const { search } = getTable();
                return search.filters;
            },



            getTypes(): TableDataType[] {
                return getSource().types;
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

logger('loaded');
