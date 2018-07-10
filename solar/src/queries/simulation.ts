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

import { fromNullable } from 'fp-ts/lib/Option';
// import { identity } from 'fp-ts/lib/function';

import { query, queryK } from 'sdi/shape';
import tr from 'sdi/locale';
import { withEuro, withTCO2Y, withM2, withPercent, withKWhY, withYear, withKWc } from 'sdi/util';



export const streetName =
    () => fromNullable(query('solar-sim/address'))
        .fold('--', ({ street }) => street.name);
export const streetNumber =
    () => fromNullable(query('solar-sim/address'))
        .fold('--', ({ number }) => number);
export const locality =
    () => fromNullable(query('solar-sim/address'))
        .fold('--', ({ street }) => street.municipality);

export const potential = () => tr('solSolarPotentialExcellent');


const roofs = queryK('data/solar-sim');

const PROD_THESH_HIGH = 1000;
const PROD_THESH_MEDIUM = 1000;


const totalArea = () => roofs().reduce((acc, r) => acc + r.area, 0);

const areaProductivity =
    (low: number, high: number) =>
        () =>
            roofs()
                .filter(r => r.productivity >= low && r.productivity < high)
                .reduce((acc, r) => acc + r.area, 0) * 100 / Math.max(0.1, totalArea());


export const areaExcellent = areaProductivity(PROD_THESH_HIGH, Number.MAX_VALUE);
export const areaMedium = areaProductivity(PROD_THESH_MEDIUM, PROD_THESH_HIGH);
export const areaLow = areaProductivity(Number.MIN_VALUE, PROD_THESH_MEDIUM);

/*
interface mainOutputs {
    'installationCost': number, euro
    'CVAmountYearN': number, euro
    'selfConsumptionAmountYearN': number,  ??
    'savedCO2emissions': number; TCO2Y
}

interface setupOutputs {
    'area': number, m2
    'power': number, kwc
    'obstacleRate': number percent
}

interface energyOutputs {
    'annualProduction': number, kwhy
    'annualConsumption': number, kwhy
    'autonomy': number percent
}

interface financeOutputs {
    'totalGain25Y': number, euro
    'returnTime': number year
}

interface outputs {
    'main': mainOutputs,
    'setup': setupOutputs,
    'energy': energyOutputs,
    'finance': financeOutputs
};
*/

const queryInputs = queryK('solar-sim/inputs');
export type GetNumKeyOfInputs =
    | 'nYears'
    | 'currentYear'
    | 'elecSellingPrice'
    | 'CVPrice'
    | 'pvArea'
    | 'annualConsumptionKWh'
    | 'installationPrice'
    ;

export const getNumInputF =
    <K extends GetNumKeyOfInputs>(k: K) => () => queryInputs()[k];

export const installationCost = () => withEuro(1000);

export const CVAmountYearN = () => withEuro(1000);

// export const selfConsumptionAmountYearN = () => withEuro(1000)


export const savedCO2emissions = () => withTCO2Y(1000);

export const area = () => withM2(1000);

export const power = () => withKWc(1000);

export const obstacleRate = () => withPercent(1000);

export const annualProduction = () => withKWhY(1000);

export const annualConsumption = () => withTCO2Y(1000);

export const autonomy = () => withPercent(1000);

export const totalGain25Y = () => withEuro(1000);

export const returnTime = () => withYear(1000);





