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
import header from 'sdi/components/header';
import footer from 'sdi/components/footer';
import { getUserId, loop, getApiUrl } from 'sdi/app';

import { getLayout } from './queries/app';
import { loadUser } from './events/app';
import { loadAllAlias } from './events/alias';
import alias from './components/alias/alias';

const logger = debug('sdi:app');

export type AppLayout = 'Alias';


const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({ className: 'alias-inner'},
        header('alias')(() => DIV())(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderAlias =
    () => wrappedMain('alias', alias());

const renderMain =
    () => {
        const layout = getLayout();
        switch (layout) {
            case 'Alias': return renderAlias();
        }
    };


const effects =
    () => {
        getUserId()
            .map(userId =>
                loadUser(
                    getApiUrl(`users/${userId}`)));
        loadAllAlias();
    }

const app = loop('alias-app', renderMain, effects);
export default app;

logger('loaded');
