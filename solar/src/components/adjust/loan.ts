
import { DIV, SPAN, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle, vertInputItem, vertInputItemFn } from '../item-factory';
import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { note } from './note';


const hasLoan = getInputF('loan');
const toggleLoan = toggle(hasLoan, setInputF('loan'));
const getLoanPeriod = getInputF('loanPeriod');

const withLoan =
    () =>
        DIV({ className: 'inputs' },
            // vertInputItem('amountBorrowed'),
            vertInputItem(
                'loanDuration', 'loanPeriod',
                { min: 1, max: 99, step: 1 },
                SPAN({ className: 'unit' }, tr('unitYear', { value: getLoanPeriod() }))),
            vertInputItemFn(
                'loanRate',
                () => getInputF('loanRate')() * 100,
                (r) => {
                    if (r > 0) {
                        setInputF('loanRate')(r / 100);
                    }
                },
                { min: 0.1, max: 99, step: 0.1 },
                SPAN({ className: 'unit' }, tr('unitPercent'))),
        );

export const calcLoan =
    () =>
        DIV({ className: 'adjust-item loan' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '7. ' + tr('loan')),
                DIV({ className: 'adjust-picto picto-loan' })),
            note('pv_loan'),
            DIV({ className: 'adjust-item-widget' },
                toggleLoan('loanYes', 'loanNo'),
                hasLoan() ? withLoan() : NODISPLAY()));






