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

type rank = number;
const areas = () => {
    // const ret: number[] = [];
    const min = getMinPanelUnits();
    const max = getMaxPanelUnits();
    const step = (max - min) / 9;

    return (new Array(9)).fill(0).map((_, i) => min + Math.floor(step * i));
};



const selectedPanelUnits =
    (n: number) =>
        areas().map(a => [a, Math.abs(n - a)]).reduce((acc, v) => v[1] < acc[1] ? v : acc)[0];


type Status = 'under' | 'selected' | 'over' | 'unreachable';

const getStatus =
    (n: number): Status => {
        const pu = selectedPanelUnits(getPanelUnits());
        if (n < pu) {
            return 'under';
        }
        else if (n === pu) {
            return 'selected';
        }
        else if (n > getOptimalPanelUnits()) {
            return 'unreachable';
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
