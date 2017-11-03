import { Coordinate } from 'openlayers';

import { MeasureSetter, TrackerSetter, TrackerCoordinate, ViewSetter, IViewEvent, ScaleSetter } from './index';

// 'port/map/measure': IGeoMeasure;
export const measureEvents =
    (dispatch: MeasureSetter) => ({

        startMeasureLength() {
            dispatch(() => ({
                geometryType: 'LineString',
                coordinates: [],
                active: true,
            }));
        },

        startMeasureArea() {
            dispatch(() => ({
                geometryType: 'Polygon',
                coordinates: [],
                active: true,
            }));
        },

        stopMeasure() {
            dispatch((state) => {
                state.active = false;
                return state;
            });
        },

        updateMeasureCoordinates(coords: Coordinate[]) {
            dispatch((state) => {
                state.coordinates = coords;
                return state;
            });
        },

    });

// 'port/map/tracker': IGeoTracker;
export const trackerEvents =
    (dispatch: TrackerSetter) => ({
        startTrack() {
            dispatch(() => ({
                track: [],
                active: true,
            }));
        },

        stopTrack() {
            dispatch(tracker => ({
                active: false,
                track: tracker.track,
            }));
        },

        resetTrack() {
            dispatch(tracker => ({
                active: tracker.active,
                track: [],
            }));
        },

        updateTrack(coords: TrackerCoordinate) {
            dispatch((tracker) => {
                tracker.track.push(coords);
                return tracker;
            });
        },
    });



// 'port/map/view': IMapViewData;
export const viewEvents =
    (dispatch: ViewSetter) => ({
        updateMapView(data: IViewEvent): void {
            dispatch((viewState) => {
                viewState.dirty = (data.dirty !== undefined) ? data.dirty : viewState.dirty;
                viewState.center = data.center || viewState.center;
                viewState.rotation = data.rotation || viewState.rotation;
                viewState.zoom = data.zoom || viewState.zoom;
                return viewState;
            });
        },
    });


// 'port/map/scale': IMapScale;
export const scaleEvents =
    (dispatch: ScaleSetter) => ({
        setScaleLine(count: number, unit: string, width: number) {
            dispatch(() => ({
                count, unit, width,
            }));
        },
    });
