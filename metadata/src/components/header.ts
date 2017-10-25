

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

import * as debug from 'debug';
import { DIV } from 'sdi/components/elements';
import langSwitch from './lang-switch';
import buttonFactory from 'sdi/components/button';
import events from '../events/app';
import queries from '../queries/app';
import {
    queryK,
    dispatchK,
} from 'sdi/shape';

const logger = debug('sdi:header');

const button = buttonFactory(
    queryK('component/button'), dispatchK('component/button'));
const rootButton = button.make('navigate', 'dashboard');
const toListButton = button.make('navigate', 'sheetList');


const renderAppListingButton =
    () => {
        if (queries.getLayout() !== 'List') {
            return toListButton(() => events.setLayout('List'), 'app-listview');
        }
        return DIV();
    };


const render =
    () => (
        DIV({ className: 'header' },
            DIV({ className: 'be-logo' },
                DIV({ className: 'be-tree' }),
                DIV({ className: 'be-name' })),
            DIV({className: 'app-listwrapper'},  renderAppListingButton()),
            DIV({ className: 'header-toolbar' },
                rootButton(() => events.navigateRoot(), 'dashboard'),
                langSwitch())));


export default render;


logger('loaded');
