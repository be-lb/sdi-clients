import { DIV, H1, H2, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { context } from '../context';
import { summary, summaryDetailed } from '../summary';



const inputItem =
    (label: MessageKey) => DIV({ className: 'input-box' },
        DIV({ className: 'input-label' }, tr(label)),
        INPUT({ type: 'number' }),
    );

const checkBox =
    (label: MessageKey) => DIV({ className: 'wrapper-checkbox' }, DIV({ className: 'input-label' }, tr(label)),
        DIV({ className: 'checkbox' }, '$•'));






const calcObstacle =
    () =>
        DIV({ className: 'wrapper-obstacle' },
            H2({}, tr('installationObstacle')),
            'to be done !!');

const calcConsumption =
    () =>
        DIV({ className: 'wrapper-consumption' },
            H2({}, tr('consumption')),
            'to be done !!',
            inputItem('annualConsumptionKWh'));

const calcAutoproduction =
    () =>
        DIV({ className: 'wrapper-autoproduction' },
            H2({}, tr('autoproduction')),
            checkBox('reduceConsumption'),
            checkBox('dayConsumption'),
            DIV({ className: 'wrapper-checkbox' },
                DIV({ className: 'input-label' }, tr('hotWaterDuringDay')),
                DIV({ className: 'double-checkBox' },
                    checkBox('boiler'),
                    checkBox('heatPump'))),
            checkBox('installBatteries'));

const calcInstallation =
    () =>
        DIV({ className: 'wrapper-installation' },
            H2({}, tr('installation')),
            DIV({ className: 'input-wrapper' },
                DIV({ className: 'input-label' }, tr('technoType')),
                DIV({ className: 'checkbox-list' },
                    checkBox('monocristal'),
                    checkBox('polycristal'),
                    checkBox('monocristalHR'))),
            checkBox('panelIntegration'));

const calcFinance =
    () =>
        DIV({ className: 'wrapper-finance' },
            H2({}, tr('finance')),
            inputItem('annualMaintenance'),
            inputItem('sellingPrice'),
            inputItem('installationPrice'),
            DIV({ className: 'input-wrapper' },
                DIV({ className: 'input-label' }, tr('VAT')),
                DIV({ className: 'checkbox-list' },
                    checkBox('VAT21'),
                    checkBox('VAT6'),
                    checkBox('VAT0'))),
            inputItem('sellingGreenCertifPrice'),
        );

const calcLoan =
    () =>
        DIV({ className: 'wrapper-loan' },
            H2({}, tr('loan')),
            inputItem('monthlyPayment'),
            inputItem('durationYear'),
            inputItem('amountBorrowed'),
        );


const calculator =
    () =>
        DIV({ className: 'calculator' },
            H1({}, tr('personalize')),
            context(),
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
        DIV({ className: 'main-and-right-sidebar custom-box' },
            calculator(),
            sidebar(),
        );

export default render;
