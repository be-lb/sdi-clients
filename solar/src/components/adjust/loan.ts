
import { DIV, SPAN, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle, vertInputItem } from '../item-factory';
import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const hasLoan = getInputF('loan');
const toggleLoan = toggle(hasLoan, setInputF('loan'));

const withLoan =
    () =>
        DIV({ className: 'inputs' },
            // vertInputItem('amountBorrowed'),
            vertInputItem('loanDuration', 'loanPeriod', SPAN({ className: 'unit' }, tr('unitYear'))),
            vertInputItem('loanRate', 'loanRate', SPAN({ className: 'unit' }, tr('unitPercent'))),
        );

export const calcLoan =
    () =>
        DIV({ className: 'adjust-item loan' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '7. ' + tr('loan')),
                toggleLoan('loanYes', 'loanNo')),
            hasLoan() ? withLoan() : NODISPLAY());






