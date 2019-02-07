import { Coordinate } from 'openlayers';

import { Inspire, IMapBaseLayer, FeatureCollection } from 'sdi/source';

import { IUgWsResponse } from '../ports/geocoder';


export enum AppLayout {
    MapFS,
    MapAndInfo,
    MapAndFeature,
    MapAndExtract,
    TableFs,
    MapAndTable,
    MapNavigatorFS,
    MapAndTableAndFeature,
    MapAndTracker,
    MapAndMeasure,
    Print,
}

export enum SortDirection {
    ascending,
    descending,
}

export type TableDataKey = string;

interface IFoldable {
    folded: boolean;
}

export interface IMapNavigator {
    query: string;
}

export interface IMenuData extends IFoldable { }

export interface IToolWebServices extends IFoldable {
    url: string;
    layers: IMapBaseLayer[];
}


export type LegendPage =
    |'legend'
    | 'info'
    | 'data'
    | 'base-map'
    | 'print'
    | 'share'
    | 'measure'
    | 'locate'
    | 'feature-info'
    ;

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


export interface IToolGeocoder extends IFoldable {
    address: string;
    serviceResponse: IUgWsResponse | null;
}

export interface IShare {
    withView: boolean;
}

export interface ILayerColection {
    [id: string]: FeatureCollection;
}

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}


export interface RemoteErrors {
    [k: string]: string;
}
