import { DIV } from 'sdi/components/elements';
import { inputNumber } from 'sdi/components/input';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { getNumInputF, GetNumKeyOfInputs } from '../../queries/simulation';
import { setInputF, SetNumKeyOfInputs } from '../../events/simulation';

// export const checkBox =
//     (label: MessageKey) =>
//         DIV({ className: 'wrapper-checkbox' },
//             DIV({ className: 'checkbox' }),
//             DIV({ className: 'checkbox-label' }, tr(label)));

export const inputSelect =
    <T>(get: () => T, set: (v: T) => void) =>
        (msg: MessageKey, v: T) => {
            if (get() === v) {
                return DIV({ className: 'wrapper-checkbox' },
                    DIV({ className: 'checkbox active' }),
                    DIV({ className: 'checkbox-label' }, tr(msg)));
            }
            return DIV({
                className: 'wrapper-checkbox',
                onClick: () => set(v),
            }, DIV({ className: 'checkbox' }),
                DIV({ className: 'checkbox-label' }, tr(msg)));
        };



export const vertInputItem =
    (label: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs, ...ns: React.ReactNode[]) => {
        const get = getNumInputF(k);
        const set = setInputF(k);
        const input = inputNumber(get, set);
        const tail: React.ReactNode[] = [];
        ns.forEach(n => tail.push(n));
        ns.push(DIV({ className: 'input-label' }, tr(label)));
        return DIV({ className: 'input-box-vertical' },
            input,
            tail);
    };

export const inputItem =
    (label: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs) => {
        const get = getNumInputF(k);
        const set = setInputF(k);
        const input = inputNumber(get, set);
        return DIV({ className: 'input-box' },
            DIV({ className: 'input-label' }, tr(label) + ' : '),
            input);
    };


export const toggle =
    (value1: MessageKey, value2: MessageKey) =>
        DIV({ className: 'toggle' },
            DIV({ className: 'value first-value' }, tr(value1) + ' '),
            DIV({ className: 'toggle-icon' }),
            DIV({ className: 'value second-value inactive' }, ' ' + tr(value2)));


