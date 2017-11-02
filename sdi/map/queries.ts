
import { Sphere, proj } from 'openlayers';

import { MeasureGetter } from './index';


const wgs84Sphere = new Sphere(6378137);

export const measureQueries =
    (query: MeasureGetter) => ({
        getMeasuredLength() {
            const state = query();
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
            const state = query();
            const coordinates = state.coordinates.map(
                c => proj.transform(c, 'EPSG:31370', 'EPSG:4326'));
            if (coordinates.length < 3) {
                return 0;
            }
            return Math.round(Math.abs(wgs84Sphere.geodesicArea(coordinates)));
        },
    });

