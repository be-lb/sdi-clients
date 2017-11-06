
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
import { loop, getUserId, getApiUrl } from 'sdi/app';
import { DIV, SPAN } from 'sdi/components/elements';
import header from 'sdi/components/header';
import footer from 'sdi/components/footer';
import tr from 'sdi/locale';


import map from './components/map';
import tableAttributes from './components/table/feature-collection-headless';
// import tableAttributesEditable from './components/table/feature-collection-editable';
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

// import viewInspire from './components/layer/view-inspire';
// import featureEdit from './components/layer/edit';

import upload from './components/upload';
import { AppLayout } from './shape/types';


const logger = debug('sdi:app');

const renderAppListingButton =
    () => {
        if (queries.getLayout() !== AppLayout.Dashboard) {
            return (
                DIV({
                    className: 'navigate app-listview',
                    onClick: () => events.setLayout(AppLayout.Dashboard),
                }, SPAN({ className: 'label' }, tr('myMaps'))));
        }
        return DIV();
    };


const renderHeader = header('studio')(renderAppListingButton);

const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        renderHeader(),
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

// const renderLayerEditAndInfo = () => wrappedMain(
//     'layer-stub',
//     DIV({ className: 'vertical-split' }, map(), tableAttributesEditable()),
//     viewInspire());

// const renderLayerEditAndRow = () => wrappedMain(
//     'layer-stub',
//     DIV({ className: 'vertical-split' },
//         DIV({ className: 'snail' },
//             featureEdit(),
//             map()),
//         tableAttributesEditable()),
//     viewInspire());

// const renderLayerViewAndInfo = () => wrappedMain(
//     'layer-stub',
//     DIV({ className: 'vertical-split' }, map(), tableAttributesEditable()),
//     viewInspire());

const renderUpload = () => wrappedMain('upload', upload());


const renderMain =
    () => {

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

            // case AppLayout.LayerEditAndInfo: return renderLayerEditAndInfo();
            // case AppLayout.LayerEditAndRow: return renderLayerEditAndRow();

            // case AppLayout.LayerViewAndInfo: return renderLayerViewAndInfo();
            // case AppLayout.LayerViewAndRow: return renderLayerViewAndInfo();

            case AppLayout.Upload: return renderUpload();
        }
    };


const effects =
    () => {
        mapEvents.updateMapView({ dirty: true });
        getUserId()
            .map(userId =>
                events.loadUser(getApiUrl(`users/${userId}`)));
        events.loadCategories(getApiUrl(`categories`));
        events.loadAlias(getApiUrl(`alias`));
        events.loadAllDatasetMetadata();
    };


const app = loop(renderMain, effects);
export default app;

logger('loaded');
