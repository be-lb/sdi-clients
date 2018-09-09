import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionSettings, actionContact, actionChange, actionPrint } from '../action';
import { summary } from '../summary/summary-pv';
import { getMaxPower } from '../../queries/simulation';
import { sumAdress } from '../summary/details-pv';


const action =
    () =>
        DIV({ className: 'actions' },
            actionSettings(),
            actionContact(),
            actionChange(),
            actionPrint());


const renderPreview =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'upper-part' },
                context(),
                summary()),
            DIV({ className: 'lower-part' },
                DIV({ className: 'action-title' }, tr('solAndNow')),
                action(),
            ));


const renderNoPreview =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'upper-part' },
                context(),
                DIV({ className: 'sol-no-sol' },
                    sumAdress(),
                    DIV({ className: 'sol-no-sol-msg' }, tr('solNoSol')),
                )),
            // DIV({ className: 'lower-part' },
            //     DIV({ className: 'action-title' }, tr('solAndNow')),
            //     action()),
        );


const render =
    () => {
        if (getMaxPower() >= 1) {
            return renderPreview();
        }
        return renderNoPreview();
    };


export default render;
