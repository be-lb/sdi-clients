import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle } from '../item-factory';


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-title' }, '4. ' + tr('solAutoproduction')),
            DIV({ className: 'adjust-picto-wrapper' },
                DIV({ className: 'adjust-picto reduce' }),
                DIV({}, tr('reduceConsumption') + ' : '),
                toggle('yes', 'no'),
            ),
            DIV({ className: 'adjust-picto-wrapper' },
                DIV({ className: 'adjust-picto day' }),
                DIV({}, tr('dayConsumption') + ' : '),
                toggle('yes', 'no'),
            ),
            DIV({ className: 'adjust-picto-wrapper' },
                DIV({ className: 'adjust-picto battery' }),
                DIV({}, tr('installBatteries') + ' : '),
                toggle('yes', 'no'),
            ));



// DIV({ className: 'adjust-picto-wrapper' },
//     DIV({ className: 'adjust-picto heat' }),
//     DIV({ className: 'wrapper-multi-checkbox' },
//         DIV({ className: 'multi-checkbox-label' }, tr('hotWaterDuringDay') + ' : '),
//         DIV({},
//             checkBox('boiler'),
//             checkBox('heatPump'))))




