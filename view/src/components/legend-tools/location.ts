

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

import { ChangeEvent, KeyboardEvent } from 'react';

import { DIV, INPUT, H2 } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import tr from 'sdi/locale';

import queries from '../../queries/legend';
import events from '../../events/legend';
import { viewEvents } from '../../events/map';

const latChange = (e: ChangeEvent<HTMLInputElement>) => {
    const latitude = parseFloat(e.target.value);
    events.updatePositionerLatitude(latitude);
};

const lonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const longitude = parseFloat(e.target.value);
    events.updatePositionerLatitude(longitude);
};

const position = () => {
    const state = queries.toolsPositioner();
    viewEvents.updateMapView({
        center: [state.point.longitude, state.point.latitude],
        dirty: 'geo',
        zoom: 12,
    });
};


const render = () => {
    return (
        DIV({ className: 'tool location' },
            H2({}, tr('location')),
            DIV({ className: 'tool-body lat-lon' },
                DIV({ className: 'tool-help' }, tr('locationHelp')),
                INPUT({
                    type: 'number',
                    name: 'lat',
                    placeholder: tr('latitude'),
                    onChange: latChange,
                    onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => {
                        if (isENTER(e)) {
                            position();
                        }
                    },
                }),
                INPUT({
                    type: 'number',
                    name: 'lon',
                    placeholder: tr('longitude'),
                    onChange: lonChange,
                    onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => {
                        if (isENTER(e)) {
                            position();
                        }
                    },
                }),
                DIV({
                    className: 'btn-search',
                    onClick: position,
                }, tr('go'))))
    );
};

export default render;
