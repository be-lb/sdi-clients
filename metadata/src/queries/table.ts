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
// import appQueries from './app';
import { TableWindow, TableDataRow, ITableSort, TableDataType, Filter } from '../components/table/base';


// type ObjOrNull = { [k: string]: any } | null;
type RFilter = {
    col: number;
    pat: RegExp;
};
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
        const { search, data } = query('component/table');
        return filter(data, search.filters);
    }

const queries = {

    isLoaded() {
        return query('component/table').loaded;
    },

    getKeys(): string[] {
        return query('component/table').keys;
    },

    getFilters() {
        const { search } = query('component/table');
        return search.filters;
    },



    getTypes(): TableDataType[] {
        return query('component/table').types;
    },

    getSort(): ITableSort {
        return query('component/table').sort;
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
};

export default queries;
