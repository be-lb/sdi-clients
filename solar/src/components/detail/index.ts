import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';


import {
    actionContact,
    actionChange,
    actionPrint,
} from '../action';

import {
    calcArea,
    calcAutoproduction,
    calcConsumption,
    calcFinance,
    calcInstallation,
    calcLoan,
    calcObstacle,
} from '../adjust';



const calculatorTitle =
    () =>
        DIV({ className: 'adjust-item calculator-header' },
            DIV({ className: 'calculator-title' },
                    tr('solAdjustStr1'),
                    ' ',
                    tr('solAdjustStr2')),
            
        );

const action =
    () =>
        DIV({ className: 'actions' },
            actionContact(),
            actionChange(),
            actionPrint());

const content =
    () =>
        DIV({ className: 'content' },
            context(),
            DIV({ className: 'calculator' },
                calculatorTitle(),
                calcArea(),
                calcObstacle(),
                calcConsumption(),
                calcInstallation(),
                calcAutoproduction(),
                calcFinance(),
                calcLoan()),
            action());


const sidebar =
    () =>
        DIV({ className: 'sidebar' },
            summary(),
            summaryDetailed());


const render =
    () =>
        DIV({ className: 'solar-main-and-right-sidebar' },
            content(),
            sidebar(),
        );

export default render;
