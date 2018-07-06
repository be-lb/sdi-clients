import { DIV, H1, H2, SPAN, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';



const inputItem =
    (label: MessageKey) => DIV({ className: 'input-box' },
        DIV({ className: 'input-label' }, tr(label)),
        INPUT({ type: 'number' }),
    );

const checkBox =
    (label: MessageKey) => DIV({ className: 'wrapper-checkbox' }, DIV({ className: 'input-label' }, tr(label)),
        DIV({ className: 'checkbox' }, '$•'));

const kv =
    (key: MessageKey) => DIV({ className: 'kv' },
        SPAN({ className: 'key' }, tr(key)),
        SPAN({ className: 'value' }, '$value'));




const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper' },
            DIV({ className: 'illu' }, '$ortho'),
            DIV({ className: 'back-to-map' }, tr('backToMap')));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper' },
            DIV({ className: 'illu' }, '$plan'),
            DIV({ className: 'roof-area' },
                tr('roofTotalArea'),
                SPAN({}, '$m2')));

const wrapper3D =
    () =>
        DIV({ className: 'wrapper' },
            DIV({ className: 'illu' }, '$3D'));

const context =
    () =>
        DIV({ className: 'context' },
            wrapperOrtho(),
            wrapperPlan(),
            wrapper3D());




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





const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, '$streetName $streetNumber'),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ' $locality')));

const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice'),
            kv('gainEnvironment'));


const sumInstallation =
    () =>
        DIV({ className: 'sum-installation-wrapper' },
            H2({}, tr('installation')),
            kv('surface'),
            kv('power'),
            kv('obstacleEstimation'));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            kv('yearProduction'),
            kv('yearConsumption'),
            kv('solarAutonomy'));

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice'),
            kv('gainTotal25Y'),
            kv('returnTime'));


const summary =
    () =>
        DIV({ className: 'sidebar' },
            sumAdress(),
            sumPotentialValues(),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



const render =
    () =>
        DIV({ className: 'main-and-right-sidebar custom-box' },
            calculator(),
            summary(),
        );

export default render;
