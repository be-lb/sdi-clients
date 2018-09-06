import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTCO2Y } from 'sdi/util';

import { toggle } from '../item-factory';

import { getSystem, streetName, streetNumber, locality } from '../../queries/simulation';
import { setSystem } from '../../events/simulation';


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


const infosThermal =
    () =>
        DIV({ className: 'infos-thermal-wrapper' },
            H2({}, tr('solThermal')),
            vk(withEuro(0), 'buyingPrice'),
            vk(withEuro(0), 'bonus'),
            vk(withEuro(0), 'gainEnergyInvoice'),
            vk(withTCO2Y(0 / 1000), 'gainEnvironment', 'gain-env'),
        );




export const summaryDetailedThermal =
    () =>
        DIV({ className: 'summary-detailled' },
            sumAdress(),
            toggleSystem('solPhotovoltaic', 'solThermal'),
            infosThermal(),
            DIV({ className: 'btn-reset' }, tr('resetValue')),
        );




