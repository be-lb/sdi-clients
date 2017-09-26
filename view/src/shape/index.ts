
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

import { Coordinate } from 'openlayers';
import { ITimeserie, IAliasCollection, IMapInfo, Feature, FeatureCollection, IMapBaseLayer, Category, Inspire } from 'sdi/source';
import { IUgWsResponse } from '../ports/geocoder';
import { IDataTable, initialTableState } from '../components/table/base';
import { ButtonComponent } from '../components/button/index';



export enum AppLayout {
    MapFS,
    MapAndInfo,
    MapAndFeature,
    TableFs,
    MapAndTable,
    MapNavigatorFS,
    MapAndTableAndFeature,
    MapAndTracker,
    MapAndMeasure,

    EmbedMapFS,
}

export enum SortDirection {
    ascending,
    descending,
}

export type TableDataKey = string;

export type TableDataType = 'string' | 'number' | 'boolean' | 'null' | 'invalid';

export type TableDataCell = string;

export type TableDataRow = TableDataCell[];

interface IFoldable {
    folded: boolean;
}

export interface IMapNavigator {
    query: string;
}


export type TableWindow = { offset: number, size: number, autoScroll: boolean };

export interface IMenuData extends IFoldable { }

export interface IToolWebServices extends IFoldable {
    url: string;
    layers: IMapBaseLayer[];
}

export interface IMapScale {
    count: number;
    unit: string;
    width: number;
}

export interface IMapViewData {
    dirty: boolean;
    srs: string;
    center: Coordinate;
    rotation: number;
    zoom: number;
}


export interface IMapBaseLayerTranslated {
    name: string;
    srs: string;
    params: {
        LAYERS: string;
        VERSION: string;
    };
    url: string;
}


export type LegendPage = 'legend' | 'tools';

export interface ILegend {
    currentPage: LegendPage;
}


export interface TrackerCoordinate {
    coord: Coordinate;
    accuracy: number;
}

export interface IGeoTracker {
    track: TrackerCoordinate[];
    active: boolean;
}

export interface IPositioner {
    point: {
        latitude: number;
        longitude: number;
    };
}

export interface IGeoMeasure {
    active: boolean;
    geometryType: 'Polygon' | 'LineString';
    coordinates: Coordinate[];
}


export interface IDimensions {
    width: number;
    height: number;
}

export interface IChartScale {
    min: number;
    max: number;
}

export interface IChartWindow {
    start: number;
    width: number;
}

export interface ITimeserieInteractive {
    cursorPosition: number;
    window: IChartWindow;
    selection: IChartWindow;
    active: Boolean;
    editingSelection: Boolean;
}

export interface IToolGeocoder extends IFoldable {
    address: string;
    serviceResponse: IUgWsResponse | null;
}

export interface IShare {
    withView: boolean;
}

export interface IShapeApp {
    'app/api-root': string;
    'app/lang': 'fr' | 'nl';
    'app/layout': AppLayout[];
    'app/current-map': string | null;
    'app/current-layer': string | null;
    'app/current-feature': Feature | null;
    'app/map-ready': boolean;

    'component/legend': ILegend;
    'component/menu': IMenuData;
    'component/table': IDataTable;
    'component/mapnavigator': IMapNavigator;
    'component/timeserie': ITimeserieInteractive;
    'component/legend/webservices': IToolWebServices;
    'component/legend/geocoder': IToolGeocoder;
    'component/legend/positioner': IPositioner;
    'component/legend/share': IShare;
    'component/button': ButtonComponent;

    'port/map/measure': IGeoMeasure;
    'port/map/tracker': IGeoTracker;
    'port/map/view': IMapViewData;
    'port/map/scale': IMapScale;
    'port/map/baseLayers': IMapBaseLayer[];


}


export interface ILayerColection {
    [id: string]: FeatureCollection;
}

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}

export interface ITimeserieCollection {
    [id: string]: ITimeserie;
}

export interface IShapeData {
    'data/layers': ILayerColection;
    'data/maps': IMapInfo[];
    'data/alias': IAliasCollection | null;
    'data/timeseries': ITimeserieCollection;
    'data/categories': Category[];
    'data/datasetMetadata': IDatasetMetadataCollection;
}

export type IShape = IShapeApp & IShapeData;

// Initial Application State 

export const appShape: IShapeApp = {

    'app/api-root': 'http://localhost:3000/',
    'app/lang': 'fr',
    'app/layout': [AppLayout.MapNavigatorFS],
    'app/map-ready': false,
    'app/current-map': null,
    'app/current-layer': null,
    'app/current-feature': null,

    'component/legend': {
        currentPage: 'legend',
    },

    'component/menu': {
        folded: true,
    },

    'component/mapnavigator': {
        query: '',
    },

    'component/table': initialTableState(),

    'component/timeserie': {
        cursorPosition: 35,
        selection: { start: 20, width: 20 },
        window: { start: 0, width: 100 },
        active: false,
        editingSelection: false,
    },

    'component/legend/webservices': {
        folded: true,
        url: '',
        layers: [],
    },

    'component/legend/geocoder': {
        folded: true,
        address: '',
        serviceResponse: null,
    },

    'component/legend/positioner': {
        point: {
            latitude: 0,
            longitude: 0,
        },
    },

    'component/legend/share': {
        withView: false,
    },

    'component/button': {},

    'port/map/measure': {
        active: false,
        coordinates: [],
        geometryType: 'LineString',
    },

    'port/map/tracker': {
        active: false,
        track: [],
    },

    'port/map/scale': {
        count: 0,
        unit: '',
        width: 0,
    },

    'port/map/view': {
        dirty: true,
        srs: 'EPSG:31370',
        center: [149546.27830713114, 169775.91753364357],
        rotation: 0,
        zoom: 6,
    },

    'port/map/baseLayers': [
        {
            name: {
                fr: 'urbisFRGray',
                nl: 'urbisNLGray',
            },
            srs: 'EPSG:31370',
            params: {
                LAYERS: {
                    fr: 'urbisFRGray',
                    nl: 'urbisNLGray',
                },
                VERSION: '1.1.1',
            },
            url: {
                fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            },
        },
        {
            name: {
                fr: 'Ortho2016',
                nl: 'Ortho2016',
            },
            srs: 'EPSG:31370',
            params: {
                LAYERS: {
                    fr: 'Urbis:Ortho2016',
                    nl: 'Urbis:Ortho2016',
                },
                VERSION: '1.1.1',
            },
            url: {
                fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
                nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            },
        },
    ],
};
