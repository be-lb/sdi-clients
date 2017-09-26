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
 
import { i, u, l, a, p, TypeOf } from './io';
import * as io from 'io-ts';

export const PropertiesIO = u([io.dictionary(io.string, io.any), io.null]);

export const GeometryTypeIO = u([
    l('Point'),
    l('Polygon'),
    l('LineString'),
    l('MultiPoint'),
    l('MultiPolygon'),
    l('MultiLineString'),
], 'GeometryTypeIO');

/***
* http://geojson.org/geojson-spec.html#coordinate-reference-system-objects
*/
export const CoordinateReferenceSystemIO = i({
    type: io.string,
    properties: io.any,
}, 'CoordinateReferenceSystemIO');

/***
* http://geojson.org/geojson-spec.html#geojson-objects
*/
export const GeoJsonObjectIO = io.intersection([
    i({
        type: io.string,
    }),
    p({
        bbox: a(io.number),
        crs: CoordinateReferenceSystemIO,
    }),
], 'GeoJsonObjectIO');

/***
* http://geojson.org/geojson-spec.html#positions
*/
export const PositionIO = a(io.number, 'PositionIO');

export const CoordinatesIO = u([
    PositionIO,
    a(PositionIO),
    a(a(PositionIO)),
    a(a(a(PositionIO))),
], 'CoordinatesIO');

/***
* http://geojson.org/geojson-spec.html#geometry-objects
*/
export const DirectGeometryObjectIO = io.intersection([
    GeoJsonObjectIO,
    i({
        type: GeometryTypeIO,
        coordinates: CoordinatesIO,
    }),
], 'DirectGeometryObjectIO');

/**
 * GeometryObject supports geometry collection as well
 */
export const GeometryObjectIO = u([DirectGeometryObjectIO/*, GeometryCollection*/], 'GeometryObjectIO');

/***
* http://geojson.org/geojson-spec.html#point
*/
export const PointIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('Point'),
        coordinates: PositionIO,
    }),
], 'PointIO');

/***
* http://geojson.org/geojson-spec.html#multipoint
*/
export const MultiPointIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('MultiPoint'),
        coordinates: a(PositionIO),
    }),
], 'MultiPointIO');

/***
* http://geojson.org/geojson-spec.html#linestring
*/
export const LineStringIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('LineString'),
        coordinates: a(PositionIO),
    }),
], 'LineStringIO');

/***
* http://geojson.org/geojson-spec.html#multilinestring
*/
export const MultiLineStringIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('MultiLineString'),
        coordinates: a(a(PositionIO)),
    }),
], 'MultiLineStringIO');

/***
* http://geojson.org/geojson-spec.html#polygon
*/
export const PolygonIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('Polygon'),
        coordinates: a(a(PositionIO)),
    }),
], 'PolygonIO');

/***
* http://geojson.org/geojson-spec.html#multipolygon
*/
export const MultiPolygonIO = io.intersection([
    DirectGeometryObjectIO,
    i({
        type: l('MultiPolygon'),
        coordinates: a(a(a(PositionIO))),
    }),
], 'MultiPolygonIO');

/***
* http://geojson.org/geojson-spec.html#geometry-collection
*/
// export const GeometryCollection = io.intersection([
//     GeoJsonObject,
//     i({
//         type: l('GeometryCollection'),
//         geometries: a(GeometryObject),
//     }),
// ]);

/***
* http://geojson.org/geojson-spec.html#feature-objects
*/
export const FeatureIO = io.intersection([
    GeoJsonObjectIO,
    i({
        type: l('Feature'),
        geometry: GeometryObjectIO,
        properties: PropertiesIO,
        // }),
        // p({
        id: u([io.string, io.number]),
    }),
], 'FeatureIO');

/***
* http://geojson.org/geojson-spec.html#feature-collection-objects
*/
export const FeatureCollectionIO = io.intersection([
    GeoJsonObjectIO,
    i({
        type: l('FeatureCollection'),
        features: a(FeatureIO),
    }),
], 'FeatureCollectionIO');



export const NamedCoordinateReferenceSystemIO = io.intersection([
    CoordinateReferenceSystemIO,
    i({
        properties: i({ name: io.string }),
    }),
], 'NamedCoordinateReferenceSystemIO');

export const LinkedCoordinateReferenceSystemIO = io.intersection([
    CoordinateReferenceSystemIO,
    i({
        properties: i({
            href: io.string,
            type: io.string,
        }),
    }),
], 'LinkedCoordinateReferenceSystemIO');

export type CoordinateReferenceSystem = TypeOf<typeof CoordinateReferenceSystemIO>;
export type GeometryType = TypeOf<typeof GeometryTypeIO>;
export type GeoJsonObject = TypeOf<typeof GeoJsonObjectIO>;
export type Position = TypeOf<typeof PositionIO>;
export type DirectGeometryObject = TypeOf<typeof DirectGeometryObjectIO>;
export type GeometryObject = TypeOf<typeof GeometryObjectIO>;
export type Point = TypeOf<typeof PointIO>;
export type MultiPoint = TypeOf<typeof MultiPointIO>;
export type LineString = TypeOf<typeof LineStringIO>;
export type MultiLineString = TypeOf<typeof MultiLineStringIO>;
export type Polygon = TypeOf<typeof PolygonIO>;
export type MultiPolygon = TypeOf<typeof MultiPolygonIO>;
export type Feature = TypeOf<typeof FeatureIO>;
export type FeatureCollection = TypeOf<typeof FeatureCollectionIO>;
export type NamedCoordinateReferenceSystem = TypeOf<typeof NamedCoordinateReferenceSystemIO>;
export type LinkedCoordinateReferenceSystem = TypeOf<typeof LinkedCoordinateReferenceSystemIO>;


export type Properties = TypeOf<typeof PropertiesIO>;

