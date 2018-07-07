import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
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
            DIV({ className: 'action-settings' },
                H1({}, tr('personalize')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-contact' },
                H1({}, tr('contactInstallator')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-change' },
                H1({}, tr('changeMyHabits')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-print' },
                H1({}, tr('changeMyHabits')),
                DIV({ className: 'action-info' }, 'test')));



const render =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'top' },
                context(),
                summary()),
            DIV({ className: 'bottom' },
                DIV({ className: 'action-title' }, 'etmaintenant ?'),
                action(),
            ));


export default render;
