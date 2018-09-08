

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
import { DIV, SPAN } from './elements';
import langSwitch from './lang-switch';
import { navigateRoot } from '../app';
import tr from '../locale';
import { MessageKey } from '../locale/message-db';

const logger = debug('sdi:header');

const rootButton =
    () => (
        DIV({
            className: 'navigate dashboard',
            onClick: () => navigateRoot(),
        }, SPAN({ className: 'label' }, tr('dashboard'))));


const makeTitle =
    (title: MessageKey, onClick?: () => void) => {
        if (onClick) {
            return DIV({ className: 'app-title interactive', onClick }, tr(title));
        }
        return DIV({ className: 'app-title' }, tr(title));
    };

const header =
    (title: MessageKey, onClick?: () => void) =>
        (action: () => React.ReactNode) => {
            const render =
                () => (
                    DIV({ className: 'header' },
                        DIV({ className: 'be-logo' },
                            DIV({ className: 'be-name' })),
                        makeTitle(title, onClick),
                        DIV({ className: 'app-listwrapper' }, action()),
                        DIV({ className: 'header-toolbar' },
                            rootButton(),
                            langSwitch())));

            return render;

        };

export default header;


logger('loaded');
