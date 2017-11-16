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
import { viewEventsFactory, scaleEventsFactory, trackerEventsFactory, measureEventsFactory, ExtractFeature, defaultInteraction } from 'sdi/map';
import { tableEvents } from 'sdi/components/table';

import appQueries from '../queries/app';
import appEvents from '../events/app';
import { getAllBaseLayers } from '../queries/map';
import { AppLayout } from '../shape/types';

const interaction = dispatchK('port/map/interaction');

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
export const trackerEvents = trackerEventsFactory(interaction);
export const measureEvents = measureEventsFactory(interaction);

export const startExtract =
    () => {
        interaction(() => ({
            label: 'extract',
            state: [],
        }));
        appEvents.setLayout(AppLayout.MapAndExtract);
    };

export const stopExtract =
    () => {
        interaction(() => defaultInteraction());
        appEvents.setLayout(AppLayout.MapAndExtract);
    };

export const setExtractCollection =
    (state: ExtractFeature[]) => interaction(() => ({
        label: 'extract',
        state,
    }));



export const extractTableEvents = tableEvents(
    dispatchK('component/table/extract'));