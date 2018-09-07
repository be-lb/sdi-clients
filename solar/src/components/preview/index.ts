import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionSettings, actionContact, actionChange, actionPrint } from '../action';
import { summary } from '../summary/summary-pv';


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
            DIV({ className: 'upper-part' },
                context(),
                summary()),
            DIV({ className: 'lower-part' },
                DIV({ className: 'action-title' }, tr('solAndNow')),
                action(),
            ));


export default render;
