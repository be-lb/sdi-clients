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
import { ChangeEvent, KeyboardEvent, DOMElement } from 'react';
import tr from '../../locale';
import { isESCAPE } from '../keycodes';
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
    from: number;
    cells: TableDataCell[];
}

export type TableWindow = { offset: number, size: number, autoScroll: boolean };

export interface ITableSort {
    col: number | null;
    direction: SortDirection;
}

export interface ITableSearch {
    col: number | null;
    query: string;
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


export const initialSearchState = (col: number | null = null): ITableSearch => ({
    col,
    query: '',
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


const closeButton = button('close');
const prevButton = button('prev');
const nextButton = button('next');
const searchButton = button('search');


const scroll = (e: React.UIEvent<Element>): void => {
    const offsetTop = e.currentTarget.scrollTop;
    const rowOffset = Math.ceil(offsetTop / queries.rowHeight());

    events.setPosition(0, offsetTop);
    events.setTableWindowOffset(rowOffset);
};



const cellWidth = (types: string[]): string => `${100 / (types.length)}%`;


const renderCell =
    (types: string[], width: string, onSelect: (a: number) => void) =>
        (data: TableDataCell, idx: number) => (
            DIV({
                key: idx.toString(),
                className: `table-cell data-type-${types[idx]}`,
                style: { width },
                onClick: () => onSelect(idx),
            }, data));


const renderRowNum = (rowNum: number, _width: string) => (
    DIV(
        {
            key: '#',
            className: 'table-row-num',
            style: {
                display: 'none',
            },
        },
        (rowNum + 1).toString()));



const selectRow = (config: Config, rowNum: number) =>
    () => {
        events.select(rowNum);
        if (config.onRowSelect) {
            const row = queries.getRow(rowNum);
            if (row) {
                config.onRowSelect(row);
            }
        }
    };

const selectCell = (config: Config, rowNum: number) =>
    (idx: number) => {
        if (config.onCellSelect) {
            const row = queries.getRow(rowNum);
            if (row) {
                config.onCellSelect(row, idx);
            }
        }
    };


const renderRow =
    (offset: number, types: string[], cellWidth: string, config: Config) =>
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
                renderRowNum(rowNum, cellWidth),
                ...data.cells.map(
                    renderCell(types, cellWidth, selectCell(config, rowNum))));
        };



const renderTableHeaderCellWithSearch = (idx: number, width: string, col: string, type: string) => {
    const resultCount = queries.getResultCount();

    const searchField = INPUT({
        autoFocus: true,
        type: 'search',
        name: 'search',
        className: 'table-header-search-field',
        onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => { if (isESCAPE(e)) { events.searchClose(); } },
        onChange: (e: ChangeEvent<HTMLInputElement>) => events.searchData(e.target.value),
    });

    const close = closeButton(() => events.searchClose());

    let resultIndicator: DOMElement<{}, Element>[];

    if (resultCount > 0) {
        const activeResultLabel = (queries.getActiveResult() + 1).toString();

        resultIndicator = [
            DIV({}, `${activeResultLabel} / ${queries.getResultCount()}`),
            prevButton(events.searchPrev),
            nextButton(events.searchNext),
        ];
    }
    else {
        resultIndicator = [DIV({}, tr('noResults'))];
    }

    return DIV({
        className: `table-cell table-header-cell data-type-${type}`,
        style: { width, position: 'relative' },
        key: `${idx.toString()}}`,
    },
        SPAN({}, col),
        DIV({
            className: 'table-header-search-box',
        }, searchField, resultIndicator, close));
};


const renderTableHeaderCell = (idx: number, width: string, col: string, type: string) => {
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
        style: { width },
        key: idx.toString(),
        onClick: () => events.sortData(idx, newSortDirection),
    },
        SPAN({}, col),
        searchButton(() => { events.searchActivate(idx); }));
};



export const renderTableHeader = (types: string[], width: string) => {
    const searchCol = queries.getSearchCol();
    return DIV({ className: 'table-header', key: 'table-header' },
        ...queries.getKeys().map(
            (h: string, idx: number) => {
                const type = types[idx];
                if (searchCol === idx) {
                    return renderTableHeaderCellWithSearch(idx, width, h, type);
                }
                else {
                    return renderTableHeaderCell(idx, width, h, type);
                }
            }));
};





const renderTableBody =
    (setTableSize: (a: Element | null) => void, config: Config) =>
        (data: TableDataRow[], offset: number, types: string[]) => {
            const widths = cellWidth(types);
            return DIV({
                key: 'table-body',
                className: 'table-body',
                style: { overflow: 'auto' },
                onScroll: scroll,
                ref: setTableSize,
            },
                DIV({
                    style: { minHeight: queries.rowCount() * queries.rowHeight() },
                    className: 'table-body-sizer',
                },
                    DIV({
                        style: {
                            position: 'relative',
                            top: queries.position().y,
                        },
                        key: `table-body-fragment|${offset}`,
                        className: 'table-body-fragment',
                    },
                        ...data.map(renderRow(offset, types, widths, config)))));
        };



export const fn = (config: Config) => {
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
            events.setTableWindowSize(Math.ceil(rect.height / queries.rowHeight()));
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

            if (scrollWrapperRef && window.autoScroll) {
                scrollWrapperRef.scrollTop = window.offset * queries.rowHeight();
                events.clearAutoScroll();
            }
            const children: React.ReactNode[] = [];
            if (config.toolbar) {
                children.push(config.toolbar());
            }
            children.push(
                renderTableHeader(types, cellWidth(types)),
                renderBody(data, window.offset, types));

            return DIV(
                { className: `${config.className} infinite-table` },
                ...children);
        }
        else {
            const { loadData, loadKeys, loadTypes } = config;
            events.loadData(loadData, loadKeys, loadTypes);
            return DIV({ className: 'infinite-table loading' },
                SPAN({ className: 'loading-label' },
                    tr('loadingData')));
        }
    });
};

export default fn;

logger('loaded');
