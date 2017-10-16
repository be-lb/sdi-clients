

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
import { SPAN, DIV } from './elements';
import langSwitch from './lang-switch';
import tr from '../locale';
// import button from './button';
// import events from '../events/app';
// import queries from '../queries/app';
// import { AppLayout } from '../shape';

const logger = debug('sdi:header');




const renderAppListingButton =
    () => {
        return DIV({ className: 'app-listview' }, tr('sheetList'));
    };




const render =
    () => {
        return DIV({ className: 'header' },
            DIV({ className: 'be-logo' },
                DIV({ className: 'be-tree' }),
                DIV({ className: 'be-name' })),
            renderAppListingButton(),
            DIV({ className: 'header-toolbar' },
                SPAN({ className: 'dashboard' },
                    tr('dashboard')),
                // SPAN({ className: 'login' },
                //     tr('dashboard')),
                langSwitch()));

    };

export default render;


logger('loaded');
