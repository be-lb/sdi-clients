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
import { fromNullable, none, some } from 'fp-ts/lib/Option';
import bbox from '@turf/bbox';

import { query, queryK, dispatchK } from 'sdi/shape';
import tr, { fromRecord } from 'sdi/locale';
// import { withEuro, withTCO2Y, withM2, withPercent, withKWhY, withYear, withKWc } from 'sdi/util';
import { getFeatureProp } from 'sdi/source';
import { value, getValue, setValue } from 'sdi/components/animated-value';

import { getCapakey } from './app';
import { Obstacle } from '../components/adjust';
import { identity } from 'fp-ts/lib/function';
import { outputs, inputs, thermicOutputs, PVTechnologyEnum, thermicHotWaterProducerEnum } from 'solar-sim';
import { MessageKey } from 'sdi/locale/message-db';


const logger = debug('sdi:simulation');

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

export const getConstants =
    () => fromNullable(query('solar/constants'));

export const prodThresholdHigh = () => getConstants().fold(0, cs => cs.medium_solar_productivity);
export const prodThresholdMedium = () => getConstants().fold(0, cs => cs.low_productivity_limit);

const Notes = {
    pv_obstacles: 'pvobstacle',
    pv_tech: 'pvtech',
    pv_num: 'pvnum',
    pv_consumption: 'pvcons',
    pv_autonomy: 'pvauto',
    pv_vat: 'pvvat',
    pv_loan: 'pvloan',
    thermal_sys: 'thsys',
    thermal_consumption: 'thcons',
    thermal_grant: 'thgrant',
    thermal_vat: 'thvat',
    thermal_loan: 'thloan',
};
export type Note = typeof Notes;
export type NoteKey = keyof Note;

export const getNote =
    (key: NoteKey) => {
        const kname = Notes[key];
        const widgets = query('solar/widgets');
        if (kname in widgets) {
            return fromRecord(widgets[kname]);
        }
        return '';
    };

export const pvTechnologyLabels: { [k in PVTechnologyEnum]: MessageKey } = {
    poly: 'polycristal',
    mono: 'monocristal',
    mono_high: 'monocristalHR',
};

export const thermalTechnologyLabels: { [k in thermicHotWaterProducerEnum]: MessageKey } = {
    electric: 'solElectricBoiler',
    fuel: 'solMazout',
    gas: 'solGaz',
};


export type Tag = 'great' | 'good' | 'unusable';

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
    (tag: Tag) =>
        () => getRoofFeatures()
            .fold(
                0,
                (features) => {
                    const ta = Math.max(0.01, totalArea()); // ugly but...
                    const catArea = features
                        .filter(f => getFeatureProp(f, 'tag', 'great') === tag)
                        .reduce((acc, f) => acc + getFeatureProp(f, 'area', 0), 0);

                    return catArea * 100 / ta;
                },
        );



export const areaExcellent = areaProductivity('great');
export const areaMedium = areaProductivity('good');
export const areaLow = areaProductivity('unusable');

export const usableRoofArea =
    () => {
        const usable = (totalArea() * (areaExcellent() + areaMedium()) / 100);
        const obsRate = queryInputs()['obstacleRate'];
        const obstacle = usable * obsRate;
        return usable - obstacle;
    };


const queryInputs = queryK('solar/inputs');
export type GetNumKeyOfInputs =
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
    | 'loanRate'
    | 'thermicLiterByDay'
    ;

export const getInputF =
    <K extends keyof inputs>(k: K) => () => queryInputs()[k];

export const getNumInputF =
    <K extends GetNumKeyOfInputs>(k: K) => getInputF(k);


// export const selfConsumptionAmountYearN = () => withEuro(1000)

type PvOutputKey = keyof outputs;
type ThermalOutputKey = keyof thermicOutputs;

export const getOutputPv =
    <K extends PvOutputKey>(k: K, dflt = 0): number =>
        fromNullable(query('solar/outputs/pv')).fold(dflt, out => out[k]);

const getAnimValues = queryK('solar/component/values');
const setAnimValues = dispatchK('solar/component/values');

export const getAnimatedValuePv =
    <K extends PvOutputKey>(k: K) =>
        value({
            getCurrent: getValue(getAnimValues, k),
            setCurrent: setValue(setAnimValues, k),
            target: () => getOutputPv(k),
        });

export const getOutputThermal =
    <K extends ThermalOutputKey>(k: K, dflt = 0): number =>
        fromNullable(query('solar/outputs/thermal')).fold(dflt, out => out[k]);

export const getAnimatedValueThermal =
    <K extends ThermalOutputKey>(k: K) =>
        value({
            getCurrent: getValue(getAnimValues, k),
            setCurrent: setValue(setAnimValues, k),
            target: () => getOutputThermal(k),
        });

export const getSystem = queryK('solar/system');


export const annualConsumption =
    () => queryInputs()['annualConsumptionKWh'];


export const pvTechnology =
    () => queryInputs()['pvTechnology'];

export const pvTechnologyLabel =
    () => pvTechnologyLabels[queryInputs()['pvTechnology']];

export const thermicTechnology =
    () => queryInputs()['thermicHotWaterProducer'];



export const getObstacle =
    (o: Obstacle) => query('solar/obstacle')[o];

export const getObstacleArea =
    () => queryInputs()['obstacleRate'] * totalArea();


export const PANEL_AREA = 1.6;


export const getOptimalArea =
    () => fromNullable(query('solar/optimalArea')).foldL(
        () => getOutputPv('maxArea'),
        n => n,
    );



export const getMaxPower =
    () => getConstants().fold(
        0,
        constants => getOptimalArea() * constants.pv_yield[pvTechnology()]);


export const getPanelUnits =
    () => Math.floor(getOutputPv('maxArea') / PANEL_AREA);



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


export interface LoadingStatus {
    loading: boolean;
    total: number;
    loaded: number;
    remaining: number;
}

const defaultLoading = (): LoadingStatus => ({
    loading: false,
    total: 0,
    loaded: 0,
    remaining: 0,
});

export const getLoading =
    () => {
        const loading = query('solar/loading').length;
        const loaded = query('solar/loaded').length;
        if (loading > 0) {
            return {
                loading: true,
                total: loading + loaded, loaded, remaining: loading,
            };

        }

        return defaultLoading();

    };


export const getPerpectiveCamera =
    () => fromNullable(query('solar/perspective/camera'));


export const getPerpectiveSrc =
    () => fromNullable(query('solar/perspective/src'));

logger('loaded');
