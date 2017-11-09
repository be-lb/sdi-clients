

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
import { initialTableState } from 'sdi/components/table';
import { IShape, configure } from 'sdi/shape';
import { defaultInteraction } from 'sdi/map';

import App from './app';
import { AppLayout } from './shape/types';

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

        // const currentMap = (SDI.args.length > 0) ? SDI.args[0] : null;

        const initialState: IShape = {
            'app/user': SDI.user,
            'app/root': SDI.root,
            'app/api-root': SDI.api,
            'app/csrf': SDI.csrf,
            'app/lang': 'fr',
            'app/layout': [AppLayout.MapNavigatorFS],
            'app/map-ready': false,
            'app/current-map': null,
            'app/current-layer': null,
            'app/current-feature': null,
            'app/route': SDI.args,

            'component/legend': {
                currentPage: 'legend',
            },

            'component/menu': {
                folded: true,
            },

            'component/mapnavigator': {
                query: '',
            },

            'component/table': initialTableState(),

            'component/timeserie': {
                cursorPosition: 35,
                selection: { start: 20, width: 20 },
                window: { start: 0, width: 100 },
                active: false,
                editingSelection: false,
            },

            'component/legend/webservices': {
                folded: true,
                url: '',
                layers: [],
            },

            'component/legend/geocoder': {
                folded: true,
                address: '',
                serviceResponse: null,
            },

            'component/legend/positioner': {
                point: {
                    latitude: 0,
                    longitude: 0,
                },
            },

            'component/legend/share': {
                withView: false,
            },

            'component/button': {},


            'port/map/scale': {
                count: 0,
                unit: '',
                width: 0,
            },

            'port/map/view': {
                dirty: 'geo',
                srs: 'EPSG:31370',
                center: [149546.27830713114, 169775.91753364357],
                rotation: 0,
                zoom: 6,
            },

            'port/map/interaction': defaultInteraction(),

            'port/map/baseLayers': [
                {
                    name: {
                        fr: 'urbisFRGray',
                        nl: 'urbisNLGray',
                    },
                    srs: 'EPSG:31370',
                    params: {
                        LAYERS: {
                            fr: 'urbisFRGray',
                            nl: 'urbisNLGray',
                        },
                        VERSION: '1.1.1',
                    },
                    url: {
                        fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                        nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                    },
                },
                {
                    name: {
                        fr: 'Ortho2016',
                        nl: 'Ortho2016',
                    },
                    srs: 'EPSG:31370',
                    params: {
                        LAYERS: {
                            fr: 'Urbis:Ortho2016',
                            nl: 'Urbis:Ortho2016',
                        },
                        VERSION: '1.1.1',
                    },
                    url: {
                        fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                        nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                    },
                },
            ],
            'data/layers': {},
            'data/maps': [],
            'data/alias': null,
            'data/timeseries': {},
            'data/categories': [],
            'data/datasetMetadata': {},
            'data/attachments': [],
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
