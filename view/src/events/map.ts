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

import { } from 'fp-ts/lib/Array';

import { dispatch, dispatchK } from 'sdi/shape';
import { hashMapBaseLayer } from 'sdi/util';
import { viewEventsFactory, scaleEventsFactory, trackerEventsFactory, measureEventsFactory, ExtractFeature, defaultInteraction } from 'sdi/map';
import { tableEvents } from 'sdi/components/table';

import appQueries from '../queries/app';
import appEvents from '../events/app';
import { getAllBaseLayers, withExtract } from '../queries/map';
import { AppLayout } from '../shape/types';
import { Coordinate } from 'openlayers';

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
    () => interaction(() => ({
        label: 'extract',
        state: [],
    }));

export const stopExtract =
    () => interaction(() => defaultInteraction());

const eq =
    (a: ExtractFeature[], b: ExtractFeature[]) => (
        a.length === b.length
        && a.length === a.filter((e, i) => b[i] && e.featureId === b[i].featureId).length
    );


const withNewExtracted =
    (a: ExtractFeature[]) =>
        withExtract().map(b => eq(a, b.state));


export const setExtractCollection =
    (es: ExtractFeature[]) =>
        withNewExtracted(es)
            .fold(
            () => interaction(() => ({
                label: 'extract',
                state: es,
            })),
            (isEq) => {
                if (!isEq) {
                    interaction(() => ({
                        label: 'extract',
                        state: es,
                    }));
                }
            });


export const extractTableEvents = tableEvents(
    dispatchK('component/table/extract'));


export const startMark =
    () => interaction((s) => {
        if (s.label === 'mark') {
            return { ...s, state: { ...s.state, started: true } };
        }
        return s;
    });

export const endMark =
    () => interaction(() => defaultInteraction());


export const putMark =
    (coordinates: Coordinate) =>
        interaction(() => ({
            label: 'mark',
            state: {
                started: false,
                endTime: Date.now() + 12000,
                coordinates,
            },
        }));
