
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

import { parse as parseUrl } from 'url';

import { IShape } from 'sdi/shape';
import { FeatureCollection, IMapInfo, IReducer, StyleConfig } from 'sdi/source';
import { getApiUrl } from 'sdi/app';

import { putMap, postLayer } from '../remote';
import queries from '../queries/app';
import mapEvents from '../events/map';

export const processQuery = (state: IShape) => {
    const location = document.location;
    const url = parseUrl(location.href, true);

    if (url.query) {
        const q = url.query;



        // // Current User
        // if ('user' in q) {
        //     state['app/user'] = q.user;
        // }

        // Map View State
        const mapView = state['port/map/view'];
        if (('srs' in q) && q.srs === mapView.srs) {
            if (('lat' in q) && ('lon' in q)) {
                const lon = parseFloat(q.lon);
                const lat = parseFloat(q.lat);
                mapView.center = [lon, lat];
            }
            if ('zoom' in q) {
                mapView.zoom = parseInt(q.zoom, 10);
            }
            if ('rotation' in q) {
                mapView.rotation = parseInt(q.rotation, 10);
            }
            state['port/map/view'] = mapView;
        }
    }
};





export const syncMap =
    (m: IMapInfo) => {
        m.lastModified = Date.now();
        setTimeout(() => {
            putMap(getApiUrl(`maps/${m.id}`), m);
        }, 1);
    };


export const syncLayer =
    (id: string, fc: FeatureCollection) => {
        setTimeout(() => {
            postLayer(getApiUrl(`layers/${id}`), fc);
        }, 1);
    };


type DispatchFn = <K extends keyof IShape>(key: K, handler: IReducer<IShape, IShape[K]>) => void;

export const saveStyle =
    (dispatch: DispatchFn) => (lid: string, s: StyleConfig) => {
        const mid = queries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                const layerIndex = m.layers.findIndex(l => l.id === lid);
                if (layerIndex >= 0) {
                    m.layers[layerIndex].style = s;
                }
                syncMap(m);
            }
            mapEvents.updateMapView({ dirty: true });
            return maps;
        });
    };
