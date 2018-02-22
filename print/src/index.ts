
import * as debug from 'debug';

import 'sdi/polyfill';
import { source } from 'sdi/source';
import { IShape, configure } from 'sdi/shape';
import { defaultInteraction, defaultPrintRequest, defaultPrintResponse } from 'sdi/map';

import './shape';
import App from './app';
import { defaultPrintState } from './components/print';

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
            'app/route': SDI.args,
            'app/lang': 'fr',

            'app/layerId': null,
            'app/featureId': null,

            'data/user': null,
            'data/alias': [],
            'data/map': null,
            'data/metadata': [],
            'data/layer': [],

            'port/map/scale': {
                count: 0,
                unit: '',
                width: 0,
            },

            'port/map/view': {
                dirty: 'geo',
                feature: null,
                extent: null,
                srs: 'EPSG:31370',
                center: [149546.27830713114, 169775.91753364357],
                rotation: 0,
                zoom: 6,
            },

            'port/map/interaction': defaultInteraction(),
            'port/map/printRequest': defaultPrintRequest(),
            'port/map/printResponse': defaultPrintResponse(),

            'component/print': defaultPrintState(),
            'data/baselayers': {},
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
