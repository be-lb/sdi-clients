import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { getOutput, getOptimalArea } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';

const getArea = () => getOutput('maxArea');// getNumInputF('pvArea');

type rank = number;
const areas = () => {
    const ret: number[] = [];
    for (let i = getOptimalArea(); i >= 5; i -= 10) {
        ret.push(i);
    }
    return ret.reverse();
};



const inRange = (n: number) => {
    const min = getArea() - 5;
    const max = getArea() + 5;
    return n > min && n <= max;
};

const isActive =
    (a: number) => inRange(a);

const selectItem =
    (rank: rank) => {
        if (isActive(rank)) {
            return DIV({ className: `select-item  active` }, getArea().toFixed(0));
        }
        return DIV({
            className: `select-item ${rank}`,
            onClick: () => setInputF('pvArea')(rank),
        }, rank.toFixed(0));
    };

const selectWidget =
    () =>
        DIV({ className: 'area-select' },
            ...(areas().map(selectItem)),
        );

const title =
    () => DIV({ className: 'adjust-item-header' },
            DIV({ className: 'adjust-item-title' },
                `1. ${tr('solDedicatedArea')} (m2)`));



export const calcArea =
    () =>
        DIV({ className: `adjust-item area current-${getArea()}` },
            title(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
            ),
        );
