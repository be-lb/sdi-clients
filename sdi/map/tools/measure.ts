import {
    Collection,
    Feature,
    interaction,
    layer,
    Map,
    source,
    geom,
} from 'openlayers';

import {
    MeasureOptions,
    Interaction,
    fromInteraction,
} from '../index';


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
