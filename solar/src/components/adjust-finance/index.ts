import { DIV, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';



const inputItem =
    (label: MessageKey) => DIV({ className: 'input-box' },
        DIV({ className: 'input-label' }, tr(label)),
        INPUT({ type: 'number' }),
    );

const checkBox =
    (label: MessageKey) => DIV({ className: 'wrapper-checkbox' }, DIV({ className: 'input-label' }, tr(label)),
        DIV({ className: 'checkbox' }, '$•'));




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



