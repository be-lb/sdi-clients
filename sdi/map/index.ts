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
import { proj, format, Coordinate } from 'openlayers';
import { IMapBaseLayer, IMapInfo, FeatureCollection, GeometryType, Feature, DirectGeometryObject, Inspire } from '../source';
import { Getter, Setter } from '../shape';
import { Option, fromPredicate } from 'fp-ts/lib/Option';


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

export type ViewDirt = 'none' | 'geo' | 'style';

export interface IMapViewData {
    dirty: ViewDirt;
    srs: string;
    center: Coordinate;
    rotation: number;
    zoom: number;
}


export interface IGeoSelect {
    selected: string | null;
}

export interface TrackerCoordinate {
    coord: Coordinate;
    accuracy: number;
}

export interface IGeoTracker {
    track: TrackerCoordinate[];
}

export interface TrackerOptions {
    updateTrack(t: TrackerCoordinate): void;
    resetTrack(): void;
    setCenter(c: Coordinate): void;
}

export interface IGeoMeasure {
    geometryType: 'Polygon' | 'LineString';
    coordinates: Coordinate[];
}

export interface MeasureOptions {
    updateMeasureCoordinates(c: Coordinate[]): void;
    stopMeasuring(): void;
}


export type MapEditableMode = 'none' | 'select' | 'create' | 'modify';
export type MapEditableSelected = string | number | null;

export interface IGeoCreate {
    geometryType: GeometryType;
}

export interface IGeoModify {
    selected: MapEditableSelected;
    geometryType: GeometryType;
}


export interface InteractionBase<L extends string, T> {
    label: L;
    state: T;
}

export interface InteractionSelect extends InteractionBase<'select', IGeoSelect> { }
export interface InteractionCreate extends InteractionBase<'create', IGeoCreate> { }
export interface InteractionModify extends InteractionBase<'modify', IGeoModify> { }
export interface InteractionTrack extends InteractionBase<'track', IGeoTracker> { }
export interface InteractionMeasure extends InteractionBase<'measure', IGeoMeasure> { }

interface InteractionMap {
    'select': InteractionSelect;
    'create': InteractionCreate;
    'modify': InteractionModify;
    'track': InteractionTrack;
    'measure': InteractionMeasure;
}


export type Interaction = InteractionMap[keyof InteractionMap];
// | InteractionSelect
// | InteractionCreate
// | InteractionModify
// | InteractionTrack
// | InteractionMeasure
// ;


export const defaultInteraction =
    (): Interaction => ({
        label: 'select',
        state: { selected: null },
    });



export type InteractionGetter = Getter<Interaction>;
export type InteractionSetter = Setter<Interaction>;

/**
 * 
 * const tt = fromInteraction('select', defaultInteraction);
 * >> Option<InteractionSelect>
 */
export const fromInteraction =
    <L extends keyof InteractionMap>(label: L, i: Interaction): Option<InteractionMap[L]> =>
        fromPredicate((a: Interaction) => a.label === label)(i);


export interface EditOptions {
    getCurrentLayerId(): string;
    getMetadata(lid: string): Inspire;

    editFeature(fid: string | number): void;
    addFeature(f: Feature): void;
    setGeometry(geom: DirectGeometryObject): void;
}

export interface SelectOptions {
    // selectFeature(f: Feature): void;
    selectFeature(id: string | number): void;
}


export interface IMapOptions {
    element: Element | null;
    getBaseLayer(): IMapBaseLayer | null;
    getView(): IMapViewData;
    getMapInfo(): IMapInfo | null;

    updateView(v: IViewEvent): void;
    setScaleLine: SetScaleLine;
}


export interface IViewEvent {
    dirty?: ViewDirt;
    center?: Coordinate;
    rotation?: number;
    zoom?: number;
}




export * from './map';
export * from './events';
export * from './queries';

