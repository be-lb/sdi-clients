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
 
import { dispatch, observe } from './index';
import { LoadDataFn, LoadKeysFn, LoadTypesFn, initialSearchState, initialSortState, SortDirection, initialTableState, TableDataRow } from '../components/table/base';

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

const setTableWindowOffset = (offset: number): void => {
    dispatch('component/table', (state) => {
        state.window.offset = offset;
        return state;
    });
};

const setTableWindowSize = (size: number): void => {
    dispatch('component/table', (state) => {
        state.window.size = size;
        return state;
    });
};

const setViewHeight = (height: number): void => {
    dispatch('component/table', (state) => {
        state.viewHeight = height;
        return state;
    });
};

const setPosition = (x: number, y: number): void => {
    dispatch('component/table', (state) => {
        state.position = {
            x,
            y,
        };
        return state;
    });
};

const select = (index: number) => {
    dispatch('component/table', (state) => {
        state.selected = index;
        return state;
    });
};

const selectFrom = (from: number) => {
    dispatch('component/table', (state) => {
        if (state.loaded) {
            const index = state.data.findIndex(r => r.from === from);
            if (index >= 0) {
                state.selected = index;
            }
        }
        return state;
    });
};

const searchActivate = (col: number) => {
    dispatch('component/table', (state) => {
        state.search = initialSearchState(col);
        return state;
    });
};

const searchClose = () => {
    dispatch('component/table', (state) => {
        state.search = initialSearchState();
        return state;
    });
};

const searchPrev = () => {
    dispatch('component/table', (state) => {
        const current = state.search.activeResult;
        const resultCount = state.search.resultMap.length;
        let next = current - 1;

        if (next < 0) {
            next = resultCount - 1;
        }

        state.search.activeResult = next;

        events.highlightRow(state.search.resultMap[next], true);

        return state;
    });
};


const searchNext = () => {
    dispatch('component/table', (state) => {
        const resultCount = state.search.resultMap.length;
        const current = state.search.activeResult;
        let next = current + 1;

        if (next >= resultCount) {
            next = 0;
        }

        state.search.activeResult = next;

        events.highlightRow(state.search.resultMap[next], true);

        return state;
    });
};

const highlightRow = (idx: number, scrollIntoView: Boolean = false) => {
    dispatch('component/table', (state) => {
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

const loadData = (d: LoadDataFn, k: LoadKeysFn, t: LoadTypesFn) => {
    const data = d();
    const keys = k();
    const types = t();
    if (data && keys && types) {
        dispatch('component/table', (state) => {
            state.loaded = true;
            state.data = data;
            state.keys = keys;
            state.types = types;
            state.search = initialSearchState();
            state.sort = initialSortState();
            state.selected = -1;
            state.window.offset = 0;
            state.position.y = 0;
            return state;
        });
    }
};

const reset = () => {
    dispatch('component/table', initialTableState);
};

const sortData = (col: number | null, direction: SortDirection) => {
    dispatch('component/table', (state) => {
        state.sort = { col, direction };

        if (col !== null) {
            const type = state.types[col];
            let sortMap: sortMapEntry[] = [];

            if (type === 'number') {
                sortMap = numberSort(state.data, col, direction);
            }
            else {
                sortMap = stringSort(state.data, col, direction);
            }

            state.data = sortMap.map(entry => state.data[entry.index]);

            if (state.search.resultMap.length > 0) {
                state.search.resultMap = sortMap.reduce<number[]>((m, r, k) => {
                    if (state.search.resultMap.indexOf(r.index) > -1) {
                        m.push(k);
                    }
                    return m;
                }, []);
            }

            if (state.selected > -1) {
                state.selected = sortMap.findIndex(r => r.index === state.selected);
                events.highlightRow(state.selected, true);
            }
        }

        return state;
    });
};

const searchData = (query: string) => {
    dispatch('component/table', (state) => {
        const col = state.search.col;

        if (col !== null && query.match(/\S+/)) {
            const patt = new RegExp(`.*${query}.*`, 'i');

            /**
             * Find indexes of rows which match query
             */
            const resultMap = state.data.reduce<number[]>(
                (m, r, k: number) => {
                    if (patt.test(r.cells[col])) {
                        m.push(k);
                    }

                    return m;
                },
                []);

            state.search = { col, query, resultMap, activeResult: 0 };

            if (resultMap.length > 0) {
                events.highlightRow(state.search.resultMap[0], true);
            }
        }
        else {
            state.search = initialSearchState();
        }

        return state;
    });
};

const clearAutoScroll = () => {
    dispatch('component/table', (state) => {
        state.window.autoScroll = false;
        return state;
    });
};

const events = {
    clearAutoScroll,
    highlightRow,
    loadData,
    reset,
    searchActivate,
    searchClose,
    searchData,
    searchNext,
    searchPrev,
    select,
    selectFrom,
    setTableWindowOffset,
    setTableWindowSize,
    setViewHeight,
    setPosition,
    sortData,
};

export default events;



observe('app/current-layer', () => {
    reset();
});
