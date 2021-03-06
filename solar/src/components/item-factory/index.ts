import { DIV, H1 } from 'sdi/components/elements';
import { inputNumber, Getter, Setter, AllAttributes } from 'sdi/components/input';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import {
    getNumInputF,
    GetNumKeyOfInputs,
    streetName,
    streetNumber,
    locality,
} from '../../queries/simulation';

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


const inputK =
    (k: GetNumKeyOfInputs | SetNumKeyOfInputs, attrs: AllAttributes) => {
        const get = getNumInputF(k);
        const set = setInputF(k);
        return inputNumber(get, set, attrs);
    };

const label =
    (labelKey: MessageKey) => DIV({ className: 'input-label' }, tr(labelKey));

export const vertInputItemFn =
    (
        labelKey: MessageKey,
        get: Getter<number>,
        set: Setter<number>,
        attrs: AllAttributes,
        ...ns: React.ReactNode[]) =>
        DIV({ className: 'input-box-vertical' },
            DIV({ className: 'input-and-unit' },
                inputNumber(get, set, attrs), ...ns),
            label(labelKey));

export const vertInputItem =
    (labelKey: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs, attrs: AllAttributes, ...ns: React.ReactNode[]) =>
        DIV({ className: 'input-box-vertical' },
            DIV({ className: 'input-and-unit' },
                inputK(k, attrs), ...ns),
            label(labelKey));


export const inputItem =
    (labelKey: MessageKey, k: GetNumKeyOfInputs | SetNumKeyOfInputs, attrs: AllAttributes, ...ns: React.ReactNode[]) =>
        DIV({ className: 'input-box' },
            inputK(k, attrs), ...ns, label(labelKey));



const activeClass = (a: boolean) => a ? '' /* 'active' hits a greeny CSS rule */ : 'inactive';

export const toggle =
    (get: () => boolean, set: (a: boolean) => void) =>
        (value1: MessageKey, value2: MessageKey) =>
            DIV({
                className: 'toggle',
                onClick: () => set(!get()),
            },
                DIV({ className: `value first-value ${activeClass(get())}` }, tr(value1) + ' '),
                DIV({ className: `value second-value ${activeClass(!get())}` }, ' ' + tr(value2)),
            );

export const toggleWithInfo =
    (get: () => boolean, set: (a: boolean) => void) =>
        (value1: MessageKey, value2: MessageKey, info1: MessageKey, info2: MessageKey) =>
            DIV({ className: 'toggle-wrapper' },
                DIV({
                    className: 'toggle',
                    onClick: () => set(!get()),
                },
                    DIV({ className: `value first-value ${activeClass(get())}` }, tr(value1) + ' '),
                    DIV({ className: `value second-value ${activeClass(!get())}` }, ' ' + tr(value2)),
                ),
                DIV({ className: 'toggle-infos' },
                    DIV({ className: `info first-value ${activeClass(get())}` }, tr(info1)),
                    DIV({ className: `info first-value ${activeClass(!get())}` }, tr(info2)),
                ),
            );



export const buildingAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, `${streetName()} ${streetNumber()} ${tr('in')} ${locality()}`),
        );
