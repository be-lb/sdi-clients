

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

import { DIV, A } from 'sdi/components/elements';
import langSwitch from 'sdi/components/lang-switch';
import { getRoot } from 'sdi/app';

const logger = debug('sdi:header');

const render =
    () => (
        A({
            href: `${getRoot()}view`,
        }, DIV({ className: 'header' },
            DIV({ className: 'be-logo' },
                DIV({ className: 'be-name' }))),
            DIV({ className: 'header-toolbar' },
                langSwitch())));




export default render;


logger('loaded');
