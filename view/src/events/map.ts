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
 
import { dispatch, IEventData } from './index';
import { Coordinate } from 'openlayers';
import { TrackerCoordinate } from '../shape';
import appQueries from '../queries/app';
import mapQueries from '../queries/map';
import { hashMapBaseLayer } from '../util/app';

export interface IViewEvent extends IEventData {
    dirty?: boolean;
    center?: Coordinate;
    rotation?: number;
    zoom?: number;
}

export interface ILayerIdentifier extends IEventData {
    name: string;
}


export default {
    updateMapView(data: IViewEvent): void {
        dispatch('port/map/view', (viewState) => {
            viewState.dirty = (data.dirty !== undefined) ? data.dirty : viewState.dirty;
            viewState.center = data.center || viewState.center;
            viewState.rotation = data.rotation || viewState.rotation;
            viewState.zoom = data.zoom || viewState.zoom;
            return viewState;
        });
    },

    selectBaseLayer(h: string) {
        const mid = appQueries.getCurrentMap();
        const layers = mapQueries.getAllBaseLayers();
        layers.forEach((l) => {
            const lh = hashMapBaseLayer(l);
            if (h === lh) {
                dispatch('data/maps', (maps) => {
                    const info = maps.find(m => mid === m.id);
                    if (info) {
                        info.baseLayer = { ...l };
                    }
                    return maps;
                });
            }
        });
    },

    setScaleLine(count: number, unit: string, width: number) {
        dispatch('port/map/scale', () => ({
            count, unit, width,
        }));
    },

    startTrack() {
        dispatch('port/map/tracker', () => ({
            track: [],
            active: true,
        }));
    },

    stopTrack() {
        dispatch('port/map/tracker', tracker => ({
            active: false,
            track: tracker.track,
        }));
    },

    resetTrack() {
        dispatch('port/map/tracker', tracker => ({
            active: tracker.active,
            track: [],
        }));
    },

    updateTrack(coords: TrackerCoordinate) {
        dispatch('port/map/tracker', (tracker) => {
            tracker.track.push(coords);
            return tracker;
        });
    },

    startMeasureLength() {
        dispatch('port/map/measure', () => ({
            geometryType: 'LineString',
            coordinates: [],
            active: true,
        }));
    },


    startMeasureArea() {
        dispatch('port/map/measure', () => ({
            geometryType: 'Polygon',
            coordinates: [],
            active: true,
        }));
    },

    stopMeasure() {
        dispatch('port/map/measure', (state) => {
            state.active = false;
            return state;
        });
    },

    updateMeasureCoordinates(coords: Coordinate[]) {
        dispatch('port/map/measure', (state) => {
            state.coordinates = coords;
            return state;
        });
    },
};
