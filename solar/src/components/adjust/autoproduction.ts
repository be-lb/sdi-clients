import * as debug from 'debug';

import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { note } from './note';

const logger = debug('sdi:adjust/auto');

const getEnergySobriety = getInputF('energySobriety');
const getChargeShift = getInputF('chargeShift');
const getPVHeater = getInputF('pvHeater');
const getBattery = getInputF('battery');

const setEnergySobriety = setInputF('energySobriety');
const setChargeShift = setInputF('chargeShift');
const setPVHeater = setInputF('pvHeater');
const setBattery = setInputF('battery');

const NOPE = 0x1;
const A = 0x2;
const B = A << 1;
const C = B << 1;
const D = C << 1;


const setLevel =
    (l: number) => {
        setEnergySobriety(l >= A);
        setChargeShift(l >= B);
        setPVHeater(l >= C);
        setBattery(l >= D);
    };

const isActive =
    (exact: boolean) => (n: number) => {
        let score = 0x1;
        if (getEnergySobriety()) { score = score << 1; }
        if (getChargeShift()) { score = score << 1; }
        if (getPVHeater()) { score = score << 1; }
        if (getBattery()) { score = score << 1; }

        if (exact) {
            return n === score;
        }
        return n < score;
    };

const isUnderActive = isActive(false);
const isExactlyActive = isActive(true);


const ranks = {
    [NOPE]: 'zero',
    [A]: 'first',
    [B]: 'second',
    [C]: 'third',
    [D]: 'fourth',
};

const underActiveClass = (n: number) => isUnderActive(n) ? 'under-active' : '';
const exactActiveClass = (n: number) => isExactlyActive(n) ? 'active' : '';

const selectItem =
    (rank: number) =>
        DIV({
            className: `select-item ${ranks[rank]} ${underActiveClass(rank)} ${exactActiveClass(rank)}`,
            onClick: () => setLevel(rank),
        });

const selectWidget =
    () =>
        DIV({ className: 'adjust-item-widget autoproduction-select' },
            selectItem(NOPE),
            selectItem(A),
            selectItem(B),
            selectItem(C),
            selectItem(D),
        );

const legend =
    () =>
        DIV({ className: 'adjust-item-legend' },
            DIV({ className: 'reduce' + (getEnergySobriety() ? ' active' : '') }, tr('reduceConsumption')),
            DIV({ className: 'day' + (getChargeShift() ? ' active' : '') }, tr('dayConsumption')),
            DIV({ className: 'waterheating' + (getPVHeater() ? ' active' : '') }, tr('hotWaterDuringDay')),
            DIV({ className: 'battery' + (getBattery() ? ' active' : '') }, tr('installBatteries')),
        );


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '5. ' + tr('solAutoproduction')),
                DIV({ className: 'adjust-picto picto-solar-energy' })),
            note('pv_autonomy'),
            selectWidget(),
            legend(),
        );


logger('loaded');
