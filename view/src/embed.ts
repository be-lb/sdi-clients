


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

import './polyfill';
import * as debug from 'debug';
import { appShape, IShape } from './shape';
import { source } from 'sdi/source';
import { configure as configureEvents } from './events';
import { configure as configureQueries } from './queries';
import { fetchMap } from './remote';

import { render } from 'react-dom';
import { IStoreInteractions } from 'sdi/source';
import { addLayer } from './ports/map';
import map from './components/map';
import header from './components/header';
import { DIV, SPAN, H1, A } from './components/elements';
import feature from './components/feature-view';
import mapnavigator from './components/mapnavigator';
import events from './events/app';
import queries from './queries/app';
import mapEvents from './events/map';
import { AppLayout } from './shape';
import legendItem from './components/legend/legend-item';
import { applyQueryView } from './util/app';

// import 'openlayers/dist/ol.css';
// import '../styles/embed';
import tr, { formatDate, fromRecord } from './locale/index';
import { ReactNode } from 'react';

const logger = debug('sdi:embed');

applyQueryView(appShape);

const getLayerUrl = (id: string) => {
    const urls: { [k: string]: string } = {
        greenway: '/layers/greenway.geojson',
        natura_2000: '/layers/natura_2000_habitat.geojson',
        natural_reserve: '/layers/natural_reserve.geojson',
        poi_greenway: '/layers/poi_greenway.geojson',
        poi_air_monitoring_stations: '/layers/air_monitoring_stations.geojson',
    };

    return urls[id];
};

const loadLayers = () => {
    const mapInfo = queries.getMapInfo();
    if (mapInfo) {
        mapInfo.layers.forEach((lyr) => {
            const url = getLayerUrl(lyr.id);
            events.loadLayer(lyr.id, url);
        });
    }
};


const loadAlias = () => {
    events.loadAlias('/test-api/alias.json');
};


const legend = () => {
    const mapInfo = queries.getMapInfo();

    let legendItems: ReactNode[] = [];
    if (mapInfo) {
        legendItems = mapInfo.layers.slice()
            .reverse()
            .map((info) => {
                if (info.visible) {
                    return legendItem(info);
                }
                return SPAN({ style: { display: 'none' } });
            });
    }

    return (
        DIV({ className: 'map-legend' },
            DIV({ className: 'legend-main' },
                DIV({ className: 'styles-wrapper' },
                    ...legendItems))));
};


const info = () => {
    const mapInfo = queries.getMapInfo();
    if (!mapInfo) {
        return DIV();
    }

    return (
        DIV({ className: 'map-infos' },
            DIV({ className: 'map-title' },
                H1({}, A({ href: '/index.html', target: '_top' }, fromRecord(mapInfo.title)))),
            DIV({ className: 'map-date' },
                DIV({ className: 'map-date-label' }, tr('lastModified')),
                DIV({ className: 'map-date-value' },
                    formatDate(new Date(mapInfo.lastModified)))),
            DIV({ className: 'map-description' }))
    );
};

const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header(),
        DIV({ className: `main ${name}` }, ...elements))
);


const renderMapAndInfo = () => wrappedMain('embed-map-and-info',
    map(), legend(), info());

const renderMapAndFeature = () => wrappedMain('embed-map-and-feature',
    map(), feature(), info());

const renderMapNavigatorFS = () => wrappedMain('embed-map-navigator-fs',
    mapnavigator());

let layerAdded = false;

const renderMain = () => {
    const mapInfo = queries.getMapInfo();
    if (mapInfo && !layerAdded && queries.mapReady()) {
        mapInfo.layers.forEach((lyr) => {
            addLayer(() => queries.getLayerInfo(lyr.id));
        });
        layerAdded = true;
    }

    const layout = queries.getLayout();
    if (layout === AppLayout.MapAndFeature) {
        return renderMapAndFeature();
    }
    else if (layout === AppLayout.MapNavigatorFS) {
        return renderMapNavigatorFS();
    }
    return renderMapAndInfo();
};


const embed = (store: IStoreInteractions<IShape>) => {

    let lastFrameRequest: number | null = null;
    let version: number = -1;
    const root = document.getElementById('root');
    if (!root) {
        throw (new Error('INeedARoot'));
    }


    const updateState = (ts: number) => {
        let offset: number = 0;
        const stateVersion = store.version();
        if (lastFrameRequest !== null) {
            offset = ts - lastFrameRequest;
        }
        else {
            lastFrameRequest = ts;
        }

        if (offset >= 16 && (version !== stateVersion)) {
            version = stateVersion;
            lastFrameRequest = ts;
            logger(`render version ${stateVersion}`);
            render(renderMain(), root);
        }
        requestAnimationFrame(updateState);
    };

    const start = () => {
        requestAnimationFrame(updateState);
        mapEvents.updateMapView({ dirty: true });
        loadLayers();
        loadAlias();
    };

    return { start };
};



document.onreadystatechange = () => {

    if ('interactive' === document.readyState) {
        /**
         * In order to init the application, 
         * we to get map informations
         */

        fetchMap('/test-api/map-info.json')
            .then((mapInfo) => {
                const initialState: IShape = {
                    'data/layers': {},
                    'data/maps': [mapInfo],
                    'data/alias': null,
                    'data/timeseries': {},
                    'data/categories': [],
                    ...appShape,
                };
                initialState['app/current-map'] = mapInfo.id || null;
                const start = source<IShape, keyof IShape>(['app/lang']);
                const store = start(initialState);
                configureEvents(store);
                configureQueries(store);
                const app = embed(store);
                logger('start rendering');
                app.start();
            })
            .catch((err) => {
                document.body.appendChild(document.createTextNode(`
An error occured when fetching data.
${err}
        `));
            });
    }
};

logger('loaded');
