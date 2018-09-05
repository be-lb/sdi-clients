import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withEuro } from 'sdi/util';

import { inputSelect } from '../item-factory';
import { getNumInputF, getOutput } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const vatSelect = inputSelect(getNumInputF('VATrate'), setInputF('VATrate'));

const expenses =
    () =>
        DIV({ className: 'cost' },
            // vertInputItem('installationPrice', 'installationPrice',
            //     SPAN({ className: 'unit' }, tr('unitEuro'))),
            DIV({ className: 'input-box-vertical' },
                DIV({ className: 'input-and-unit' }, SPAN({}, withEuro(getOutput('installationCost')))),
                DIV({ className: 'input-label' }, tr('installationPrice'))),
            DIV({ className: 'vat-installation' },
                DIV({ className: 'wrapper-multi-checkbox' },
                    vatSelect('VAT21', 0.21),
                    vatSelect('VAT6', 0.06),
                    vatSelect('VAT0', 0)),
                // vatSelect('VATinstallation', getNumInputF('VATrate')()),
                DIV({ className: 'multi-checkbox-label' }, tr('VATinstallation'))),
            // vertInputItem('annualMaintenance')
        );



export const calcFinanceCost =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '7. ' + tr('finance')),
                DIV({ className: 'adjust-picto spend' })),
            DIV({ className: 'adjust-item-widget' },
                expenses()));




