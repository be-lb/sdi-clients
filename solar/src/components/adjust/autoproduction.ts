import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const getEnergySobriety = getInputF('energySobriety');
const getChargeShift = getInputF('chargeShift');
const getPVHeater = getInputF('pvHeater');
const getBattery = getInputF('battery');

const setEnergySobriety = setInputF('energySobriety');
const setChargeShift = setInputF('chargeShift');
const setPVHeater = setInputF('pvHeater');
const setBattery = setInputF('battery');

const NOPE = 0;
const A = 0x2;
const B = A << 1;
const C = B << 1;
const D = C << 1;

// const getLevel =
//     () => {
//         if (getBattery()) { return D; }
//         if (getPVHeater()) { return C; }
//         if (getChargeShift()) { return B; }
//         if (getEnergySobriety()) { return A; }
//         return 0;
//     };

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

const pictoCollection =
    () =>
        DIV({ className: 'picto-collection' },
            DIV({ className: 'reduce' + (getEnergySobriety() ? ' active' : '') }),
            DIV({ className: 'day' + (getChargeShift() ? ' active' : '') }),
            DIV({ className: 'waterheating' + (getPVHeater() ? ' active' : '') }),
            DIV({ className: 'battery' + (getBattery() ? ' active' : '') }),
        );

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
        DIV({ className: 'autoproduction-select' },
            selectItem(NOPE),
            selectItem(A),
            selectItem(B),
            selectItem(C),
            selectItem(D),
        );


const notes =
    () =>
        DIV({ className: 'adjust-item-note' },
            DIV({ className: 'reduce' + (getEnergySobriety() ? ' active' : '') }, tr('reduceConsumption')),
            DIV({ className: 'day' + (getChargeShift() ? ' active' : '') }, tr('dayConsumption')),
            DIV({ className: 'day' + (getPVHeater() ? ' active' : '') }, tr('hotWaterDuringDay')),
            DIV({ className: 'battery' + (getBattery() ? ' active' : '') }, tr('installBatteries')),
        );


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '5. ' + tr('solAutoproduction')),
                pictoCollection()),
            DIV({ className: 'adjust-item-widget' },
                selectWidget()),
            notes(),
        );



