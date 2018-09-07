import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import {
    getMaxPanelUnits,
    getMinPanelUnits,
    getOutputPv,
    getPanelUnits,
    PANEL_AREA,
    getOptimalPanelUnits,
} from '../../queries/simulation';
import { setInputF } from '../../events/simulation';

const getArea = () => getOutputPv('maxArea');// getNumInputF('pvArea');
const setArea = (n: number) => setInputF('pvArea')(n * PANEL_AREA);

const getStep =
    () => (getMaxPanelUnits() - getMinPanelUnits()) / 12;

type rank = number;
const areas = () => {
    const step = getStep();
    return (new Array(12)).fill(0).map((_, i) => getMinPanelUnits() + Math.floor(step * i));
};


const comparePanelNumber =
    (n1: number, n2: number) => Math.abs(n1 - n2) < getStep();




type Status = 'under' | 'selected' | 'over' | 'last-over' | 'unreachable';

const getStatus =
    (n: number): Status => {
        const pu = getPanelUnits();
        const ars = areas();
        if (n < pu) {
            return 'under';
        }
        else if (comparePanelNumber(n, pu)) {
            return 'selected';
        }
        else if (n > getOptimalPanelUnits()) {
            return 'unreachable';
        }
        else if (comparePanelNumber(n, getOptimalPanelUnits())
            || comparePanelNumber(n, ars[ars.length - 1])) {
            return 'last-over';
        }
        return 'over';


    };

const selectItem =
    (rank: rank) => {
        switch (getStatus(rank)) {
            case 'under': return DIV({
                className: `select-item  under`,
                onClick: () => setArea(rank),
            });
            case 'selected': return DIV({
                className: `select-item  selected`,
            });
            case 'over': return DIV({
                className: `select-item  over`,
                onClick: () => setArea(rank),
            });
            case 'last-over': return DIV({
                className: `select-item  last over`,
                onClick: () => setArea(rank),
            });
            case 'unreachable': return DIV({
                className: `select-item  unreachable`,
            });
        }
    };

const selectWidget =
    () =>
        DIV({ className: 'area-select' },
            ...(areas().map(selectItem)),
        );

const title =
    () => DIV({ className: 'adjust-item-header' },
        DIV({ className: 'adjust-item-title' },
            `3. ${tr('solDedicatedArea')}`));



export const calcArea =
    () =>
        DIV({ className: `adjust-item area current-${getArea()}` },
            title(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                `${getPanelUnits()}`,
            ),
        );
