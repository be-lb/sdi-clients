import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionSettings, actionContact, actionChange, actionPrint } from '../action';
import { summary } from '../summary/summary-pv';
import { getLoading, streetName, streetNumber, locality } from '../../queries/simulation';


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
            return DIV({ className: 'main-loader' },
                DIV({ className: 'loader-part' },
                    H1({},
                        SPAN({}, `${streetName()} ${streetNumber()} `),
                        SPAN({}, tr('in')),
                        SPAN({}, ` ${locality()}`)),
                    context(),
                    DIV({ className: 'loading-msg' }, `${tr('loadingData')} ${l.loaded}/${l.total}`)));
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
