

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

import { DIV, H2, H3 } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import { inputNullableNumber } from 'sdi/components/input';
import tr from 'sdi/locale';
import { InteractionPosition } from 'sdi/map';
import { AppLayout } from '../../shape/types';
import appEvents from '../../events/app';

import queries from '../../queries/legend';
import events from '../../events/legend';
import { trackerEvents, viewEvents, startPointerPosition, stopPointerPosition, putMark } from '../../events/map';
import { getPointerPosition } from '../../queries/map';
import bookmark from '../bookmark';
import { helpText } from 'sdi/components/helptext';


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
                helpText(tr('helptext:locationTool')),
                ...children));


const renderPointerPosition =
    ({ state }: InteractionPosition) =>
        wrap(DIV({ className: 'cursor-location' },
            H2({}, tr('cursorLocalisation')),
            helpText(tr('helptext:cursorLocationOn')),
            DIV({ className: 'lat-lon-label' },
                DIV({}, tr('longitude')),
                DIV({}, tr('latitude')),
            ),
            DIV({ className: 'lat-lon-value' },
                DIV({}, state.coordinates[0].toFixed()),
                DIV({}, state.coordinates[1].toFixed()),
            ),
            DIV({
                className: 'btn-stop',
                onClick: () => stopPointerPosition(state.coordinates),
            },
                tr('stop'),
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

const pointLocation =
    () => DIV({ className: 'point-location' },
        H3({}, tr('pointLocation')),
        helpText(tr('helptext:pointLocationTool')),
        DIV({ className: 'lat-lon-inputs' },
            longitudeInput(),
            latitudeInput(),
            DIV({
                className: 'btn-search',
                onClick: position,
            })),
        DIV({ className: 'cursor-location' },
            DIV({
                className: 'btn-gps high-btn ',
                onClick: () => startPointerPosition(putMark),
            }, tr('cursorLocalisation'))));


const gpsTracker =
    () => DIV({},
        H3({}, tr('gpsTracker')),
        helpText(tr('helptext:gpsTracker')),
        DIV({
            className: 'btn-gps high-btn',
            onClick: startTracker,
        }, tr('startGPS')));


const renderInput =
    () =>
        wrap(
            pointLocation(),
            gpsTracker(),
            bookmark(), 
            );


const render =
    () => getPointerPosition().foldL(renderInput, renderPointerPosition);

export default render;
