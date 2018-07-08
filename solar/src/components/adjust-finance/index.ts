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
            DIV({ className: 'input-wrapper' },
                DIV({ className: 'input-label' }, tr('VAT')),
                DIV({ className: 'checkbox-list' },
                    checkBox('VAT21'),
                    checkBox('VAT6'),
                    checkBox('VAT0'))),
            inputItem('sellingGreenCertifPrice'),
        );



