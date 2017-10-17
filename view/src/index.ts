

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

import './polyfill';
import * as debug from 'debug';
import App from './app';
import { appShape, IShape } from './shape';
import { source } from 'sdi/source';
import { configure as configureEvents } from './events';
import { configure as configureQueries } from './queries';
import { applyQueryView } from './util/app';

const logger = debug('sdi:index');

applyQueryView(appShape);

const displayException = (err: string) => {
    const title = document.createElement('h1');
    const errorBlock = document.createElement('div');
    const link = document.createElement('a');
    const body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    title.appendChild(document.createTextNode('Sorry, Application Crashed'));
    err.split('\n').forEach((line) => {
        const e = document.createElement('pre');
        e.appendChild(document.createTextNode(line));
        errorBlock.appendChild(e);
    });
    link.setAttribute('href', document.location.href);
    link.appendChild(document.createTextNode('Reload the application'));

    body.appendChild(title);
    body.appendChild(link);
    body.appendChild(errorBlock);

};


export const main =
    (SDI: any) => {
        appShape['app/api-root'] = SDI.api;
        appShape['app/root'] = SDI.root;
        if (SDI.args.length > 0) {
            appShape['app/current-map'] = SDI.args[0];
        }
        try {
            const initialState: IShape = {
                'data/layers': {},
                'data/maps': [],
                'data/alias': null,
                'data/timeseries': {},
                'data/categories': [],
                'data/datasetMetadata': {},
                ...appShape,
            };
            const start = source<IShape, keyof IShape>(['app/lang']);
            const store = start(initialState);
            configureEvents(store);
            configureQueries(store);
            const app = App(store);
            logger('start rendering');
            app.start();
        }
        catch (err) {
            displayException(`${err}`);
        }
    };



logger('loaded');
