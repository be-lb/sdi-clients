import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { summaryDetailed } from '../summary';


import {
    actionContact,
    actionChange,
    actionInfo,
    actionPrint,
} from '../action';

import {
    calcArea,
    calcAutoproduction,
    calcConsumption,
    calcFinanceCost,
    calcTechnology,
    calcLoan,
    calcObstacle,
    calcConsumptionThermal,
    calcTechnologyThermal,
    calcFinanceThermalGain,
    calcFinanceThermalCost,
    calcLoanThermal,
} from '../adjust';

import { getSystem } from '../../queries/simulation';


const calculatorTitle =
    () =>
        DIV({ className: 'adjust-item calculator-header' },
            DIV({ className: 'calculator-title' },
                tr('solAdjustStr1'),
                ' ',
                tr('solAdjustStr2')),
        );

const photovoltaicWidgets =
    () =>
        DIV({ className: 'calculator' },
            calculatorTitle(),
            calcObstacle(),
            calcTechnology(),
            calcArea(),
            calcConsumption(),
            calcAutoproduction(),
            calcFinanceCost(),
            calcLoan());

const thermalWidgets =
    () =>
        DIV({ className: 'calculator' },
            calculatorTitle(),
            calcTechnologyThermal(),
            calcConsumptionThermal(),
            calcFinanceThermalGain(),
            calcFinanceThermalCost(),
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
            actionInfo(),
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
