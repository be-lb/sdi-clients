
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
import { loop, getApiUrl } from 'sdi/app';
import { DIV, SPAN, NODISPLAY } from 'sdi/components/elements';
import header from 'sdi/components/header';
import footer from 'sdi/components/footer';
import tr from 'sdi/locale';

import map from './components/map';
import table from './components/table/feature-collection';
import feature, { switcher as featureSwitch } from './components/feature-view';
import legend, { switcher as legendSwitch } from './components/legend';
import mapnavigator from './components/mapnavigator';
import tracker from './components/geo-tracker';
import measure from './components/geo-measure';
import extract from './components/extract';
import print from './components/print';
import events from './events/app';
import queries from './queries/app';
import { viewEvents } from './events/map';
import { AppLayout } from './shape/types';
import { navigate, navigateHome } from './events/route';

const logger = debug('sdi:app');

const renderAppListingButton =
    () => {
        if (queries.getLayout() !== AppLayout.MapNavigatorFS) {
            return (
                DIV({
                    className: 'navigate app-listview',
                    onClick: () => navigateHome(),
                },
                    SPAN({ className: 'label' }, tr('mapList'))));
        }
        return NODISPLAY();
    };


const renderHeader = header('atlas')(renderAppListingButton);


const wrappedMain =
    (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
        DIV({ className: 'view-inner' },
            renderHeader(),
            DIV({ className: `main ${name}` }, ...elements),
            footer())
    );

const renderMapFs =
    () => wrappedMain('map-fs', map(), legendSwitch(), legend());

const renderMapAndInfo =
    () => wrappedMain('map-and-info', map(), legendSwitch(), legend());

const renderMapAndFeature =
    () => wrappedMain('map-and-feature', map(), featureSwitch(), feature());

const renderTableFs =
    () => wrappedMain('table-fs', table());

const renderMapAndTable =
    () => wrappedMain('map-and-table', DIV({ className: 'vertical-split' }, map(), table()), legendSwitch(), legend());

const renderMapNavigatorFS =
    () => wrappedMain('map-navigator-fs', mapnavigator());


const renderMapAndTableAndFeature =
    () => wrappedMain('map-and-table', DIV({ className: 'vertical-split' }, map(), table()), featureSwitch(), feature());

const renderMapAndTracker =
    () => wrappedMain('map-and-tracker', map(), tracker());

const renderMapAndMeasure =
    () => wrappedMain('map-and-measure', map(), measure());

const renderMapAndExtract =
    () => wrappedMain('map-and-extract', map(), extract());

const renderPrint =
    () => wrappedMain('print', map(), print());

const renderMain =
    () => {
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
            case AppLayout.MapAndExtract: return renderMapAndExtract();
            case AppLayout.Print: return renderPrint();
        }
    };


// const baseLayers = [
//     'urbis.irisnet.be/urbis_gray',
//     'urbis.irisnet.be/ortho_2016',
// ];

const effects =
    () => {
        viewEvents.updateMapView({ dirty: 'geo' });
        // baseLayers.forEach(id =>
        //     events.loadBaseLayer(id, getApiUrl(`wmsconfig/${id}`)));
        events.loadAllBaseLayers(getApiUrl(`wmsconfig/`));
        events.loadCategories(getApiUrl(`categories`));
        events.loadAlias(getApiUrl(`alias`));
        navigate();
    };

const app = loop('view-app', renderMain, effects);
export default app;

logger('loaded');
