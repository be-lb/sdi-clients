import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox } from '../item-factory';


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-title' }, '3. ' + tr('autoproduction') + ' : '),
            checkBox('reduceConsumption'),
            checkBox('dayConsumption'),
            DIV({ className: 'wrapper-checkbox' },
                DIV({ className: 'input-label' }, tr('hotWaterDuringDay')),
                DIV({ className: 'double-checkBox' },
                    checkBox('boiler'),
                    checkBox('heatPump'))),
            checkBox('installBatteries'));





