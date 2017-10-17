
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
import { Feature, GeometryType } from 'sdi/source';
import { IUgWsResponse } from '../ports/geocoder';
import { FeatureCollection } from 'sdi/source';
import { IAliasCollection } from 'sdi/source';
import { IMapInfo, IMapBaseLayer } from 'sdi/source';
import { IUser } from 'sdi/source';
import { Inspire } from 'sdi/source';
import { IDataTable, initialTableState } from '../components/table/base';
import { ILegendEditor, initialLegendEditorState } from '../components/legend-editor';
import { initialState as initialTimeserieState } from '../components/timeserie';
import { EditableState } from '../components/editable';
import { ButtonComponent } from '../components/button';
import { FeatureConfig, initialFeatureConfigState } from '../components/feature-config/index';
import { LayerEditor, initialLayerEditorState } from '../components/layer';
import { ITimeserie, Category } from 'sdi/source';

export enum AppLayout {
    MapFS,
    MapAndInfo,
    TableFs,
    MapAndTable,

    // editor
    Dashboard,
    LayerSelect,
    LayerSelectAndInspire,
    LegendEditor,
    LegendEditorAndTable,
    FeatureConfig,
    LayerViewAndInfo,
    LayerViewAndRow,
    LayerEditAndInfo,
    LayerEditAndRow,
    Upload,
}

export type FileOrNull = File | null;

export enum MapInfoIllustrationState {
    showImage,
    generateSelectedImagePreview,
    showSelectedImage,
    uploadSelectedImage,
}

interface IFoldable {
    folded: boolean;
}

export interface IMapNavigator {
    query: string;
}


export type DataUrl = string;

export type TableWindow = { offset: number, size: number };

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


export type MapEditableMode = 'none' | 'select' | 'create' | 'modify';

export interface IMapEditable {
    mode: MapEditableMode;
    selected: string | number | null;
    geometryType: GeometryType;
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


// State Interface


export interface IShapeApp {
    'app/user': string | null;
    'app/api-root': string;
    'app/lang': 'fr' | 'nl';
    'app/layout': AppLayout[];
    'app/current-map': string | null;
    'app/current-layer': string | null;
    'app/current-feature': Feature | null;
    'app/current-metadata': string | null;
    'app/map-ready': boolean;
    'app/map-info/illustration': MapInfoIllustrationState;
    'app/csrf': string | null;
    'app/root': string;

    'component/table': IDataTable;
    'component/legend-editor': ILegendEditor;
    'component/editable': EditableState;
    'component/button': ButtonComponent;
    'component/feature-config': FeatureConfig;
    'component/layer-editor': LayerEditor;
    'component/timeserie': ITimeserieInteractive;

    'port/map/view': IMapViewData;
    'port/map/scale': IMapScale;
    'port/map/editable': IMapEditable;
}


export interface ILayerCollection {
    [id: string]: FeatureCollection;
}

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}

export interface ITimeserieCollection {
    [id: string]: ITimeserie;
}

export interface IShapeData {
    'data/user': IUser | null;
    'data/layers': ILayerCollection;
    'data/maps': IMapInfo[];
    'data/alias': IAliasCollection | null;
    'data/datasetMetadata': IDatasetMetadataCollection;
    'data/timeseries': ITimeserieCollection;
    'data/categories': Category[];
}

export type IShape = IShapeApp & IShapeData;

// Initial Application State 

export const appShape: IShapeApp = {
    'app/user': null,
    'app/api-root': 'http://localhost:3000/',
    'app/lang': 'fr',
    'app/layout': [AppLayout.Dashboard],
    'app/map-ready': false,
    'app/current-map': null,
    'app/current-layer': null,
    'app/current-feature': null,
    'app/map-info/illustration': MapInfoIllustrationState.showImage,
    'app/current-metadata': null,
    'app/csrf': null,
    'app/root': '/',


    'component/table': initialTableState(),
    'component/legend-editor': initialLegendEditorState(),
    'component/editable': {},
    'component/button': {},
    'component/feature-config': initialFeatureConfigState(),
    'component/layer-editor': initialLayerEditorState(),
    'component/timeserie': initialTimeserieState(),

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

    'port/map/editable': {
        mode: 'select',
        selected: null,
        geometryType: 'Point',
    },
};
