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
import { DIV, INPUT, SPAN } from './../elements';
import events from '../../events/table';
import queries from '../../queries/table';
import { DOMElement } from 'react';
import tr from '../../locale';
import button from '../button';

const logger = debug('sdi:table/base');

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

export interface IDataTable {
    data: TableDataRow[];
    keys: TableDataKey[];
    loaded: boolean;
    position: { x: number, y: number };
    rowHeight: number;
    search: ITableSearch;
    selected: number;
    sort: ITableSort;
    types: TableDataType[];
    viewHeight: number;
    window: TableWindow;
}

export type LoadDataFn = () => TableDataRow[] | null;
export type LoadKeysFn = () => string[] | null;
export type LoadTypesFn = () => TableDataType[] | null;
export type ToolbarFn = () => DOMElement<{}, Element>;
export type SelectRowHandler = (a: TableDataRow) => void;
export type SelectCellHandler = (a: TableDataRow, b: number) => void;

export interface Config {
    className: string;
    loadData: LoadDataFn;
    loadKeys: LoadKeysFn;
    loadTypes: LoadTypesFn;

    toolbar?: ToolbarFn;
    onRowSelect?: SelectRowHandler;
    onCellSelect?: SelectCellHandler;
}


export const initialSearchState = (): ITableSearch => ({
    filters: [],
    activeResult: -1,
    resultMap: [],
});

export const initialSortState = () => ({ col: null, direction: SortDirection.ascending });

export const initialTableState = (): IDataTable => ({
    data: [],
    keys: [],
    position: { x: 0, y: 0 },
    loaded: false,
    rowHeight: 19,
    search: initialSearchState(),
    selected: -1,
    sort: initialSortState(),
    types: [],
    viewHeight: -1,
    window: { offset: 0, size: 100, autoScroll: false },
});


const closeButton = button('clear', 'clear');
// const prevButton = button('prev');
// const nextButton = button('next');
const filterButton = button('filter');


const scroll = (e: React.UIEvent<Element>): void => {
    const offsetTop = e.currentTarget.scrollTop;
    const rowOffset = Math.ceil(offsetTop / queries.rowHeight());

    events.setPosition(0, offsetTop);
    events.setTableWindowOffset(rowOffset);
};



// const cellWidth = (types: string[]): string => `${100 / (types.length)}%`;
type Width = [number, string];
const cellWidths =
    () => queries.getKeys().map<Width>(k => [k.length * 1.5, 'rem']);

const rowWidth =
    () => cellWidths().reduce(
        (acc, w) => [acc[0] + w[0], w[1]], [0, ''] as Width);

const cwString =
    (cw: Width) => `${cw[0]}${cw[1]}`;

// const randColor =
//     () => Color(Math.round(Math.random() * 0xffffff)).string();

const renderCell =
    (types: string[], widths: Width[], onSelect: (a: number) => void) =>
        (data: TableDataCell, idx: number) => (
            DIV({
                key: idx.toString(),
                title: data,
                className: `table-cell data-type-${types[idx]}`,
                style: {
                    width: cwString(widths[idx]),
                    // backgroundColor: randColor(),
                },
                onClick: () => onSelect(idx),
            }, data));


const renderRowNum =
    (rowNum: number) => (
        DIV(
            {
                key: '#',
                className: 'table-row-num',
                style: {
                    display: 'none',
                },
            },
            (rowNum + 1).toString()));



const selectRow =
    (config: Config, rowNum: number) =>
        () => {
            events.select(rowNum);
            if (config.onRowSelect) {
                const row = queries.getRow(rowNum);
                if (row) {
                    config.onRowSelect(row);
                }
            }
        };

const selectCell =
    (config: Config, rowNum: number) =>
        (idx: number) => {
            if (config.onCellSelect) {
                const row = queries.getRow(rowNum);
                if (row) {
                    config.onCellSelect(row, idx);
                }
            }
        };


const renderRow =
    (offset: number, types: string[], widths: Width[], config: Config) =>
        (data: TableDataRow, idx: number) => {
            const rowNum = offset + idx;
            const selected = queries.isSelected(rowNum) ? 'active' : '';
            const evenOdd = ((rowNum % 2) > 0) ? 'odd table-row' : 'even table-row';
            return DIV(
                {
                    key: rowNum.toString(),
                    className: `${evenOdd} ${selected}`,
                    onClick: selectRow(config, rowNum),
                },
                renderRowNum(rowNum),
                ...data.cells.map(
                    renderCell(types, widths, selectCell(config, rowNum))));
        };



