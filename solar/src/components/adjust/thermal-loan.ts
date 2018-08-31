
import { DIV, SPAN, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle, vertInputItem } from '../item-factory/index';
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

export const calcLoanThermal =
    () =>
        DIV({ className: 'adjust-item loan' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '4. ' + tr('loan') + 'TO DO'),
                toggleLoan('loanYes', 'loanNo')),
            hasLoan() ? withLoan() : NODISPLAY());






