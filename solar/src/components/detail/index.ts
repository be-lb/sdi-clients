import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { summaryDetailed } from '../summary';
import { disclaimer, beContact, contactLinks } from '../footer-infos';



import {
    actionContact,
    actionChange,
    actionInfo,
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
import { setSystem } from '../../events/simulation';

import { toggle } from '../item-factory';

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
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater'),
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
        );

const contentFooter =
    () =>
        DIV({ className: 'footer-infos' },
            contactLinks(),
            disclaimer(),
            beContact(),
        );



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
            action(),
            contentFooter());


const render =
    () =>
        DIV({ className: 'solar-main-and-right-sidebar' },
            content(),
        );

export default render;
