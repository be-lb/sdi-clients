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

import { fromPredicate } from 'fp-ts/lib/Option';

import { DIV, H1 } from 'sdi/components/elements';
import { AppManifest, MessageRecord } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';


import { getApps } from '../queries/apps';

const withName = fromPredicate<AppManifest>(a => 'name' in a);

type AppWithName = AppManifest & { name: MessageRecord }

const renderApp =
    (app: AppManifest) => withName(app).fold(
        () => DIV(),
        (app: AppWithName) => DIV({
            className: `app-item ${app.codename}`,
            onClick: () => window.location.assign(app.url),
        },
            DIV({ className: 'app-picto' }),
            DIV({ className: 'app-name' }, fromRecord(app.name)))
    );

const renderApps =
    () => getApps().map(renderApp);

const renderAppsWrapper =
    () => DIV({
        className: 'app-list',
    }, ...renderApps());

const render =
    () => DIV({ className: 'my-apps' },
        H1({}, tr('myApps')),
        renderAppsWrapper());

export default render;
