import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox, inputItem } from '../item-factory';


export const calcFinance =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-title' }, '5. ' + tr('finance') + ' : '),
            inputItem('annualMaintenance'),
            inputItem('sellingPrice'),
            inputItem('installationPrice'),
            DIV({ className: 'vat-wrapper' },
                DIV({ className: 'input-label' }, tr('VAT') + ' : '),
                checkBox('VAT21'),
                checkBox('VAT6'),
                checkBox('VAT0')),
            inputItem('sellingGreenCertifPrice'),
        );



