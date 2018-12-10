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
import { getApiUrl } from 'sdi/app';

import { Obstacle, defaulObstacles } from '../components/adjust/obstacle';
import { getCapakey } from '../queries/app';
import { totalArea, getSystem, pvTechnology, getConstants } from '../queries/simulation';
import { System } from '../shape/solar';
import { Camera } from '../components/context/mat';
import { thermicSolarSim } from 'solar-sim/lib/run';
import { fetchConstants, fetchNotes } from '../remote/index';

const logger = debug('sdi:solar/events');

const dispatchInputs = dispatchK('solar/inputs');
const dispatchPvOutputs = dispatchK('solar/outputs/pv');
const dispatchThermalOutputs = dispatchK('solar/outputs/thermal');

export type SetNumKeyOfInputs =
    | 'annualConsumptionKWh'
    | 'annualMaintenanceCost'
    | 'currentYear'
    | 'installationPrice'
    | 'loanPeriod'
    | 'nYears'
    | 'pvArea'
    | 'VATrate'
    ;


export const loadConstants =
    () =>
        fetchConstants(getApiUrl('geodata/solar/constants/'))
            .then(cs => dispatch('solar/constants', () => cs));

export const loadWidgets =
    () =>
        fetchNotes(getApiUrl('geodata/solar/widgets/'))
            .then(notes => dispatch('solar/widgets', () => notes));


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

observe('solar/constants', () => simulate());

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
                    return {
                        area: getFeatureProp(f, 'area', 0.000001),
                        irradiance: (getFeatureProp(f, 'irradiance', 0) / 1000),
                        productivity: getFeatureProp(f, 'productivity', 0),
                        tilt: getFeatureProp(f, 'tilt', 35),
                        azimuth: getFeatureProp(f, 'azimuth', 180),
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


export const setPower =
    (n: number) => {
        const constants = query('solar/constants');
        if (constants === null) {
            return;
        }
        const tech = pvTechnology();
        const delivered = constants.pv_yield[tech];
        setInputF('pvArea')(n / delivered);
    };

const simulate =
    () => {
        const constants = query('solar/constants');
        if (constants === null) {
            return;
        }
        const inputs = query('solar/inputs');
        if (getSystem() === 'photovoltaic') {
            dispatchPvOutputs(() => {
                try {
                    return solarSim(inputs, constants);
                }
                catch (_err) {
                    return null;
                }
            });
            if (inputs.pvArea >= 0) {
                // here we want to still have optimal area for the whole thing
                const oa = solarSim({ ...inputs, pvArea: -9999 }, constants).maxArea;
                dispatch('solar/optimalArea', () => oa);
            }
            else {
                dispatch('solar/optimalArea', () => null);
            }
        }
        else {
            dispatchThermalOutputs(() => {
                try {
                    return thermicSolarSim(inputs, constants);
                }
                catch (_err) {
                    return null;
                }
            });
        }
    };

export const setObstacle =
    (o: Obstacle, n: number) =>
        getConstants().map((cs) => {
            let obsSurface = 0.0;
            dispatch('solar/obstacle', (state) => {
                const ns = { ...state, [o]: n };
                Object.keys(ns).forEach((k: Obstacle) => obsSurface += cs.obstacle[k] * ns[k]);
                return ns;
            });
            const obstacleRate = obsSurface / totalArea();
            dispatch('solar/inputs', state => ({ ...state, obstacleRate }));
        });


export const clearPerspective =
    () => {
        dispatch('solar/perspective/camera', () => null);
        dispatch('solar/perspective/src', () => null);
    };


export const setPerspectiveCamera =
    (p: Camera) => dispatch('solar/perspective/camera', () => p);


export const setPerspectiveSrc =
    (p: string) => dispatch('solar/perspective/src', () => p);

observe('solar/data/roofs',
    () => dispatch('solar/perspective/src', () => null));

logger('loaded');
