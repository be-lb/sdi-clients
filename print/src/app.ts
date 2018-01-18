
import * as debug from 'debug';

import { DIV } from 'sdi/components/elements';
import { loop, getApiUrl } from 'sdi/app';

import { initMap, loadBaseLayer } from './events/app';

import map from './components/map';
import legend from './components/legend';

const logger = debug('sdi:app');



const logoBe =
    () => DIV({ className: 'be-logo' },
        DIV({ className: 'be-name' }));


const wrappedMain =
    (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
        DIV({ className: 'embed' },
            DIV({ className: `main ${name}` }, ...elements),
            logoBe()
        )
    );

const render =
    () => wrappedMain('main', map(), legend());

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
