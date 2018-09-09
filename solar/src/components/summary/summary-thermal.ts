import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTCO2Y } from 'sdi/util';

import { toggle } from '../item-factory';

import { getSystem, getOutputThermal, streetName, streetNumber, locality } from '../../queries/simulation';
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

const sumPotentialLabel =
    () =>
        DIV({ className: 'potential-label' },
            DIV({}, tr('solSolarPotential')),
            DIV({}, tr('solOn10Years')),
        );


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            vk(withEuro(getOutputThermal('installationCost', 0)), 'buyingPrice', 'buying-price'),
            vk(withEuro(getOutputThermal('grant')), 'bonus', 'green-cert'),
            vk(withEuro(getOutputThermal('gain')), 'gainElecInvoice', 'gain-elec'),
            vk(withTCO2Y(getOutputThermal('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            sumAdress(),
            toggleSystem('solPhotovoltaic', 'solThermal'),
            sumPotentialLabel(),
            sumPotentialValues(),
        );



