import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withEuroInclVAT, withM2, withKWc, withKWhY, withYear, withTCO2Y } from 'sdi/util';

import {
    getPanelUnits,
    locality,
    pvTechnologyLabel,
    streetName,
    streetNumber,
    getAnimatedValuePv,
} from '../../queries/simulation';

import { clearInputs } from '../../events/simulation';

import {
    actionPrint,
} from '../action';



const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));

const vks =
    <T>(v: T, key: string, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, key));


export const sumAdress =
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
            vk(withM2(getAnimatedValuePv('maxArea')), 'surface'),
            vk(withKWc(getAnimatedValuePv('power'), 1), 'power'),
            vks(getPanelUnits(), `${tr('solPanels')} (${tr(pvTechnologyLabel())})`),
            // vk(withPercent(getOutputPv('obstacleRate') * 100), 'obstacleEstimation'),
            // vk(withYear(25), 'solInstallationLifeTime'),
        );

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(withKWhY(getAnimatedValuePv('annualProduction')), 'yearProduction'),
            vk(withKWhY(getAnimatedValuePv('annualConsumption')), 'yearConsumption'),
            vk(withPercent(getAnimatedValuePv('autonomy') * 100), 'solarAutonomy'),
            vk(withTCO2Y(getAnimatedValuePv('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(withEuroInclVAT(getAnimatedValuePv('installationCost')), 'buyingPrice'),
            vk(withEuro(getAnimatedValuePv('CVAmountYear25')), 'gainGreenCertif25Y'),
            vk(withEuro(getAnimatedValuePv('selfConsumptionAmountYear25')), 'gainElecInvoice25Y'),
            vk(withEuro(getAnimatedValuePv('totalGain25Y')), 'gainTotal25Y'),
            vk(withYear(getAnimatedValuePv('returnTime')), 'returnTime'));






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
            actionPrint(),
        );




