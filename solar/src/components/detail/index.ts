import { DIV } from 'sdi/components/elements';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';

import { inputItem } from '../item-factory';

import { calcObstacle } from '../adjust-obstacle';
import { calcConsumption } from '../adjust-consumption';
import { calcAutoproduction } from '../adjust-autoproduction';
import { calcInstallation } from '../adjust-installation';
import { calcFinance } from '../adjust-finance';
import { calcLoan } from '../adjust-loan';



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
