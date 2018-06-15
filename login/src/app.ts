
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
import { getUserId, loop } from 'sdi/app';
import { scopeOption } from 'sdi/lib';

import login from './components/login';
import logout from './components/logout';
import { getLayout } from './queries/app';
import { fromNullable } from 'fp-ts/lib/Option';
import { getNext } from './queries/login';

const logger = debug('sdi:app');

export type AppLayout = 'Login' | 'Logout';


const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header('login')(() => DIV())(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderLogin = () => wrappedMain('login', login());
const renderLogout = () => wrappedMain('logout', logout());


const renderMain =
    () => {
        const layout = getLayout();
        switch (layout) {
            case 'Login': return renderLogin();
            case 'Logout': return renderLogout();
        }
    };


const effects =
    () =>
        scopeOption()
            .let('uid', getUserId())
            .let('next', fromNullable(getNext()))
            .map(({ next }) => window.location.assign(next));




const app = loop(renderMain, effects);
export default app;

logger('loaded');
