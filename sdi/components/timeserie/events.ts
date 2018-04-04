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

import { PlotQuerySet, DispatchTimeserie, PlotDataLoader, PlotEventSet } from './index';




export const plotEvents =
    (dispatch: DispatchTimeserie, loadData: PlotDataLoader, queries: PlotQuerySet): PlotEventSet => {

        const events = {
            loadData,

            startSelection(id: string, start: number) {
                dispatch(id, state => ({
                    ...state,
                    selection: {
                        ...state.selection,
                        start,
                    },
                }));
            },

            endSelection(id: string, end: number) {
                dispatch(id, state => ({
                    ...state,
                    selection: {
                        ...state.selection,
                        end,
                    },
                }));
            },

            startEditing(id: string): void {
                dispatch(id, (state) => {
                    state.editingSelection = true;
                    return state;
                });
            },

            stopEditing(id: string): void {
                dispatch(id, (state) => {
                    state.editingSelection = false;
                    return state;
                });
            },

            setCursorPosition(id: string, position: number): void {
                if (queries.getCursorPosition(id) !== position) {
                    dispatch(id, (state) => {
                        state.cursorPosition = position;
                        return state;
                    });
                }
            },

            clearSelection(id: string): void {
                dispatch(id, (state) => {
                    state.selection = { start: -1, end: -1 };
                    state.cursorPosition = -1;
                    return state;
                });
            },
        };

        return events;

    };
