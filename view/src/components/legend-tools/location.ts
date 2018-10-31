

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

import { ReactNode } from 'react';

import { DIV, H2 } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import { inputNullableNumber } from 'sdi/components/input';
import tr from 'sdi/locale';
import { InteractionPosition } from 'sdi/map';
import { AppLayout } from '../../shape/types';
import appEvents from '../../events/app';

import queries from '../../queries/legend';
import events from '../../events/legend';
import { trackerEvents, viewEvents, startPointerPosition, stopPointerPosition } from '../../events/map';
import { getPointerPosition } from '../../queries/map';


const startTracker = () => {
    appEvents.setLayout(AppLayout.MapAndTracker);
    trackerEvents.startTrack();
};


const getPositionerPos =
    () => queries.toolsPositioner().point;

const position = () => {
    const state = queries.toolsPositioner();
    viewEvents.updateMapView({
        center: [state.point.longitude, state.point.latitude],
        dirty: 'geo',
        zoom: 12,
    });
};



const wrap =
    (...children: ReactNode[]) =>
        DIV({ className: 'tool location' },
            H2({}, tr('location')),
            DIV({ className: 'tool-body lat-lon' },
                DIV({ className: 'tool-help' }, tr('locationHelp')),
                ...children));


const renderPointerPosition =
    ({ state }: InteractionPosition) =>
        wrap(DIV({ className: 'cursor-location' },
            DIV({
                className: 'btn-check active',
                onClick: () => stopPointerPosition(state),
            }, tr('cursorLocalisation')),
            DIV({ className: 'lat-lon-label' },
                DIV({}, tr('longitude')),
                DIV({}, tr('latitude')),
            ),
            DIV({ className: 'lat-lon-value' },
                DIV({}, state[0].toFixed()),
                DIV({}, state[1].toFixed()),
            )));


const getOrNull =
    (n: number) => n === 0 ? null : n;

const latitudeInput =
    () => inputNullableNumber(
        () => getOrNull(getPositionerPos().latitude),
        events.updatePositionerLatitude,
        {
            key: 'legend-tool-positioner-lat',
            name: 'lat',
            placeholder: tr('latitude'),
            onKeyPress: (e) => {
                if (isENTER(e)) {
                    position();
                }
            },
        },
    );


const longitudeInput =
    () => inputNullableNumber(
        () => getOrNull(getPositionerPos().longitude),
        events.updatePositionerLongitude,
        {
            key: 'legend-tool-positioner-lon',
            name: 'lon',
            placeholder: tr('longitude'),
            onKeyPress: (e) => {
                if (isENTER(e)) {
                    position();
                }
            },
        },
    );

const renderInput =
    () =>
        wrap(DIV({ className: 'lat-lon-inputs' },
            longitudeInput(),
            latitudeInput(),
            DIV({
                className: 'btn-search',
                onClick: position,
            })),

            DIV({ className: 'cursor-location' },
                DIV({
                    className: 'btn-check',
                    onClick: startPointerPosition,
                }, tr('cursorLocalisation')),
                DIV({
                    className: 'btn-check',
                    onClick: startTracker,
                }, tr('startGPS'))));


const render =
    () => getPointerPosition().foldL(renderInput, renderPointerPosition);

export default render;
