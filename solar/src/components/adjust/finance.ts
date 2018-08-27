import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withEuro } from 'sdi/util';

import { vertInputItem, inputSelect } from '../item-factory';
import { getNumInputF, getOutput } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const vatSelect = inputSelect(getNumInputF('VATrate'), setInputF('VATrate'));

const expenses =
    () =>
        DIV({ className: 'cost' },
            DIV({ className: 'adjust-picto spend' }),
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

const gains =
    () =>
        DIV({ className: 'gain' },
            DIV({ className: 'adjust-picto gain' }),
            vertInputItem('sellingPrice', 'elecSellingPrice',
                SPAN({ className: 'unit' }, tr('unitEuro'))),
            vertInputItem('sellingGreenCertifPrice', 'CVPrice',
                SPAN({ className: 'unit' }, tr('unitEuro'))));


export const calcFinance =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-title' }, '6. ' + tr('finance')),
            expenses(),
            gains());




