import { DIV, SPAN, BR } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTonsCO2 } from 'sdi/util/';

import { buildingAdress } from '../item-factory';

import {
    getOutputThermal,
} from '../../queries/simulation';




const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));



// const gains =
//     () => SPAN({}, withEuro(getOutputThermal('grant') + getOutputThermal('thermalGain10')));


const sumPotentialLabel =
    () =>
        DIV({ className: 'potential-label' },
            DIV({},
                SPAN({}, tr('solSolarPotentialStr1')),
                SPAN({ className: 'highlight-value' },
                    `2 ${tr('solPanelsTH')}.`),
                BR({}),
                SPAN({}, `${tr('solSummary10Y')} : `),
                BR({}),
                BR({}),
            ),
        );

const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            vk(withEuro(getOutputThermal('grant')), 'bonus', 'green-cert'),
            vk(withEuro(getOutputThermal('thermalGain10')), 'gainEnergyInvoice', 'gain-thermal'),
            vk(withTonsCO2(getOutputThermal('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
            vk(withEuro(getOutputThermal('installationCost', 0)), 'buyingPrice', 'buying-price'),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            buildingAdress(),
            sumPotentialLabel(),
            sumPotentialValues(),
        );



