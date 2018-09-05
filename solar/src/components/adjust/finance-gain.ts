import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { vertInputItem } from '../item-factory';

const gains =
    () =>
        DIV({ className: 'gain' },
            vertInputItem('sellingPrice', 'elecSellingPrice',
                SPAN({ className: 'unit' }, tr('unitEuroKWh'))),
            vertInputItem('sellingGreenCertifPrice', 'CVPrice',
                SPAN({ className: 'unit' }, tr('unitEuro'))));


export const calcFinanceGain =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '6. ' + tr('solFinanceGain')),
                DIV({ className: 'adjust-picto picto-gain' })),
            DIV({ className: 'adjust-item-widget' },
                gains()));




