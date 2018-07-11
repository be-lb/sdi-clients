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
import { inputs, solarSim, roof } from 'solar-sim';

import { dispatch, dispatchK, query } from 'sdi/shape';
import { getFeatureProp } from 'sdi/source';
import { Obstacle } from '../components/adjust';


const dispatchInputs = dispatchK('solar/inputs');
const dispatchOutputs = dispatchK('solar/outputs');

export type SetNumKeyOfInputs =
    | 'nYears'
    | 'currentYear'
    | 'elecSellingPrice'
    | 'CVPrice'
    | 'pvArea'
    | 'annualConsumptionKWh'
    | 'installationPrice'
    ;

export const setNumInputF =
    <K extends SetNumKeyOfInputs>(k: K) =>
        (v: inputs[K]) => dispatchInputs(state => ({
            ...state,
            [k]: v,
        }));


export const updateRoofs =
    (capakey: string) => fromNullable(query('solar/data/roofs')[capakey])
        .map(fc => dispatchInputs(ins => {
            const ns = {
                ...ins,
                roofs: fc.features.map<roof>(f => ({
                    area: getFeatureProp(f, 'area', 0),
                    productivity: getFeatureProp(f, 'productivity', 0),
                    tilt: getFeatureProp(f, 'tilt', 0),
                })),
            };
            console.log(JSON.stringify(ns));
            return ns;
        }));

export const simulate =
    (capakey: string) => {
        updateRoofs(capakey);
        dispatchOutputs(() => {
            try {
                return solarSim(query('solar/inputs'));
            }
            catch (_err) {
                return null;
            }
        });
    };




export const setObstacle =
    (o: Obstacle, n: number) => {
        dispatch('solar/obstacle', state => ({ ...state, [o]: n }));
    };
