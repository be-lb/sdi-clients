
import * as debug from 'debug';

import { DIV } from 'sdi/components/elements';
// import footer from 'sdi/components/footer';
import { loop } from 'sdi/app';

import { getLayout } from './queries/app';
import { initMap } from './events/app';

import map from './components/map';
import legend from './components/legend';
import info from './components/info';
import featureView from './components/feature-view';
import header from './components/header';

const logger = debug('sdi:app');

export type AppLayout = 'Main' | 'MapAndFeature';


const wrappedMain =
    (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
        DIV({},
            header(),
            DIV({ className: `main ${name}` }, ...elements),
            info()
        )
    );

const renderMain =
    () => wrappedMain('main', map(), legend());

const renderMapAndFeature =
    () => wrappedMain('map-and-feature', map(), featureView());

const render =
    () => {
        switch (getLayout()) {
            case 'Main': return renderMain();
            case 'MapAndFeature': return renderMapAndFeature();
        }
    };


const effects =
    () => {
        // getUserId()
        //     .map(userId =>
        //         loadUser(
        //             getApiUrl(`users/${userId}`)));
        initMap();
    }

const app = loop(render, effects);
export default app;

logger('loaded');
