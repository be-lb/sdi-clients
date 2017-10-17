
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
import { render } from 'react-dom';
import { IShape, AppLayout } from './shape';
import { IStoreInteractions } from 'sdi/source';
// import { addLayer } from './ports/map';
import { DIV } from './components/elements';
import header from './components/header';
import footer from './components/footer';
import login from './components/login';
import logout from './components/logout';
import events from './events/app';
import queries from './queries/app';

const logger = debug('sdi:app');




const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderLogin = () => wrappedMain('login', login());
const renderLogout = () => wrappedMain('logout', logout());


const renderMain = (): React.DOMElement<{}, Element> => {

    const layout = queries.getLayout();
    switch (layout) {
        case AppLayout.Login: return renderLogin();
        case AppLayout.Logout: return renderLogout();
    }
};

const MIN_FRAME_RATE = 16;

export default (store: IStoreInteractions<IShape>) => {

    let lastFrameRequest: number | null = null;
    let version: number = -1;
    let frameRate = MIN_FRAME_RATE;
    const root = document.createElement('div');
    document.body.appendChild(root);


    const updateState = (ts: number) => {
        let offset: number = 0;
        const stateVersion = store.version();
        if (lastFrameRequest !== null) {
            offset = ts - lastFrameRequest;
        }
        else {
            lastFrameRequest = ts;
        }

        if (offset >= frameRate && (version !== stateVersion)) {
            version = stateVersion;
            lastFrameRequest = ts;
            logger(`render version ${stateVersion}`);
            try {
                const startRenderTime = performance.now();
                render(renderMain(), root);
                const renderTime = performance.now() - startRenderTime;
                if (renderTime > frameRate) {
                    frameRate = renderTime;
                }
                else if (frameRate > MIN_FRAME_RATE) {
                    frameRate -= 1;
                }
            }
            catch (err) {
                logger(`could not render ${err}`);
                throw err;
                // requestAnimationFrame(updateState);
            }
        }
        requestAnimationFrame(updateState);
    };

    const start = () => {
        document.body.setAttribute('lang', queries.getLang());
        requestAnimationFrame(updateState);
        events.loadUser(
            queries.getApiUrl(`users/${queries.getUserId()}`));
    };

    return { start };
};


logger('loaded');
