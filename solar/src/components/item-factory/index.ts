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
    (labelKey: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs, ...ns: React.ReactNode[]) => {
        const get = getNumInputF(k);
        const set = setInputF(k);
        const input = inputNumber(get, set);
        const label = DIV({ className: 'input-label' }, tr(labelKey));

        return DIV({ className: 'input-box-vertical' },
            DIV({ className: 'input-and-unit' },
                input, ...ns),
            label);
    };

export const inputItem =
    (labelKey: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs, ...ns: React.ReactNode[]) => {
        const get = getNumInputF(k);
        const set = setInputF(k);
        const input = inputNumber(get, set);
        const label = DIV({ className: 'input-label' }, tr(labelKey));

        return DIV({ className: 'input-box' },
            label, input, ...ns);
    };


const activeClass = (a: boolean) => a ? '' /* 'active' hits a greeny CSS rule */ : 'inactive';

export const toggle =
    (get: () => boolean, set: (a: boolean) => void) =>
        (value1: MessageKey, value2: MessageKey) =>
            DIV({
                className: 'toggle',
                onClick: () => set(!get()),
            },
                DIV({ className: `value first-value ${activeClass(get())}` }, tr(value1) + ' '),
                DIV({ className: `value second-value ${activeClass(!get())}` }, ' ' + tr(value2)));


