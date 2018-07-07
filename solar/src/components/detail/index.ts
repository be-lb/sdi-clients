import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';

import { calcObstacle } from '../adjust-obstacle'
import { calcConsumption } from '../adjust-consumption'
import { calcAutoproduction } from '../adjust-autoproduction'
import { calcInstallation } from '../adjust-installation'
import { calcFinance } from '../adjust-finance'
import { calcLoan } from '../adjust-loan'


const calculator =
    () =>
        DIV({ className: 'calculator' },
            context(),
            H1({}, tr('personalize')),
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
            calculator(),
            sidebar(),
        );

export default render;
