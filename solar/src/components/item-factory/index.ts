import { DIV, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';


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


export const toggle =
    (value1: MessageKey, value2: MessageKey) =>
        DIV({ className: 'toggle' },
            DIV({ className: 'value first-value' }, tr(value1) + ' '),
            DIV({ className: 'toggle-icon' }),
            DIV({ className: 'value second-value' }, ' ' + tr(value2)));


