import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputItem } from '../item-factory';


export const calcLoan =
    () =>
        DIV({ className: 'adjust-item loan' },
            DIV({ className: 'adjust-item-title' }, '6. ' + tr('loan')),
            inputItem('monthlyPayment'),
            inputItem('durationYear'),
            inputItem('amountBorrowed'),
        );






