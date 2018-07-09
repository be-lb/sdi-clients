import { DIV } from 'sdi/components/elements';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';

import { inputItem } from '../item-factory';

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
            inputItem('usableArea'),
        );

const content =
    () =>
        DIV({ className: 'content calculator' },
            context(),
            calculatorTitle(),
            calcObstacle(),
            calcConsumption(),
            calcAutoproduction(),
            calcInstallation(),
            calcFinance(),
            calcLoan());


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
