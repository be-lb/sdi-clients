import { DIV } from 'sdi/components/elements';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';

import { inputItem } from '../item-factory';

import {
    actionContact,
    actionChange,
    actionPrint,
} from '../action';

import {
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
            DIV({ className: 'calculator-title' }, 'Ajusteur'),
            inputItem('usableArea', 'pvArea'),
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
                calcObstacle(),
                calcConsumption(),
                calcAutoproduction(),
                calcInstallation(),
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
        DIV({ className: 'main-and-right-sidebar' },
            content(),
            sidebar(),
        );

export default render;
