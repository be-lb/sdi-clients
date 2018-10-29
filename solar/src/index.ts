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

import 'sdi/polyfill';
import './shape';
import * as debug from 'debug';
import { source } from 'sdi/source';
import { IShape, configure } from 'sdi/shape';
import { defaultInteraction } from 'sdi/map';
import { initValues } from 'sdi/components/animated-value';

import App from './app';
import { defaulObstacles } from './components/adjust';
import { defaultInputs } from './events/simulation';

const logger = debug('sdi:index');


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


        const initialState: IShape = {
            'app/user': SDI.user,
            'app/root': SDI.root,
            'app/api-root': SDI.api,
            'app/csrf': SDI.csrf,
            'app/lang': 'fr',
            'app/layout': ['Locate:Geocoder'],
            'app/route': SDI.args,

            'app/current-map': null,
            'app/capakey': null,

            'component/button': {},
            'component/geocoder/response': null,
            'component/geocoder/input': '',


            'port/map/scale': {
                count: 0,
                unit: '',
                width: 0,
            },

            'port/map/view': {
                dirty: 'geo',
                srs: 'EPSG:31370',
                center: [148885, 170690],
                rotation: 0,
                zoom: 8,
                feature: null,
                extent: null,
            },

            'port/map/interaction': defaultInteraction(),
            'port/map/loading': [],

            'data/baselayers': {},
            'data/maps': [],
            'data/alias': [],
            'data/user': null,

            'solar/system': 'photovoltaic',
            'solar/address': null,
            'solar/constants': null,
            'solar/inputs': defaultInputs(),
            'solar/outputs/pv': null,
            'solar/outputs/thermal': null,
            'solar/obstacle': defaulObstacles(),
            'solar/optimalArea': null,
            'solar/loading': [],
            'solar/loaded': [],
            'solar/perspective/camera': null,
            'solar/perspective/src': null,
            'solar/component/values': initValues(),
            'solar/data/roofs': {},
            'solar/data/geoms': {},
            'solar/data/buildings': {},
            'solar/widgets': {},
        };

        try {
            const start = source<IShape, keyof IShape>(['app/lang']);
            const store = start(initialState);
            configure(store);
            const app = App(store);
            logger('start rendering');
            app();
        }
        catch (err) {
            displayException(`${err}`);
        }
    };


logger('loaded');
