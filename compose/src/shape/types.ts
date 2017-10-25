import { Coordinate } from 'openlayers';
import {
    FeatureCollection,
    GeometryType,
    IMapBaseLayer,
    Inspire,
    ITimeserie,
} from 'sdi/source';
import { IUgWsResponse } from '../ports/geocoder';

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

export interface ILayerCollection {
    [id: string]: FeatureCollection;
}

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}

export interface ITimeserieCollection {
    [id: string]: ITimeserie;
}

