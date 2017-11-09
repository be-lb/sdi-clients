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


import { DOMElement } from 'react';

export enum SortDirection {
    ascending,
    descending,
}

export type TableDataKey = string;

export type TableDataType = 'string' | 'number' | 'boolean' | 'null' | 'invalid';

export type TableDataCell = string;

export interface TableDataRow {
    from: number | string;
    cells: TableDataCell[];
}

export type TableWindow = { offset: number, size: number, autoScroll: boolean };

export interface ITableSort {
    col: number | null;
    direction: SortDirection;
}

export type Filter = [number, string];

export interface ITableSearch {
    filters: Filter[];
    activeResult: number;
    resultMap: number[];
}

export type LoadingStatus = 'none' | 'loading' | 'done';

export interface IDataTable {
    loaded: LoadingStatus;
    position: { x: number, y: number };
    rowHeight: number;
    search: ITableSearch;
    selected: number;
    sort: ITableSort;
    viewHeight: number;
    window: TableWindow;
}

export type LoadDataFn = () => TableDataRow[] | null;
export type LoadKeysFn = () => string[] | null;
export type LoadTypesFn = () => TableDataType[] | null;
export type ToolbarFn = () => DOMElement<{}, Element>;
export type SelectRowHandler = (a: TableDataRow) => void;
export type SelectCellHandler = (a: TableDataRow, b: number) => void;

export interface TableSource {
    data: TableDataRow[];
    keys: string[];
    types: TableDataType[];
}

export interface Config {
    className: string;
    // loadData: LoadDataFn;
    // loadKeys: LoadKeysFn;
    // loadTypes: LoadTypesFn;

    toolbar?: ToolbarFn;
    onRowSelect?: SelectRowHandler;
    onCellSelect?: SelectCellHandler;
}

export interface TableQuerySet {
    isLoaded(): LoadingStatus;
    getKeys(): string[];
    getFilters(): [number, string][];
    getTypes(): TableDataType[];
    getSort(): ITableSort;
    getData(window?: TableWindow | undefined): TableDataRow[];
    getActiveResult(): number;
    getResultCount(): number;
    rowCount(): number;
    tableWindow(): TableWindow;
    rowHeight(): number;
    viewHeight(): number;
    position(): {
        x: number;
        y: number;
    };
    isSelected(idx: number): boolean;
    getSelected(): number;
    getRow(idx?: number | undefined): TableDataRow | null;
}

export interface TableEventSet {
    clearAutoScroll: () => void;
    highlightRow: (idx: number, scrollIntoView?: Boolean) => void;
    // loadData: (d: LoadDataFn, k: LoadKeysFn, t: LoadTypesFn) => void;
    reset: () => void;
    searchActivate: (col: number) => void;
    searchClose: () => void;
    filterData: (col: number, query: string) => void;
    searchNext: () => void;
    searchPrev: () => void;
    select: (index: number) => void;
    // selectFrom: (from: number) => void;
    setTableWindowOffset: (offset: number) => void;
    setTableWindowSize: (size: number) => void;
    setViewHeight: (height: number) => void;
    setPosition: (x: number, y: number) => void;
    sortData: (col: number | null, direction: SortDirection) => void;
}

export type TableGetter = () => IDataTable;
export type TableSetter = (h: (a: IDataTable) => IDataTable) => void;
export type TableSourceGetter = () => TableSource;

export const initialSearchState = (): ITableSearch => ({
    filters: [],
    activeResult: -1,
    resultMap: [],
});

export const initialSortState = () => ({
    col: null,
    direction: SortDirection.ascending,
});

export const initialTableState = (): IDataTable => ({
    position: { x: 0, y: 0 },
    loaded: 'none',
    rowHeight: 19,
    search: initialSearchState(),
    selected: -1,
    sort: initialSortState(),
    viewHeight: -1,
    window: { offset: 0, size: 100, autoScroll: false },
});


export { baseTable } from './base';
export { tableQueries } from './queries';
export { tableEvents } from './events';
