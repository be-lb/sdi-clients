import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withEuro } from 'sdi/util';

import { inputSelect } from '../item-factory';
import { getNumInputF, getOutputPv } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const vatSelect = inputSelect(getNumInputF('VATrate'), setInputF('VATrate'));

const expenses =
    () =>
        DIV({ className: 'cost' },
            // vertInputItem('installationPrice', 'installationPrice',
            //     SPAN({ className: 'unit' }, tr('unitEuro'))),
            DIV({ className: 'vat-installation' },
                DIV({ className: 'wrapper-multi-checkbox' },
                    vatSelect('solVAT21', 0.21),
                    vatSelect('solVAT6', 0.06),
                    vatSelect('solVAT0', 0)),
                // vatSelect('VATinstallation', getNumInputF('VATrate')()),
            ),
            DIV({ className: 'input-box-vertical' },
                DIV({ className: 'input-and-unit' }, SPAN({}, withEuro(getOutputPv('installationCost')))),
                DIV({ className: 'input-label' }, tr('installationPrice'))),
            // vertInputItem('annualMaintenance')
        );



export const calcFinanceCost =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '6. ' + tr('solFinanceVAT')),
                DIV({ className: 'adjust-picto picto-spend' })),
            DIV({ className: 'adjust-item-widget' },
                expenses()));




