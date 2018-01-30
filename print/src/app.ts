
import * as debug from 'debug';

import { DIV } from 'sdi/components/elements';
import { loop, getApiUrl } from 'sdi/app';

import { initMap, loadBaseLayer } from './events/app';

import map from './components/map';
import print from './components/print';

const logger = debug('sdi:app');


const wrappedMain =
    (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
        DIV({ className: 'print' },
            DIV({ className: `main ${name}` }, ...elements))
    );

const render =
    () => wrappedMain('main', map(), print());

const baseLayers = [
    'urbis.irisnet.be/urbis_gray',
    'urbis.irisnet.be/ortho_2016',
];

const effects =
    () => {
        baseLayers.forEach(id =>
            loadBaseLayer(id, getApiUrl(`wmsconfig/${id}`)));
        initMap();
    };

const app = loop(render, effects);
export default app;

logger('loaded');