const renderFilter =
    (filter: Filter) => {
        const [col, query] = filter;
        const colName = queries.getKeys()[col];
        // const resultCount = queries.getResultCount();

        const fieldName = SPAN({ className: 'search-field' }, colName);

        const searchField = INPUT({
            autoFocus: true,
            type: 'search',
            name: 'search',
            className: 'table-header-search-field',
            defaultValue: query,
            // onKeyDown: e => optESCAPE(e).map(() => events.searchClose()),
            onChange: e => events.filterData(col, e.target.value),
        });


        // let resultIndicator: DOMElement<{}, Element>[];

        // if (resultCount > 0) {
        //     const activeResultLabel = (queries.getActiveResult() + 1).toString();

        //     resultIndicator = [
        //         DIV({
        //             className: 'search-result',
        //         }, `${activeResultLabel} / ${queries.getResultCount()}`),
        //         prevButton(events.searchPrev),
        //         nextButton(events.searchNext),
        //     ];
        // }
        // else {
        //     resultIndicator = [DIV({}, tr('noResults'))];
        // }

        return DIV({
            className: `table-search-item`,
            key: `${colName}`,
        }, fieldName, searchField);
    };


const renderTableHeaderCell =
    (idx: number, width: Width, col: string, type: string) => {
        const sort = queries.getSort();
        let newSortDirection: SortDirection;
        let className = `table-cell table-header-cell data-type-${type}`;

        if (sort.col === idx) {
            if (sort.direction === SortDirection.ascending) {
                className += ' sorted sorted-asc';
                newSortDirection = SortDirection.descending;
            }
            else {
                className += ' sorted sorted-desc';
                newSortDirection = SortDirection.ascending;
            }
        }
        else {
            newSortDirection = SortDirection.ascending;
        }

        return DIV({
            className,
            style: { width: cwString(width) },
            key: idx.toString(),
            onClick: () => events.sortData(idx, newSortDirection),
        },
            SPAN({}, col),
            filterButton(() => events.searchActivate(idx)));
    };



export const renderTableHeader =
    (types: string[], widths: Width[]) => {
        const keys = queries.getKeys();
        const elems = keys.map(
            (h: string, idx: number) =>
                renderTableHeaderCell(idx, widths[idx], h, types[idx]));

        return DIV({
            className: 'table-header',
            key: 'table-header',
            style: {
                width: cwString(rowWidth()),
            },
        }, ...elems);
    };





const renderTableBody =
    (setTableSize: (a: Element | null) => void, config: Config) =>
        (data: TableDataRow[], offset: number, types: string[]) => {
            const widths = cellWidths();
            const rowCount = queries.rowCount();
            const rowHeight = queries.rowHeight();
            const width = cwString(rowWidth());
            logger(`sizer = ${rowCount} * ${rowHeight}`);
            return DIV({
                key: 'table-body',
                className: 'table-body',
                onScroll: scroll,
                ref: setTableSize,
                style: { width },
            },
                DIV({
                    className: 'table-body-sizer',
                    style: {
                        minHeight: rowCount * rowHeight,
                    },
                },
                    DIV({
                        className: 'table-body-fragment',
                        style: {
                            position: 'relative',
                            top: queries.position().y,
                            width,
                        },
                        key: `table-body-fragment|${offset}`,
                    }, ...data.map(
                        renderRow(offset, types, widths, config)))));
        };



export const render =
    (config: Config) => {
        let scrollWrapperRef: Element | null = null;

        const setTableSize = (el: Element | null) => {
            /**
             * Ref function is called twice, on attach with el as argument
             * and on detach whitout arugments;
             */
            if (el) {
                scrollWrapperRef = el;
                const rect = el.getBoundingClientRect();
                events.setViewHeight(rect.height);
                events.setTableWindowSize(
                    Math.ceil(rect.height / queries.rowHeight()));
            }
            else {
                scrollWrapperRef = null;
            }
        };

        const renderBody = renderTableBody(setTableSize, config);

        return (() => {

            if (queries.isLoaded()) {
                const window = queries.tableWindow();
                const data = queries.getData(window);
                const types = queries.getTypes();
                const filters = queries.getFilters();

                if (scrollWrapperRef && window.autoScroll) {
                    scrollWrapperRef.scrollTop = window.offset * queries.rowHeight();
                    events.clearAutoScroll();
                }
                const children: React.ReactNode[] = [];
                if (config.toolbar) {
                    children.push(config.toolbar());
                }

                if (filters.length > 0) {
                    const close = closeButton(() => events.searchClose());
                    children.push(
                        DIV({ className: 'table-search' },
                            ...filters.map(renderFilter), close));
                }

                children.push(
                    DIV({ className: 'table-main' },
                        renderTableHeader(types, cellWidths()),
                        renderBody(data, window.offset, types)));

                return (
                    DIV({ className: 'infinite-table' },
                        ...children));
            }
            else {
                const { loadData, loadKeys, loadTypes } = config;
                events.loadData(loadData, loadKeys, loadTypes);
                return DIV({ className: 'infinite-table loading' },
                    SPAN({ className: 'spinner' }),
                    SPAN({ className: 'loading-label' },
                        tr('loadingData')));
            }
        });
    };

export default render;

logger('loaded');
