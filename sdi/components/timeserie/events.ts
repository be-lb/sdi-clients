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

            startSelection(start: number) {
                dispatch((state) => {
                    state.selection = { start, width: 1 };
                    return state;
                });
            },

            setSelectionWidth(width: number) {
                dispatch((state) => {
                    state.selection.width = width;
                    return state;
                });
            },

            invertSelection() {
                dispatch((state) => {
                    const start = state.selection.start;
                    const width = state.selection.width;
                    state.selection = { start: start + width, width: width * -1 };
                    return state;
                });
            },

            startEditing(): void {
                dispatch((state) => {
                    state.editingSelection = true;
                    return state;
                });
            },

            stopEditing(): void {
                dispatch((state) => {
                    state.editingSelection = false;
                    return state;
                });
            },

            setCursorPosition(position: number): void {
                if (queries.getCursorPosition() !== position) {
                    dispatch((state) => {
                        state.cursorPosition = position;
                        return state;
                    });
                }
            },

            clearSelection(): void {
                dispatch((state) => {
                    state.selection = { start: -1, width: 0 };
                    state.cursorPosition = -1;
                    return state;
                });
            },
        };

        return events;

    };
