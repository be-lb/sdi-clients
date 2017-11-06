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


import { dispatch, dispatchK } from 'sdi/shape';
import { hashMapBaseLayer } from 'sdi/util';
import { viewEventsFactory, scaleEventsFactory, trackerEventsFactory, measureEventsFactory } from 'sdi/map';

import appQueries from '../queries/app';
import { getAllBaseLayers } from '../queries/map';



export const selectBaseLayer =
    (h: string) => {
        const mid = appQueries.getCurrentMap();
        const layers = getAllBaseLayers();
        layers.forEach((l) => {
            const lh = hashMapBaseLayer(l);
            if (h === lh) {
                dispatch('data/maps', (maps) => {
                    const info = maps.find(m => mid === m.id);
                    if (info) {
                        info.baseLayer = { ...l };
                    }
                    return maps;
                });
            }
        });
    };

export const scalelineEvents = scaleEventsFactory(dispatchK('port/map/scale'));
export const viewEvents = viewEventsFactory(dispatchK('port/map/view'));
export const trackerEvents = trackerEventsFactory(dispatchK('port/map/interaction'));
export const measureEvents = measureEventsFactory(dispatchK('port/map/interaction'));

