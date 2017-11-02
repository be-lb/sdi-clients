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

import * as proj4 from 'proj4';
import { layer, proj, format, Coordinate } from 'openlayers';
import { ILayerInfo, IMapBaseLayer, IMapInfo, FeatureCollection, GeometryType, Feature, DirectGeometryObject, Inspire } from '../source';
import { Getter, Setter } from '../shape';


export const formatGeoJSON = new format.GeoJSON();

proj.setProj4(proj4);
proj4.defs('EPSG:31370',
    '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.8686,52.2978,-103.7239,-0.3366,0.457,-1.8422,-1.2747 +units=m +no_defs');

const EPSG31370 = new proj.Projection({
    code: 'EPSG:31370',
    extent: [14697.30, 22635.80, 291071.84, 246456.18],
});

proj.addProjection(EPSG31370);

export type FetchData = () => FeatureCollection | null;
export type SetScaleLine = (count: number, unit: string, width: number) => void;


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


export interface TrackerCoordinate {
    coord: Coordinate;
    accuracy: number;
}

export interface IGeoTracker {
    active: boolean;
    track: TrackerCoordinate[];
}

export interface TrackerOptions {
    updateTrack(t: TrackerCoordinate): void;
    resetTrack(): void;
    setCenter(c: Coordinate): void;
}

export interface IGeoMeasure {
    active: boolean;
    geometryType: 'Polygon' | 'LineString';
    coordinates: Coordinate[];
}

export interface MeasureOptions {
    updateMeasureCoordinates(c: Coordinate[]): void;
    setMeasuring(m: boolean): void;
}


export type MapEditableMode = 'none' | 'select' | 'create' | 'modify';
export type MapEditableSelected = string | number | null;

export interface IMapEditable {
    mode: MapEditableMode;
    selected: MapEditableSelected;
    geometryType: GeometryType;
}

export interface EditOptions {
    getCurrentLayerId(): string;
    getMetadata(lid: string): Inspire;

    editFeature(fid: string | number): void;
    addFeature(f: Feature): void;
    setGeometry(geom: DirectGeometryObject): void;
}

export interface SelectOptions {
    selectFeature(f: Feature): void;
}


export interface IMapOptions {
    element: Element | null;
    getBaseLayer(): IMapBaseLayer | null;
    getView(): IMapViewData;
    getMapInfo(): IMapInfo | null;

    updateView(v: IViewEvent): void;
    setScaleLine: SetScaleLine;
}

export interface LayerRef {
    info: ILayerInfo;
    layer: layer.Vector;
}

export interface IViewEvent {
    dirty?: boolean;
    center?: Coordinate;
    rotation?: number;
    zoom?: number;
}

// 'port/map/measure': IGeoMeasure;
export type MeasureGetter = Getter<IGeoMeasure>;
export type MeasureSetter = Setter<IGeoMeasure>;

// 'port/map/tracker': IGeoTracker;
export type TrackerGetter = Getter<IGeoTracker>;
export type TrackerSetter = Setter<IGeoTracker>;

// 'port/map/view': IMapViewData;
export type ViewGetter = Getter<IMapViewData>;
export type ViewSetter = Setter<IMapViewData>;

// 'port/map/scale': IMapScale;
export type ScaleGetter = Getter<IMapScale>;
export type ScaleSetter = Setter<IMapScale>;


export * from './map';
export * from './events';
export * from './queries';

