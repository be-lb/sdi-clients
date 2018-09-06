import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withM2, withKWc, withKWhY, withYear, withTCO2Y } from 'sdi/util';

import { getOutput, streetName, streetNumber, locality } from '../../queries/simulation';
import { clearInputs } from '../../events/simulation';


const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));


const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, `${streetName()} ${streetNumber()}`),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ` ${locality()}`)));


const sumInstallation =
    () =>
        DIV({ className: 'sum-installation-wrapper' },
            H2({}, tr('installation')),
            vk(withM2(getOutput('maxArea')), 'surface'),
            vk(withKWc(getOutput('power'), 1), 'power'),
            vk(withPercent(getOutput('obstacleRate') * 100), 'obstacleEstimation'));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(withKWhY(getOutput('annualProduction')), 'yearProduction'),
            vk(withKWhY(getOutput('annualConsumption')), 'yearConsumption'),
            vk(withPercent(getOutput('autonomy') * 100), 'solarAutonomy'),
            vk(withTCO2Y(getOutput('savedCO2emissions') / 1000), 'gainEnvironment', 'gain-env'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(withEuro(getOutput('installationCost')), 'buyingPrice'),
            vk(withEuro(getOutput('CVAmountYearN')), 'gainGreenCertif'),
            vk(withEuro(getOutput('selfConsumptionAmountYearN')), 'gainElecInvoice'),
            vk(withEuro(getOutput('totalGain25Y')), 'gainTotal'),
            vk(withYear(getOutput('returnTime')), 'returnTime'));






export const summaryDetailedPhotovoltaic =
    () =>
        DIV({ className: 'summary-detailled' },
            sumAdress(),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
            DIV({
                className: 'btn-reset',
                onClick: () => clearInputs(),
            }, tr('resetValue')),
        );




