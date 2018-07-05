import { DIV, H1, H2, SPAN, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';


const inputItem =
    (label: MessageKey) => DIV({ className: 'input-box' },
        DIV({ className: 'input-label' }, tr(label)),
        INPUT({ type: 'number' }),
    );

const kv =
    (key: MessageKey) => DIV({ className: 'kv' },
        SPAN({ className: 'key' }, tr(key)),
        SPAN({ className: 'value' }, '$value'));


const calcObstacle =
    () =>
        DIV({ className: 'wrapper-obstacle' },
            H2({}, tr('installationObstacle')),
            'to be done !!');

const calcConsumption =
    () =>
        DIV({ className: 'wrapper-consumption' },
            H2({}, tr('consumption')),
            'to be done !!');

const calcAutoproduction =
    () =>
        DIV({ className: 'wrapper-autoproduction' },
            H2({}, tr('autoproduction')),
            'to be done !!');

const calcFinance =
    () =>
        DIV({ className: 'wrapper-finance' },
            H2({}, tr('finance')),
            'to be done !!');

const calcLoan =
    () =>
        DIV({ className: 'wrapper-loan' },
            H2({}, tr('loan')),
            'to be done !!');


const calculator =
    () =>
        DIV({ className: 'calculator' },
            H1({}, tr('personalize')),
            calcObstacle(),
            calcConsumption(),
            calcAutoproduction(),
            calcFinance(),
            calcLoan());





const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, '$streetName $streetNumber'),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ' $locality')));

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-3D' },
            DIV({ className: 'illu-3D' }, '3D'));

const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice10Y'),
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
            kv('gainElecInvoice10Y'),
            kv('gainTotal25Y'),
            kv('returnTime'));


const summary =
    () =>
        DIV({},
            sumAdress(),
            wrapper3D(),
            sumPotentialValues(),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



const render =
    () =>
        DIV({ className: 'custom-box' },
            calculator(),
            summary(),
        );

export default render;
