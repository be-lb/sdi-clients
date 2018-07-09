import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox } from '../item-factory';


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-title' }, '3. ' + tr('autoproduction') + ' : '),
            checkBox('reduceConsumption'),
            checkBox('dayConsumption'),
            DIV({ className: 'wrapper-dble-checkbox' },
                DIV({ className: 'input-label' }, tr('hotWaterDuringDay') + ' : '),
                checkBox('boiler'),
                checkBox('heatPump')),
            checkBox('installBatteries'));





