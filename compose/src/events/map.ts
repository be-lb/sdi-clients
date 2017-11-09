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

import { dispatch } from 'sdi/shape';
import { IViewEvent } from 'sdi/map';




export const updateMapView =
    (data: IViewEvent): void => {
        dispatch('port/map/view', (viewState) => {
            viewState.dirty = (data.dirty !== undefined) ? data.dirty : viewState.dirty;
            viewState.center = data.center || viewState.center;
            viewState.rotation = data.rotation || viewState.rotation;
            viewState.zoom = data.zoom || viewState.zoom;
            return viewState;
        });
    };

export const setScaleLine =
    (count: number, unit: string, width: number) => {
        dispatch('port/map/scale', () => ({
            count, unit, width,
        }));
    };


// observe('app/layout', (state) => {
//     const l = state[state.length - 1];
//     const isEd = l === AppLayout.LayerEditAndInfo
//         || l === AppLayout.LayerEditAndRow
//         || l === AppLayout.LayerViewAndInfo
//         || l === AppLayout.LayerViewAndRow;

//     if (!isEd) {
//         dispatch('port/map/editable', (state) => {
//             state.mode = 'none';
//             state.selected = null;
//             return state;
//         });
//     }
// });

