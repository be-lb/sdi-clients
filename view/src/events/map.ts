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
import { Coordinate } from 'openlayers';

import { dispatch, dispatchK, queryK } from 'sdi/shape';
import { viewEventsFactory, scaleEventsFactory, trackerEventsFactory, measureEventsFactory, ExtractFeature, defaultInteraction, PrintRequest, PrintResponse } from 'sdi/map';
import { tableEvents } from 'sdi/components/table';
import { MessageRecord } from 'sdi/source';

import { withExtract } from '../queries/map';
import { PrintProps } from '../components/print';
import legendEvents from './legend';

const setInteraction = dispatchK('port/map/interaction');
const getInteraction = queryK('port/map/interaction');


// export const selectBaseLayer =
//     (h: string) => {
//         const mid = appQueries.getCurrentMap();
//         const layers = getAllBaseLayers();
//         layers.forEach((l) => {
//             const lh = hashMapBaseLayer(l);
//             if (h === lh) {
//                 dispatch('data/maps', (maps) => {
//                     const info = maps.find(m => mid === m.id);
//                     if (info) {
//                         info.baseLayer = { ...l };
//                     }
//                     return maps;
//                 });
//             }
//         });
//     };

export const scalelineEvents = scaleEventsFactory(dispatchK('port/map/scale'));
export const viewEvents = viewEventsFactory(dispatchK('port/map/view'));
export const trackerEvents = trackerEventsFactory(setInteraction);
export const measureEvents = measureEventsFactory(setInteraction);

export const startExtract =
    () => setInteraction(() => ({
        label: 'extract',
        state: [],
    }));

export const stopExtract =
    () => setInteraction(() => defaultInteraction());

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
                setInteraction(() => ({
                    label: 'extract',
                    state: es,
                })),
                (isEq) => {
                    if (!isEq) {
                        setInteraction(() => ({
                            label: 'extract',
                            state: es,
                        }));
                    }
                });


export const extractTableEvents = tableEvents(
    dispatchK('component/table/extract'));


export const startMark =
    () => setInteraction((s) => {
        if (s.label === 'mark') {
            return { ...s, state: { ...s.state, started: true } };
        }
        return s;
    });

export const endMark =
    () => setInteraction(() => defaultInteraction());


export const putMark =
    (coordinates: Coordinate) =>
        setInteraction(() => ({
            label: 'mark',
            state: {
                started: false,
                endTime: Date.now() + 12000,
                coordinates,
            },
        }));


export const startPointerPosition =
    (after: (c: Coordinate) => void) => setInteraction(() => ({
        label: 'position',
        state: { coordinates: [0, 0], after },
    }));

export const setPointerPosition =
    (coordinates: Coordinate) => setInteraction((it) => {
        if ('position' === it.label) {
            return {
                ...it,
                state: { ...it.state, coordinates },
            };
        }
        return it;
    });

export const stopPointerPosition =
    (c: Coordinate) => {
        const it = getInteraction();
        if (it.label === 'position') {
            const after = it.state.after;
            const coordinates = it.state.coordinates;
            legendEvents.updatePositionerLongitude(Math.floor(c[0]));
            legendEvents.updatePositionerLatitude(Math.floor(c[1]));
            setInteraction(() => defaultInteraction());
            setTimeout(() => after(coordinates), 1);
        }
    };


export const updateLoading =
    (ms: MessageRecord[]) =>
        dispatch('port/map/loading', () => ms);


export const setPrintRequest =
    (r: PrintRequest<PrintProps>) => {
        dispatchK('port/map/printRequest')(() => r);
        dispatchK('port/map/interaction')(() => ({
            label: 'print',
            state: null,
        }));
    };
export const setPrintResponse =
    (r: PrintResponse<PrintProps>) => dispatchK('port/map/printResponse')(() => r);


export const stopPrint =
    () => setInteraction(() => defaultInteraction());
