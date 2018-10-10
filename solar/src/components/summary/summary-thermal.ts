import { DIV, SPAN, BR } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTCO2Y } from 'sdi/util';

import { toggleWithInfo, buildingAdress } from '../item-factory';

import {
    getSystem,
    getOutputThermal,
} from '../../queries/simulation';

import { setSystem } from '../../events/simulation';


const toggleSystem = toggleWithInfo(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));



const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));



const gains =
    () => SPAN({}, withEuro(getOutputThermal('grant') + getOutputThermal('gain')));


const sumPotentialLabel =
    () =>
        DIV({ className: 'potential-label' },
            DIV({},
                SPAN({}, tr('solSolarPotentialStr1')),
                SPAN({ className: 'highlight-value' }, '2', ' ', tr('solPanels')),
                BR({}),
                SPAN({}, ' ', tr('solSolarPotentialStr2'), ' '),
                SPAN({ className: 'highlight-value' }, tr('solSolarPotentialStr3'), tr('solSolarPotentialStr4'), gains(), ' ', tr('solOn10Years')),
            ),
        );

const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            vk(withEuro(getOutputThermal('grant')), 'bonus', 'green-cert'),
            vk(withEuro(getOutputThermal('gain')), 'gainEnergyInvoice', 'gain-thermal'),
            vk(withTCO2Y(getOutputThermal('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
            vk(withEuro(getOutputThermal('installationCost', 0)), 'buyingPrice', 'buying-price'),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            buildingAdress(),
            sumPotentialLabel(),
            sumPotentialValues(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater', 'solTogglePV', 'solToggleThermal'),
        );



