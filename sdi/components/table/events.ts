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
    initialSearchState,
    // initialSortState,
    initialTableState,
    // LoadDataFn,
    // LoadKeysFn,
    // LoadTypesFn,
    SortDirection,
    // TableDataRow,
    TableSetter,
} from './index';

// interface numberSortMapEntry { index: number; value: number; }
// interface stringSortMapEntry { index: number; value: string; }

// type sortMapEntry = numberSortMapEntry | stringSortMapEntry;

// const makeSortMap = (sortList: sortMapEntry[], direction: SortDirection) => {
//     const sortMap = sortList.sort((a: sortMapEntry, b: sortMapEntry) => (+(a.value > b.value) || +(a.value === b.value) - 1));
//     if (direction === SortDirection.descending) {
//         sortMap.reverse();
//     }

//     return sortMap;
// };

// // Attach a sort column to the table.
// const stringSort = (data: TableDataRow[], col: number, direction: SortDirection) => {
//     const treated = data.map((r, k) => ({ index: k, value: r.cells[col].toLowerCase() }));
//     return makeSortMap(treated, direction);
// };

// /**
//  * Sort data by selected column as numbers
//  * @param data TableDataRow[]
//  * @param col column name string
//  * @param direction SortDirection
//  */
// const numberSort = (data: TableDataRow[], col: number, direction: SortDirection) => {
//     const treated = data.map((r, k) => ({ index: k, value: +(r.cells[col]) }));
//     return makeSortMap(treated, direction);
// };


export const tableEvents =
    (dispatch: TableSetter) => {

        const setTableWindowOffset = (offset: number): void => {
            dispatch((state) => {
                state.window.offset = offset;
                return state;
            });
        };

        const setTableWindowSize = (size: number): void => {
            dispatch((state) => {
                state.window.size = size;
                return state;
            });
        };

        const setViewHeight = (height: number): void => {
            dispatch((state) => {
                state.viewHeight = height;
                return state;
            });
        };

        const setPosition = (x: number, y: number): void => {
            dispatch((state) => {
                state.position = {
                    x,
                    y,
                };
                return state;
            });
        };

        const select = (index: number) => {
            dispatch((state) => {
                state.selected = index;
                return state;
            });
        };

        // const selectFrom = (from: number) => {
        //     dispatch((state) => {
        //         if (state.loaded) {
        //             const index = state.data.findIndex(r => r.from === from);
        //             if (index >= 0) {
        //                 state.selected = index;
        //             }
        //         }
        //         return state;
        //     });
        // };

        const searchActivate = (col: number) => {
            dispatch((state) => {
                const { search } = state;
                const filter: Filter = [col, ''];
                return {
                    ...state,
                    search: {
                        ...search,
                        filters: search.filters.concat([filter]),
                    }
                };
            });
        };

        const searchClose = () => {
            dispatch((state) => {
                state.search = initialSearchState();
                return state;
            });
        };

        const searchPrev = () => {
            dispatch((state) => {
                const current = state.search.activeResult;
                const resultCount = state.search.resultMap.length;
                let next = current - 1;

                if (next < 0) {
                    next = resultCount - 1;
                }

                state.search.activeResult = next;

                highlightRow(state.search.resultMap[next], true);

                return state;
            });
        };


        const searchNext = () => {
            dispatch((state) => {
                const resultCount = state.search.resultMap.length;
                const current = state.search.activeResult;
                let next = current + 1;

                if (next >= resultCount) {
                    next = 0;
                }

                state.search.activeResult = next;

                highlightRow(state.search.resultMap[next], true);

                return state;
            });
        };

        const highlightRow = (idx: number, scrollIntoView: Boolean = false) => {
            dispatch((state) => {
                state.selected = idx;

                /**
                 * Scroll into view ?
                 */
                if (scrollIntoView === true) {
                    const window = state.window;

                    if (idx < window.offset || idx > (window.offset + window.size * .8)) {
                        const offset = Math.max(0, Math.floor((idx - (window.size * .5))));
                        state.window.offset = offset;
                        state.window.autoScroll = true;
                    }
                }

                return state;
            });
        };

        // const loadData = (d: LoadDataFn, k: LoadKeysFn, t: LoadTypesFn) => {
        //     const data = d();
        //     const keys = k();
        //     const types = t();
        //     if (data && keys && types) {
        //         dispatch((state) => {
        //             state.loaded = true;
        //             state.data = data;
        //             state.keys = keys;
        //             state.types = types;
        //             state.search = initialSearchState();
        //             state.sort = initialSortState();
        //             state.selected = -1;
        //             state.window.offset = 0;
        //             state.position.y = 0;
        //             return state;
        //         });
        //     }
        // };

        const reset = () => {
            dispatch(initialTableState);
        };

        const sortData = (col: number | null, direction: SortDirection) => {
            dispatch(state => ({
                ...state,
                sort: { col, direction },
            }));
        };



        const filterData = (col: number, query: string) => {
            dispatch((state) => {
                const { search } = state;
                const filters: Filter[] = search.filters.map((f) => {
                    if (f[0] === col) {
                        return [col, query] as Filter;
                    }
                    return f;
                });


                return {
                    ...state,
                    search: {
                        ...search,
                        filters,
                    },
                };
            });
        };

        const clearAutoScroll = () => {
            dispatch((state) => {
                state.window.autoScroll = false;
                return state;
            });
        };


        return {
            clearAutoScroll,
            highlightRow,
            // loadData,
            reset,
            searchActivate,
            searchClose,
            filterData,
            searchNext,
            searchPrev,
            select,
            // selectFrom,
            setTableWindowOffset,
            setTableWindowSize,
            setViewHeight,
            setPosition,
            sortData,
        };


    };

