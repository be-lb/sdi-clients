import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import {
    getMaxPanelUnits,
    getMinPanelUnits,
    getOutput,
    getPanelUnits,
    PANEL_AREA,
} from '../../queries/simulation';
import { setInputF } from '../../events/simulation';

const getArea = () => getOutput('maxArea');// getNumInputF('pvArea');
const setArea = (n: number) => setInputF('pvArea')(n * PANEL_AREA);

type rank = number;
const areas = () => {
    // const ret: number[] = [];
    const min = getMinPanelUnits();
    const max = getMaxPanelUnits();
    const step = (max - min) / 9;

    return (new Array(9)).fill(0).map((_, i) => min + Math.floor(step * i));
};



// const inRange = (n: number) => {
//     const min = getArea() - 5;
//     const max = getArea() + 5;
//     return n > min && n <= max;
// };


type Status = 'under' | 'selected' | 'over' | 'unreachable';

const getStatus =
    (n: number): Status => {
        const pu = getPanelUnits();
        if (n < pu) {
            return 'under';
        }
        else if (n === pu) {
            return 'selected';
        }
        else if (n > getMaxPanelUnits()) {
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
            `1. ${tr('solDedicatedArea')}`));



export const calcArea =
    () =>
        DIV({ className: `adjust-item area current-${getArea()}` },
            title(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                `${getPanelUnits()}`,
            ),
        );
