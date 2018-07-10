import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

// import { vertInputItem } from '../item-factory';


export const calcLoan =
    () =>
        DIV({ className: 'adjust-item loan' },
            DIV({ className: 'adjust-item-title' }, '6. ' + tr('loan')),
            DIV({ className: 'inputs' },
                // vertInputItem('amountBorrowed'),
                // vertInputItem('durationYear'),
                // vertInputItem('monthlyPayment')
            ));






