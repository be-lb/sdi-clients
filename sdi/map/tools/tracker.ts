import {
    Collection,
    Feature,
    Geolocation,
    layer,
    Map,
    proj,
    source,
    geom,
    style,
} from 'openlayers';

import {
    TrackerOptions,
    Interaction,
    fromInteraction,
} from '..';


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
                    .foldL(
                        () => {
                            geolocationSource.clear();
                            geolocation.setTracking(false);
                        },
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
