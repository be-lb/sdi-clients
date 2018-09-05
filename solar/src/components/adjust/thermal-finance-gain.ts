import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { vertInputItem } from '../item-factory';


const gains =
    () =>
        DIV({ className: 'gain' },
            vertInputItem('bonus', 'elecSellingPrice',
                SPAN({ className: 'unit' }, tr('unitEuro'))));
// default should be 2500€



export const calcFinanceThermalGain =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '3. ' + tr('finance')),
                DIV({ className: 'adjust-picto gain' })),
            DIV({ className: 'adjust-item-widget' },
                gains()));




