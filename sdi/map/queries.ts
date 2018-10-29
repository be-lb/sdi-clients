
import { Sphere, proj } from 'openlayers';

import { Getter } from '../shape';
import { Interaction, fromInteraction, IGeoMeasure } from '.';
import { formatNumber } from '../locale';


const wgs84Sphere = new Sphere(6378137);

const length =
    (state: IGeoMeasure) => {
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
    };

const getMeasuredLength =
    (query: Getter<Interaction>) =>
        () => fromInteraction('measure', query())
            .map(({ state }) => length(state));


const area =
    (state: IGeoMeasure) => {
        const coordinates = state.coordinates.map(
            c => proj.transform(c, 'EPSG:31370', 'EPSG:4326'));
        if (coordinates.length < 3) {
            return 0;
        }
        return Math.round(Math.abs(wgs84Sphere.geodesicArea(coordinates)));
    };

const getMeasuredArea =
    (query: Getter<Interaction>) =>
        () => fromInteraction('measure', query())
            .map(({ state }) => area(state));


export const measureQueryFactory =
    (query: Getter<Interaction>) => ({
        getMeasuredLength: getMeasuredLength(query),
        getMeasuredArea: getMeasuredArea(query),

        getMeasured() {
            return fromInteraction('measure', query())
                .fold(
                    'NotMeasuring',
                    ({ state }) => {
                        switch (state.geometryType) {
                            case 'LineString':
                                return `${formatNumber(length(state))}&#8239;m`;
                            case 'Polygon':
                                return `${formatNumber(area(state))}&#8239;m²`;
                        }
                    });
        },
    });

