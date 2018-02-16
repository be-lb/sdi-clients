import { Coordinate } from 'openlayers';

import { Setter } from '../shape';
import { TrackerCoordinate, IViewEvent, IMapViewData, IMapScale, Interaction, IGeoTracker, InteractionTrack, IGeoMeasure, InteractionMeasure, defaultInteraction, fromInteraction } from './index';

// 'port/map/measure': IGeoMeasure;
const measureEvent =
    (state: IGeoMeasure): InteractionMeasure => ({
        state,
        label: 'measure',
    });
export const measureEventsFactory =
    (dispatch: Setter<Interaction>) => ({

        startMeasureLength() {
            dispatch(() => measureEvent({
                geometryType: 'LineString',
                coordinates: [],
            }));
        },

        startMeasureArea() {
            dispatch(() => measureEvent({
                geometryType: 'Polygon',
                coordinates: [],
            }));
        },

        stopMeasure() {
            dispatch(defaultInteraction);
        },

        updateMeasureCoordinates(coordinates: Coordinate[]) {
            dispatch(i => fromInteraction('measure', i)
                .fold(
                    i,
                    it => measureEvent({
                        coordinates,
                        geometryType: it.state.geometryType,
                    })));
        },

    });

// 'port/map/tracker': IGeoTracker;
const trackerEvent =
    (state: IGeoTracker): InteractionTrack => ({
        state,
        label: 'track',
    });

export const trackerEventsFactory =
    (dispatch: Setter<Interaction>) => ({
        startTrack() {
            dispatch(() => trackerEvent({
                track: [],
            }));
        },

        stopTrack() {
            dispatch(defaultInteraction);
            // dispatch(i => fromInteraction('track', i)
            //     .fold(
            //     () => i,
            //     it => trackerEvent({ track: it.state.track })));
        },

        resetTrack() {
            dispatch(() => trackerEvent({
                track: [],
            }));
        },

        updateTrack(coords: TrackerCoordinate) {
            dispatch(i => fromInteraction('track', i)
                .fold(
                    i,
                    it => trackerEvent({ track: it.state.track.concat([coords]) })));
        },
    });



// 'port/map/view': IMapViewData;
export const viewEventsFactory =
    (dispatch: Setter<IMapViewData>) => ({
        updateMapView(data: IViewEvent): void {
            dispatch(viewState => ({
                dirty: (data.dirty !== undefined) ? data.dirty : viewState.dirty,
                center: data.center || viewState.center,
                rotation: data.rotation || viewState.rotation,
                zoom: data.zoom || viewState.zoom,
                srs: viewState.srs,
                feature: data.feature || null,
            }));
        },
    });


// 'port/map/scale': IMapScale;
export const scaleEventsFactory =
    (dispatch: Setter<IMapScale>) => ({
        setScaleLine(count: number, unit: string, width: number) {
            dispatch(() => ({ count, unit, width }));
        },
    });
