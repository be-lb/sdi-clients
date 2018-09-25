import { DIV, SPAN, H1, BR } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTCO2 } from 'sdi/util';

import { toggle } from '../item-factory';

import { getSystem, getOutputPv, streetName, streetNumber, locality } from '../../queries/simulation';
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
            DIV({},
                tr('solSolarPotentialStr1'),
                SPAN({ className: 'highlight-value' }, tr('solOn10Years')),
                BR({}),
                tr('solSolarPotentialStr2'),
                BR({}),
                tr('solSolarPotentialStr3'),
                SPAN({ className: 'highlight-value' }, withEuro(getOutputPv('installationCost', 0))),
            ),
            // DIV({}, tr('solOn10Years')),
        );


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            // vk(withEuro(getOutputPv('installationCost', 0)), 'buyingPrice', 'buying-price'),
            vk(withEuro(getOutputPv('CVAmountYear10')), 'gainGreenCertif', 'green-cert'),
            vk(withEuro(getOutputPv('selfConsumptionAmountYear10')), 'gainElecInvoice', 'gain-elec'),
            vk(withTCO2(getOutputPv('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            sumAdress(),
            sumPotentialLabel(),
            sumPotentialValues(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater'),
        );



