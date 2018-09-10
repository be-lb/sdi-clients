import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withEuro } from 'sdi/util';

import { inputSelect } from '../item-factory';
import { getNumInputF, getOutputThermal } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const vatSelect = inputSelect(getNumInputF('VATrate'), setInputF('VATrate'));

const expenses =
    () =>
        DIV({ className: 'cost' },
            DIV({ className: 'vat-installation' },
                DIV({ className: 'wrapper-multi-checkbox' },
                    vatSelect('solVAT21', 0.21),
                    vatSelect('solVAT6', 0.06),
                    vatSelect('solVAT0', 0))),
        );


const costValue =
    () =>
        DIV({ className: 'cost-value' },
            SPAN({}, tr('installationPrice')),
            SPAN({}, ' : '),
            SPAN({}, withEuro(getOutputThermal('installationCost'))),
        );


export const calcFinanceThermalCost =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '4. ' + tr('solFinanceVAT')),
                DIV({ className: 'adjust-picto picto-spend' })),
            DIV({ className: 'adjust-item-widget' },
                expenses(),
                costValue()));




