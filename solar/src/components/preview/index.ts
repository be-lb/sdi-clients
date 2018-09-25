import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionContact, actionChange, actionPrint, actionInfo } from '../action';
import { summary as summaryPv } from '../summary/summary-pv';
import { summary as summaryThermal } from '../summary/summary-thermal';
import { getMaxPower, getSystem } from '../../queries/simulation';
import { sumAdress } from '../summary/details-pv';
import { navigateDetail } from '../../events/route';
import { getCapakey } from '../../queries/app';

const action =
    () =>
        DIV({ className: 'actions' },
            actionContact(),
            actionChange(),
            actionInfo(),
            actionPrint());


const summary =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return summaryPv();
            case 'thermal': return summaryThermal();
        }
    };

const goToSettings =
    () => DIV({
        className: 'solar-btn',
        onClick: () => getCapakey().map(navigateDetail),
    },
        DIV({ className: 'solar-inner-btn' },
            tr('solAdjustStr1'),
            ' ',
            tr('solAdjustStr2')),
    );


const renderPreview =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'upper-part' },
                context(),
                summary()),
            DIV({ className: 'lower-part' },
                DIV({ className: 'action-header' },
                    DIV({ className: 'action-title' }, tr('solAndNow')),
                    goToSettings(),
                ),
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
