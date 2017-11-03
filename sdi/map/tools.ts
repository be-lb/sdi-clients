

import {
    Collection,
    Feature,
    Geolocation,
    interaction,
    layer,
    Map,
    proj,
    source,
    geom,
    style,
} from 'openlayers';

import {
    TrackerOptions,
    MeasureOptions,
    Interaction,
    fromInteraction,
} from './index';


const trackerStyles =
    (accuracy: number, res: number) => ([
        new style.Style({
            image: new style.Circle({
                radius: accuracy / res,
                fill: new style.Fill({
                    color: 'rgba(255,255,255,.3)',
                }),
                stroke: new style.Stroke({
                    color: '#FF4C00',
                    width: 1,

                }),
            }),
        }),
        new style.Style({
            image: new style.Circle({
                radius: 6,
                fill: new style.Fill({
                    color: '#3399CC',
                }),
                stroke: new style.Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        }),
    ]);



export const track =
    ({ updateTrack, resetTrack, setCenter }: TrackerOptions) => {

        const tracker = (geoloc: Geolocation) => () => {
            updateTrack({
                coord: geoloc.getPosition(),
                accuracy: geoloc.getAccuracy(),
            });
        };


        // geolocation
        const geolocation = new Geolocation({
            projection: proj.get('EPSG:31370'),
            tracking: false,
        });

        geolocation.on('change', tracker(geolocation));

        const geolocationSource = new source.Vector();
        const geolocationLayer = new layer.Vector({
            source: geolocationSource,
        });

        const isTracking =
            () => geolocation.getTracking();

        const update =
            (i: Interaction) =>
                fromInteraction('track', i)
                    .fold(
                    () => geolocation.setTracking(false),
                    ({ state }) => {
                        geolocationSource.clear();
                        if (!isTracking()) {
                            resetTrack();
                        }
                        geolocation.setTracking(true);

                        const features = state.track.map((coords) => {
                            const accuracy = coords.accuracy;
                            const f = new Feature({
                                geometry: new geom.Point(coords.coord),
                            });
                            f.setStyle((r: number) => {
                                return trackerStyles(accuracy, r);
                            });
                            return f;
                        });
                        geolocationSource.addFeatures(features);
                        if (state.track.length > 0) {
                            const last = state.track[state.track.length - 1];
                            setCenter(last.coord);
                        }
                    });

        const init =
            (_map: Map, layers: Collection<layer.Vector>) => {
                layers.push(geolocationLayer);
                // map.addInteraction();
            };

        return { init, update };
    };


// measure
const measureHandlers =
    ({ updateMeasureCoordinates, stopMeasuring }: MeasureOptions) => {
        const startMeasureLength = (e: any) => {
            const feature: Feature = e.feature;
            const line = <geom.LineString>feature.getGeometry();
            line.on('change', () => {
                updateMeasureCoordinates(line.getCoordinates());
            });
        };

        const stopMeasureLength = (s: source.Vector) => () => {
            s.clear();
            stopMeasuring();
        };


        const startMeasureArea = (e: any) => {
            const feature: Feature = e.feature;
            const polygon = <geom.Polygon>feature.getGeometry();
            polygon.on('change', () => {
                updateMeasureCoordinates(
                    polygon.getLinearRing(0).getCoordinates());
            });
        };

        const stopMeasureArea = (s: source.Vector) => () => {
            s.clear();
            stopMeasuring();
        };

        return {
            startMeasureLength,
            stopMeasureLength,
            startMeasureArea,
            stopMeasureArea,
        };
    };

export const measure =
    (options: MeasureOptions) => {
        const measureSource = new source.Vector();
        const measureLayer = new layer.Vector({
            source: measureSource,
        });
        const measureLength = new interaction.Draw({
            type: 'LineString',
            source: measureSource,
        });
        const measureArea = new interaction.Draw({
            type: 'Polygon',
            source: measureSource,
        });

        const {
            startMeasureLength,
            stopMeasureLength,
            startMeasureArea,
            stopMeasureArea,
        } = measureHandlers(options);

        measureLength.on('drawstart', startMeasureLength);
        measureLength.on('drawend', stopMeasureLength);
        measureArea.on('drawstart', startMeasureArea);
        measureArea.on('drawend', stopMeasureArea);

        const isMeasuring =
            () => measureLength.getActive() || measureArea.getActive();

        const update =
            (i: Interaction) =>
                fromInteraction('measure', i)
                    .fold(
                    () => {
                        measureSource.clear();
                        measureLength.setActive(false);
                        measureArea.setActive(false);
                    },
                    ({ state }) => {
                        if (!isMeasuring()) {
                            measureSource.clear();
                        }
                        switch (state.geometryType) {
                            case 'LineString':
                                measureLength.setActive(true);
                                break;
                            case 'Polygon':
                                measureArea.setActive(true);
                                break;
                        }

                    });

        const init =
            (map: Map, layers: Collection<layer.Vector>) => {
                layers.push(measureLayer);
                map.addInteraction(measureLength);
                map.addInteraction(measureArea);
            };

        return { init, update };
    };

