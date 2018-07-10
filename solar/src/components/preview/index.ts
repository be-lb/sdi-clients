import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionSettings, actionContact, actionChange, actionPrint } from '../action';
import { summary } from '../summary';



// const switchThermal =
//     () =>
//         DIV({ className: 'switch-thermal' },
//             DIV({}, tr('solarPV')),
//             DIV({ className: 'switch-icon' }),
//             DIV({}, tr('solarThermal')));





const action =
    () =>
        DIV({ className: 'actions' },
            actionSettings(),
            actionContact(),
            actionChange(),
            actionPrint());



const render =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'top' },
                context(),
                summary()),
            DIV({ className: 'bottom' },
                DIV({ className: 'action-title' }, tr('solAndNow')),
                action(),
            ));


export default render;
