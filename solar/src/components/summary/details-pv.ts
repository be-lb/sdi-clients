import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withM2, withKWc, withKWhY, withYear, withTCO2Y } from 'sdi/util';

import { toggle } from '../item-factory';
import {
    getOutputPv,
    getPanelUnits,
    getSystem,
    locality,
    pvTechnologyLabel,
    streetName,
    streetNumber,
} from '../../queries/simulation';
import { clearInputs, setSystem } from '../../events/simulation';


const toggleSystem = toggle(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));


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
            vk(withM2(getOutputPv('maxArea')), 'surface'),
            vk(withKWc(getOutputPv('power'), 1), 'power'),
            vks(getPanelUnits(), `${tr('solPanels')} (${tr(pvTechnologyLabel())})`),
            // vk(withPercent(getOutputPv('obstacleRate') * 100), 'obstacleEstimation'),
            vk(withYear(25), 'solInstallationLifeTime'),
        );

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(withKWhY(getOutputPv('annualProduction')), 'yearProduction'),
            vk(withKWhY(getOutputPv('annualConsumption')), 'yearConsumption'),
            vk(withPercent(getOutputPv('autonomy') * 100), 'solarAutonomy'),
            vk(withTCO2Y(getOutputPv('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(withEuro(getOutputPv('installationCost')), 'buyingPrice'),
            vk(withEuro(getOutputPv('CVAmountYear25')), 'gainGreenCertif25Y'),
            vk(withEuro(getOutputPv('selfConsumptionAmountYear25')), 'gainElecInvoice25Y'),
            vk(withEuro(getOutputPv('totalGain25Y')), 'gainTotal25Y'),
            vk(withYear(getOutputPv('returnTime')), 'returnTime'));






export const summaryDetailedPhotovoltaic =
    () =>
        DIV({ className: 'summary-detailled' },
            sumAdress(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater'),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
            DIV({
                className: 'btn-reset',
                onClick: () => clearInputs(),
            }, tr('resetValue')),
        );




