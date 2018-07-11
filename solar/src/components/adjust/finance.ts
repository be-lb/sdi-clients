import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { vertInputItem } from '../item-factory';


export const calcFinance =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-title' }, '5. ' + tr('finance')),
            DIV({ className: 'cost' },
                DIV({ className: 'adjust-picto spend' }),
                vertInputItem('installationPrice', 'installationPrice', SPAN({ className: 'unit' }, tr('unitEuro'))),
                DIV({ className: 'vat-installation' },
                    // DIV({ className: 'wrapper-multi-checkbox' },
                    //     checkBox('VAT21'),
                    //     checkBox('VAT6'),
                    //     checkBox('VAT0')),
                    DIV({ className: 'multi-checkbox-label' }, tr('VATinstallation'))),
                // vertInputItem('annualMaintenance')
            ),
            DIV({ className: 'gain' },
                DIV({ className: 'adjust-picto gain' }),
                vertInputItem('sellingPrice', 'elecSellingPrice', SPAN({ className: 'unit' }, tr('unitEuro'))),
                vertInputItem('sellingGreenCertifPrice', 'CVPrice', SPAN({ className: 'unit' }, tr('unitEuro')))));




