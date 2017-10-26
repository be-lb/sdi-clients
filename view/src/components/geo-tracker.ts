


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

import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';

import appEvents from '../events/app';
import mapEvents from '../events/map';
import { AppLayout } from '../shape/types';

const stopTracker = () => {
    appEvents.setLayout(AppLayout.MapFS);
    mapEvents.stopTrack();
};

const saveTrack = () => {
    appEvents.setLayout(AppLayout.MapFS);
    mapEvents.stopTrack();
};



const render = () => {
    return DIV({ className: 'tool-widget geo-tracker' },
        DIV({
            className: 'btn-stop tracker-stop',
            onClick: stopTracker,
        }, SPAN({}, tr('stop'))),
        DIV({
            className: 'btn-save tracker-save',
            onClick: saveTrack,
        }, SPAN({}, tr('save'))));
};

export default render;
