import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputItem } from '../item-factory';

const selectItem =
    (rank: string) => DIV({ className: 'select-item' + ' ' + rank });


const selectWidget =
    () =>
        DIV({ className: 'consumption-select' },
            selectItem('first'),
            selectItem('second'),
            selectItem('third'),
            selectItem('fourth'),
            selectItem('fifth'),
        );


export const calcConsumption =
    () =>
        DIV({ className: 'adjust-item consumption' },
            DIV({ className: 'adjust-item-title' }, '2. ' + tr('consumption') + ' : '),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                inputItem('annualConsumptionKWh')));




