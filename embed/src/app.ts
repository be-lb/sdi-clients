
import * as debug from 'debug';

import { DIV } from 'sdi/components/elements';
import { loop } from 'sdi/app';

import { initMap } from './events/app';

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

const effects =
    () => initMap();

const app = loop(render, effects);
export default app;

logger('loaded');
