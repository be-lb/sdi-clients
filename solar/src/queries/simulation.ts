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

import { fromNullable, none, some } from 'fp-ts/lib/Option';
import bbox from '@turf/bbox';

import { query, queryK } from 'sdi/shape';
import tr from 'sdi/locale';
// import { withEuro, withTCO2Y, withM2, withPercent, withKWhY, withYear, withKWc } from 'sdi/util';
import { getFeatureProp } from 'sdi/source';

import { getCapakey } from './app';
import { Obstacle } from '../components/adjust/index';
import { identity } from 'fp-ts/lib/function';
import { outputs, inputs } from 'solar-sim';


export const streetName =
    () => fromNullable(query('solar/address'))
        .fold('--', ({ street }) => street.name);
export const streetNumber =
    () => fromNullable(query('solar/address'))
        .fold('--', ({ number }) => number);
export const locality =
    () => fromNullable(query('solar/address'))
        .fold('--', ({ street }) => street.municipality);

export const potential = () => tr('solSolarPotentialExcellent');


const roofs = queryK('solar/data/roofs');
const buildings = queryK('solar/data/buildings');

export const PROD_THESH_HIGH = 12000 * 1000;
export const PROD_THESH_MEDIUM = 8000 * 1000;


export const getRoofs =
    () => getCapakey().chain((ck) => {
        const rc = roofs();
        if (ck in rc) {
            return some(rc[ck]);
        }
        return none;
    });

export const getBuildings =
    () => getCapakey().chain((ck) => {
        const rc = buildings();
        if (ck in rc) {
            return some(rc[ck]);
        }
        return none;
    });

const getRoofFeatures =
    () => getRoofs().map(fc => fc.features);

export const totalArea =
    () => getRoofFeatures()
        .fold(
            0,
            fs => fs.reduce((acc, r) => acc + getFeatureProp(r, 'area', 0), 0),
    );

const areaProductivity =
    (low: number, high: number) =>
        () => getRoofFeatures()
            .fold(
                0,
                (features) => {
                    const ta = Math.max(0.1, totalArea()); // ugly but...
                    const catArea = features
                        .filter((f) => {
                            const p = getFeatureProp(f, 'productivity', 0);
                            return (p >= low) && (p < high);
                        })
                        .reduce((acc, f) => acc + getFeatureProp(f, 'area', 0), 0);
                    return catArea * 100 / ta;
                },
        );


export const areaExcellent = areaProductivity(PROD_THESH_HIGH, Number.MAX_VALUE);
export const areaMedium = areaProductivity(PROD_THESH_MEDIUM, PROD_THESH_HIGH);
export const areaLow = areaProductivity(Number.MIN_VALUE, PROD_THESH_MEDIUM);


const queryInputs = queryK('solar/inputs');
export type GetNumKeyOfInputs =
    | 'nYears'
    | 'currentYear'
    | 'elecSellingPrice'
    | 'CVPrice'
    | 'pvArea'
    | 'annualConsumptionKWh'
    | 'installationPrice'
    ;

export const getInputF =
    <K extends keyof inputs>(k: K) => () => queryInputs()[k];

export const getNumInputF =
    <K extends GetNumKeyOfInputs>(k: K) => getInputF(k);


// export const selfConsumptionAmountYearN = () => withEuro(1000)

type OutputKey = keyof outputs;

export const getOutput =
    <K extends OutputKey>(k: K, dflt = 0): number =>
        fromNullable(query('solar/outputs')).fold(dflt, out => out[k]);



export const annualConsumption =
    () => queryInputs()['annualConsumptionKWh'];


export const pvTechnology =
    () => queryInputs()['pvTechnology'];


export const getObstacle =
    (o: Obstacle) => query('solar/obstacle')[o];


export const getOptimalArea =
    () => fromNullable(query('solar/optimalArea')).foldL(
        () => getOutput('maxArea'),
        n => n,
    );

export const getOrthoURL =
    () =>
        getCapakey()
            .chain((ck) => {
                const geoms = query('solar/data/geoms');
                if (ck in geoms) {
                    const [minx, miny, maxx, maxy] = bbox(geoms[ck]);
                    const width = maxx - minx;
                    const height = maxy - miny;
                    const sideMax = Math.max(width, height);
                    const sideMin = Math.min(width, height);
                    const abbox = [
                        minx - ((sideMax - sideMin) / 2),
                        miny - ((sideMax - sideMin) / 2),
                        minx + sideMax,
                        miny + sideMax,
                    ];

                    const bboxString = abbox.map(c => c.toFixed(2)).join('%2C');
                    const url = `https://geodata.environnement.brussels/webservice/wmsproxy/urbis.irisnet.be?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=Ortho2016&WIDTH=1024&HEIGHT=1024&SRS=EPSG%3A31370&STYLES=&BBOX=${bboxString}`;
                    return some(url);
                }
                return none;
            })
            .fold('', identity);
