import { DIV, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';



const inputItem =
    (label: MessageKey) => DIV({ className: 'input-box' },
        DIV({ className: 'input-label' }, tr(label)),
        INPUT({ type: 'number' }),
    );


export const calcConsumption =
    () =>
        DIV({ className: 'adjust-item consumption' },
            DIV({ className: 'adjust-item-title' }, '2. ' + tr('consumption') + ' : '),
            'to be done !!',
            inputItem('annualConsumptionKWh'));




