import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withLiter, withM2, withKWhY, withPercent, withTCO2Y, withYear } from 'sdi/util';

import { toggle } from '../item-factory';

import {
    getSystem,
    streetName,
    streetNumber,
    locality,
    getOutputThermal,
} from '../../queries/simulation';
import { setSystem, clearInputs } from '../../events/simulation';


const toggleSystem = toggle(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));



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
            vk(2, 'solPanels'),
            vk(withM2(4.5, 1), 'surface'),
            vk(withLiter(300), 'solWaterStorage'),
            vk(withYear(25), 'solInstallationLifeTime'),
        );

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(withKWhY(getOutputThermal('annualProduction')), 'solSolarProdYear'),
            vk(withKWhY(getOutputThermal('annualConsumption')), 'solSolarConsumptionYear'),
            vk(withPercent(getOutputThermal('autonomyRate') * 100), 'solSolarRateArea'),
            vk(withTCO2Y(getOutputThermal('savedCO2emissions'), 1), 'gainEnvironment'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(withEuro(getOutputThermal('installationCost')), 'buyingPrice'),
            vk(withEuro(getOutputThermal('grant')), 'bonus'),
            vk(withEuro(getOutputThermal('gain')), 'gainEnergyInvoice25Y'),
            vk(withYear(getOutputThermal('returnTime')), 'returnTime'),
        );




const infosThermal =
    () =>
        DIV({ className: 'infos-thermal-wrapper' },
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );




export const summaryDetailedThermal =
    () =>
        DIV({ className: 'summary-detailled' },
            sumAdress(),
            infosThermal(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater'),
            DIV({
                className: 'btn-reset',
                onClick: () => clearInputs(),
            }, tr('resetValue')),
        );




