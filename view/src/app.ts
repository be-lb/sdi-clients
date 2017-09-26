
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
import { IStoreInteractions } from 'sdi/source';
import map from './components/map';
import header from './components/header';
import footer from './components/footer';
import { DIV } from './components/elements';
import table from './components/table/feature-collection';
import feature, { renderDefault } from './components/feature-view';
import legend, { switcher } from './components/legend';
import mapnavigator from './components/mapnavigator';
import tracker from './components/geo-tracker';
import measure from './components/geo-measure';
import events from './events/app';
import queries from './queries/app';
import mapEvents from './events/map';
import { AppLayout, IShape } from './shape';

const logger = debug('sdi:app');



const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderMapFs = () => wrappedMain('map-fs', map(), switcher(), legend());

const renderMapAndInfo = () => wrappedMain('map-and-info', map(), switcher(), legend());

const renderMapAndFeature = () => wrappedMain('map-and-feature', map(), feature());

const renderTableFs = () => wrappedMain('table-fs', table());

const renderMapAndTable = () => wrappedMain('map-and-table', DIV({ className: 'vertical-split' }, map(), table()), switcher(), legend());

const renderMapNavigatorFS = () => wrappedMain('map-navigator-fs', mapnavigator());

const renderMapAndTableAndFeature = () => wrappedMain('map-and-table-and-feature', DIV({ className: 'vertical-split' }, DIV({ className: 'snail' }, DIV({ className: 'feature-view config' }, renderDefault()), map()), table()), switcher(), legend());

const renderMapAndTracker = () => wrappedMain('map-and-tracker', map(), tracker());

const renderMapAndMeasure = () => wrappedMain('map-and-measure', map(), measure());

const renderMain = () => {
    const layout = queries.getLayout();
    switch (layout) {
        case AppLayout.MapFS: return renderMapFs();
        case AppLayout.MapAndTable: return renderMapAndTable();
        case AppLayout.MapAndTableAndFeature: return renderMapAndTableAndFeature();
        case AppLayout.MapAndInfo: return renderMapAndInfo();
        case AppLayout.MapAndFeature: return renderMapAndFeature();
        case AppLayout.TableFs: return renderTableFs();
        case AppLayout.MapNavigatorFS: return renderMapNavigatorFS();
        case AppLayout.MapAndTracker: return renderMapAndTracker();
        case AppLayout.MapAndMeasure: return renderMapAndMeasure();
        default: throw (new Error(`UnsupportedLayout ${AppLayout[layout]}`));
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
                requestAnimationFrame(updateState);
            }
        }
        requestAnimationFrame(updateState);
    };

    const start = () => {
        mapEvents.updateMapView({
            dirty: true,
        });
        requestAnimationFrame(updateState);
        events.loadCategories(queries.getApiUrl(`categories`));
        events.loadMaps(queries.getApiUrl(`maps`));
        events.loadAlias(queries.getApiUrl(`alias`));
        events.bootMap();
    };

    return { start };
};


logger('loaded');
