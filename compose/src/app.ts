
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
import map from './components/map';
import header from './components/header';
import footer from './components/footer';
import tableAttributes from './components/table/feature-collection-headless';
import tableAttributesEditable from './components/table/feature-collection-editable';
import tableLayers from './components/table/layers';
import tableInspire from './components/table/inspire';
import events from './events/app';
import queries from './queries/app';
import mapEvents from './events/map';
import info from './components/map-info';
import dashboard from './components/dashboard';
import baseLayerSwitch from './components/map-info/base-layer-switch';
import legendEditor from './components/legend-editor';
import featureConfig from './components/feature-config';
import featureView from './components/feature-view';

import viewInspire from './components/layer/view-inspire';
import featureEdit from './components/layer/edit';

import upload from './components/upload';


const logger = debug('sdi:app');




const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderDashboard = () => wrappedMain('dashboard', dashboard());

const renderMapFs = () => wrappedMain('map-fs', map(), baseLayerSwitch());

const renderMapAndInfo = () => wrappedMain('map-and-info', map(), baseLayerSwitch(), info());

const renderTableFs = () => wrappedMain('table-fs', tableAttributes());

const renderMapAndTable = () => wrappedMain('map-and-table', DIV({ className: 'vertical-split' }, map(), baseLayerSwitch(), tableAttributes()));

const renderLayerSelect = () => wrappedMain('map-and-layer-selector', DIV({ className: 'vertical-split' }, map(), tableLayers()), baseLayerSwitch(), info());

const renderLayerSelectAndInspire = () => wrappedMain('map-and-layer-selector-and-inspire',
    DIV({ className: 'vertical-split' },
        DIV({ className: 'snail' },
            map(),
            tableInspire()),
        tableLayers()),
    baseLayerSwitch(),
    info());

const renderLegendEditor = () => wrappedMain('main map-and-style-tools', DIV({ className: 'vertical-split' }, map(), legendEditor()), baseLayerSwitch(), info());

const renderLegendEditorAndTable = () => wrappedMain('main attributes-and-style-tools',
    DIV({ className: 'vertical-split' }, tableAttributes(), legendEditor()),
    info());

const renderFeatureConfig = () => wrappedMain('feature-config',
    DIV({ className: 'vertical-split' }, tableAttributes(), featureConfig()),
    featureView());

const renderLayerEditAndInfo = () => wrappedMain(
    'layer-stub',
    DIV({ className: 'vertical-split' }, map(), tableAttributesEditable()),
    viewInspire());

const renderLayerEditAndRow = () => wrappedMain(
    'layer-stub',
    DIV({ className: 'vertical-split' },
        DIV({ className: 'snail' },
            featureEdit(),
            map()),
        tableAttributesEditable()),
    viewInspire());

const renderLayerViewAndInfo = () => wrappedMain(
    'layer-stub',
    DIV({ className: 'vertical-split' }, map(), tableAttributesEditable()),
    viewInspire());

const renderUpload = () => wrappedMain('upload', upload());


const renderMain = (): React.DOMElement<{}, Element> => {

    const layout = queries.getLayout();
    switch (layout) {
        case AppLayout.Dashboard: return renderDashboard();
        case AppLayout.MapFS: return renderMapFs();
        case AppLayout.MapAndTable: return renderMapAndTable();
        case AppLayout.MapAndInfo: return renderMapAndInfo();
        case AppLayout.TableFs: return renderTableFs();
        case AppLayout.LayerSelect: return renderLayerSelect();
        case AppLayout.LayerSelectAndInspire: return renderLayerSelectAndInspire();
        case AppLayout.LegendEditor: return renderLegendEditor();
        case AppLayout.LegendEditorAndTable: return renderLegendEditorAndTable();
        case AppLayout.FeatureConfig: return renderFeatureConfig();

        case AppLayout.LayerEditAndInfo: return renderLayerEditAndInfo();
        case AppLayout.LayerEditAndRow: return renderLayerEditAndRow();

        case AppLayout.LayerViewAndInfo: return renderLayerViewAndInfo();
        case AppLayout.LayerViewAndRow: return renderLayerViewAndInfo();

        case AppLayout.Upload: return renderUpload();
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
        mapEvents.updateMapView({ dirty: true });
        requestAnimationFrame(updateState);
        events.loadUser(
            queries.getApiUrl(`users/${queries.getUserId()}`));
        events.loadCategories(queries.getApiUrl(`categories`));
        events.loadAlias(queries.getApiUrl(`alias`));
        events.loadAllDatasetMetadata();
    };

    return { start };
};


logger('loaded');
