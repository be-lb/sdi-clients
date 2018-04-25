import { Coordinate } from 'openlayers';
import {
    FeatureCollection,
    IMapBaseLayer,
    Inspire,
} from 'sdi/source';
import { IUgWsResponse } from '../ports/geocoder';

export enum AppLayout {
    Splash,
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
    // LayerViewAndInfo,
    // LayerViewAndRow,
    // LayerEditAndInfo,
    // LayerEditAndRow,
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


export interface AttachmentForm {
    id: string;
    mapId: string;
    name: string;
    url: string;
    uploading: boolean;
}



export interface RemoteErrors {
    [k: string]: string;
}

