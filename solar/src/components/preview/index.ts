import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionSettings, actionContact, actionChange, actionPrint } from '../action';
import { summary } from '../summary';
import { getLoading } from '../../queries/simulation';



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
    () => {
        const l = getLoading();
        if (l.loading) {
            return DIV({ className: 'main-splitted-height' },
                DIV({ className: 'upper-part' }, context()),
                DIV({ className: 'lower-part' }, `${tr('loadingData')} ${l.loaded}/${l.total}`,
                ));
        }
        return DIV({ className: 'main-splitted-height' },
            DIV({ className: 'upper-part' },
                context(),
                summary()),
            DIV({ className: 'lower-part' },
                DIV({ className: 'action-title' }, tr('solAndNow')),
                action(),
            ));
    };


export default render;
