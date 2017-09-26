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
import { query } from './index';
import { Map as OLMap, layer, Feature, Sphere, proj } from 'openlayers';
import appQueries from './app';

const logger = debug('sdi:queries:map');
const wgs84Sphere = new Sphere(6378137);
let mapRef: OLMap;

export const setMapReference = (map: OLMap) => {
    mapRef = map;
};

const queries = {

    getView() {
        return query('port/map/view');
    },

    getBaseLayer() {
        const mapInfo = appQueries.getMapInfo();
        if (mapInfo) {
            return mapInfo.baseLayer;
        }
        return null;
    },

    getAllBaseLayers() {
        return query('port/map/baseLayers');
    },

    getScaleLine() {
        return query('port/map/scale');
    },

    getTracking() {
        return query('port/map/tracker');
    },

    /**
     * runs a map function against features from the selected
     * layer in the current view extent.
     * 
     * @param id layer ID
     * @param fn map function
     */
    mapFeatures<T>(id: string, fn: (a: Feature) => T) {
        const results: T[] = [];
        let lyr: layer.Vector | undefined;

        if (mapRef) {
            mapRef.getLayers().forEach((l) => {
                if (l.get('id') === id) {
                    lyr = <layer.Vector>l;
                }
            });

            if (lyr) {
                const e = mapRef.getView().calculateExtent(mapRef.getSize());
                // logger(`mapFeatures ${lyr} - ${e}`);
                lyr.getSource()
                    .forEachFeatureInExtent<null, void>(e, (f) => {
                        results.push(fn(f));
                    });
            }
        }
        return results;
    },

    getMeasure() {
        return query('port/map/measure');
    },

    getMeasuredLength() {
        const state = query('port/map/measure');
        const coordinates = state.coordinates.map(
            c => proj.transform(c, 'EPSG:31370', 'EPSG:4326'));
        const length = coordinates.reduce((acc, c, idx) => {
            if (idx === 0) {
                return 0;
            }
            const lastPoint = coordinates[idx - 1];
            return acc + wgs84Sphere.haversineDistance(lastPoint, c);
        }, 0);
        return Math.round(length);
    },

    getMeasuredArea() {
        const state = query('port/map/measure');
        const coordinates = state.coordinates.map(
            c => proj.transform(c, 'EPSG:31370', 'EPSG:4326'));
        if (coordinates.length < 3) {
            return 0;
        }
        return Math.round(Math.abs(wgs84Sphere.geodesicArea(coordinates)));
    },

};

export default queries;

logger('loaded');
