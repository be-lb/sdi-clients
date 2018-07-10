import { DIV, INPUT } from 'sdi/components/elements';
import { inputNumber } from 'sdi/components/input';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { getNumInputF, GetNumKeyOfInputs } from '../../queries/simulation'
import { setNumInputF, SetNumKeyOfInputs } from '../../events/simulation'

export const checkBox =
    (label: MessageKey) =>
        DIV({ className: 'wrapper-checkbox' },
            DIV({ className: 'checkbox' }),
            DIV({ className: 'checkbox-label' }, tr(label)));


export const inputItem =
    (label: MessageKey) =>
        DIV({ className: 'input-box' },
            DIV({ className: 'input-label' }, tr(label) + ' : '),
            INPUT({ type: 'number' }));


export const vertInputItem =
    (label: MessageKey) =>
        DIV({ className: 'input-box-vertical' },
            INPUT({ type: 'number' }),
            DIV({ className: 'input-label' }, tr(label)));


export const inputItem2 =
    (label: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs) => {
        const get = getNumInputF(k)
        const set = setNumInputF(k)
        const input = inputNumber(get, set)
        DIV({ className: 'input-box' },
            DIV({ className: 'input-label' }, tr(label) + ' : '),
            input);
    }


export const toggle =
    (value1: MessageKey, value2: MessageKey) =>
        DIV({ className: 'toggle' },
            DIV({ className: 'value first-value inactive' }, tr(value1) + ' '),
            DIV({ className: 'toggle-icon' }),
            DIV({ className: 'value second-value' }, ' ' + tr(value2)));


