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

import * as debug from 'debug';


import { fromNullable } from 'fp-ts/lib/Option';
import { inputs, solarSim, roof, inputsFactory } from 'solar-sim';

import { IUgWsAddress } from 'sdi/ports/geocoder';
import { dispatch, dispatchK, query, observe } from 'sdi/shape';
import { getFeatureProp } from 'sdi/source';

import { Obstacle, defaulObstacles } from '../components/adjust/obstacle';
import { getCapakey } from '../queries/app';
import { totalArea, getSystem } from '../queries/simulation';
import { System } from '../shape/solar';
import { Camera } from '../components/context/mat';
import { thermicSolarSim } from 'solar-sim/lib/run';

const logger = debug('sdi:solar/events');

const dispatchInputs = dispatchK('solar/inputs');
const dispatchPvOutputs = dispatchK('solar/outputs/pv');
const dispatchThermalOutputs = dispatchK('solar/outputs/thermal');

export type SetNumKeyOfInputs =
    | 'nYears'
    | 'currentYear'
    | 'elecSellingPrice'
    | 'CVPrice'
    | 'pvArea'
    | 'annualConsumptionKWh'
    | 'installationPrice'
    | 'VATrate'
    | 'annualMaintenanceCost'
    | 'loanPeriod'
    ;


export const defaultInputs =
    (): inputs => ({ ...inputsFactory([]), nYears: 25, VATrate: 0.06 });

export const setAddress =
    (a: IUgWsAddress) => dispatch('solar/address', () => a);


observe('solar/inputs', () => {
    getCapakey().map(simulate);
});

observe('solar/system', () => {
    getCapakey().map(simulate);
});

export const setInputF =
    <K extends keyof inputs, T extends inputs[K]>(k: K) =>
        (v: T) => dispatchInputs(state => ({
            ...state,
            [k]: v,
        }));

export const setSystem =
    (s: System) => dispatch('solar/system', () => s);

export const updateRoofs =
    (capakey: string) => fromNullable(query('solar/data/roofs')[capakey])
        .map(fc => dispatchInputs((ins) => {
            const ns = {
                ...ins,
                roofs: fc.features.map<roof>((f) => {
                    const area = getFeatureProp(f, 'area', 0.000001);
                    return {
                        area,
                        productivity: (getFeatureProp(f, 'irradiance', 0) / 1000),
                        tilt: getFeatureProp(f, 'tilt', 35),
                    };
                }),
            };
            return ns;
        }));

export const clearInputs =
    () => {
        dispatchInputs(ins => ({ ...defaultInputs(), roofs: ins.roofs }));
        dispatch('solar/obstacle', () => defaulObstacles());
    };


const simulate =
    () => {
        const inputs = query('solar/inputs');
        if (getSystem() === 'photovoltaic') {
            dispatchPvOutputs(() => {
                try {
                    return solarSim(inputs);
                }
                catch (_err) {
                    return null;
                }
            });
            if (inputs.pvArea >= 0) {
                // here we want to still have optimal area for the whole thing
                const oa = solarSim({ ...inputs, pvArea: -9999 }).maxArea;
                dispatch('solar/optimalArea', () => oa);
            }
            else {
                dispatch('solar/optimalArea', () => null);
            }
        }
        else {
            dispatchThermalOutputs(() => {
                try {
                    return thermicSolarSim(inputs);
                }
                catch (_err) {
                    return null;
                }
            });
        }
    };


type ObsValue = { [k in Obstacle]: number };
const obstacleValues: ObsValue = {
    velux: 1.404,
    dormerWindow: 5.402,
    flatRoofWindow: 4.253,
    chimneySmoke: 0.9712,
    terraceInUse: 27.04,
    lift: 10.62,
    existingSolarPannel: 42.07,
};

export const setObstacle =
    (o: Obstacle, n: number) => {
        let obsSurface = 0.0;
        dispatch('solar/obstacle', (state) => {
            const ns = { ...state, [o]: n };
            Object.keys(ns).forEach((k: Obstacle) => obsSurface += obstacleValues[k] * ns[k]);
            return ns;
        });
        const obstacleRate = obsSurface / totalArea();
        dispatch('solar/inputs', state => ({ ...state, obstacleRate }));
    };

export const clearPerspective =
    () => dispatch('solar/perspective', () => null);

export const setPerspective =
    (p: Camera) => dispatch('solar/perspective', () => p);

logger('loaded');
