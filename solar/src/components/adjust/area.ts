import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withKWc } from 'sdi/util';

import {
    getOutputPv,
    getPanelUnits,
    getMaxPower,
} from '../../queries/simulation';
import { setPower } from '../../events/simulation';


type rank = number;

const getPower = () => Math.round(getOutputPv('power'));

const powers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type Status = 'under' | 'selected' | 'selected-max' | 'over' | 'last-over' | 'unreachable';



const getStatus =
    (n: number): Status => {
        const p = getPower();
        const maxPower = Math.round(getMaxPower());
        if (n < p) {
            return 'under';
        }
        else if (n === p) {
            if (n === maxPower || n === 12) {
                return 'selected-max';
            }
            return 'selected';
        }
        else if (n > maxPower) {
            return 'unreachable';
        }
        else if (n === maxPower || n === 12) {
            return 'last-over';
        }
        return 'over';
    };

const hasOver =
    () => {
        return powers.filter(a => getStatus(a) === 'over' || getStatus(a) === 'last-over').length > 0;
    };

const hasUnreachable =
    () => {
        return powers.filter(a => getStatus(a) === 'unreachable').length > 0;
    };

const selectItemClickable =
    (rank: rank, className: string) =>
        DIV({
            title: withKWc(rank, 1),
            className: `select-item  ${className}`,
            onClick: () => setPower(rank),
        });

const selectItemNotClickable =
    (rank: rank, className: string) =>
        DIV({
            title: withKWc(rank, 1),
            className: `select-item  ${className}`,
        });

const selectItem =
    (rank: rank) => {
        switch (getStatus(rank)) {
            case 'under': return selectItemClickable(rank, 'under');
            case 'selected': return selectItemNotClickable(rank, 'selected');
            case 'selected-max': return selectItemNotClickable(rank, 'selected selected-max');
            case 'over': return selectItemClickable(rank, 'over');
            case 'last-over': return selectItemClickable(rank, 'last over');
            case 'unreachable': return selectItemNotClickable(rank, 'unreachable');
        }
    };

const selectWidget =
    () =>
        DIV({ className: 'adjust-item-widget area-select' },
            ...(powers.map(selectItem)),
        );

const title =
    () => DIV({ className: 'adjust-item-header' },
        DIV({ className: 'adjust-item-title' },
            `3. ${tr('solDedicatedArea')}`),
        DIV({ className: 'adjust-picto picto-panel' }));

const legend =
    () => {
        const elements = [
            DIV({ className: 'item-note selected' },
                `${getPanelUnits()} ${tr('solSelectedPannels')}`),
        ];

        if (hasOver()) {
            elements.push(
                DIV({ className: 'item-note over' },
                    tr('solOptimumInstallation')));
        }
        if (hasUnreachable()) {
            elements.push(
                DIV({ className: 'item-note unreachable' },
                    tr('solOptimumInstallationTheoric')));
        }

        return DIV({ className: 'adjust-item-note' }, ...elements);
    };

export const calcArea =
    () =>
        DIV({ className: `adjust-item area` },
            title(),
            selectWidget(),
            legend(),
        );
