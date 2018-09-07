import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { getLoading, streetName, streetNumber, locality } from '../../queries/simulation';



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
        return DIV();
    };


export default render;
