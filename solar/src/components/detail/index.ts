import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle } from '../item-factory';
import { context } from '../context';
import { summaryDetailed } from '../summary';


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
    calcConsumptionThermal,
    calcInstallationThermal,
    calcFinanceThermal,
    calcLoanThermal,
} from '../adjust';

import { getSystem } from '../../queries/simulation';
import { setSystem } from '../../events/simulation';


const toggleSystem = toggle(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));

const calculatorTitle =
    () =>
        DIV({ className: 'adjust-item calculator-header' },
            DIV({ className: 'calculator-title' },
                tr('solAdjustStr1'),
                ' ',
                tr('solAdjustStr2')),
            toggleSystem('solPhotovoltaic', 'solThermal'),
        );

const photovoltaicWidgets =
    () =>
        DIV({ className: 'calculator' },
            calculatorTitle(),
            calcArea(),
            calcObstacle(),
            calcConsumption(),
            calcInstallation(),
            calcAutoproduction(),
            calcFinance(),
            calcLoan());

const thermalWidgets =
    () =>
        DIV({ className: 'calculator' },
            calculatorTitle(),
            calcConsumptionThermal(),
            calcInstallationThermal(),
            calcFinanceThermal(),
            calcLoanThermal());


const adjustWidgets =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return photovoltaicWidgets();
            case 'thermal': return thermalWidgets();
        }
    };


const action =
    () =>
        DIV({ className: 'actions' },
            actionContact(),
            actionChange(),
            actionPrint());

const sidebar =
    () =>
        DIV({ className: 'sidebar' },
            summaryDetailed());


const content =
    () =>
        DIV({ className: 'content' },
            context(),
            adjustWidgets(),
            sidebar(),
            action());


const render =
    () =>
        DIV({ className: 'solar-main-and-right-sidebar' },
            content(),
        );

export default render;
