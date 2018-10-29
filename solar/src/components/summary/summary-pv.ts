import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTonsCO2 } from 'sdi/util';

import { buildingAdress } from '../item-factory';

import {
    getOutputPv,
    getPanelUnits,
} from '../../queries/simulation';



const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));

const gains =
    () => SPAN({}, withEuro(getOutputPv('selfConsumptionAmountYear10') + getOutputPv('CVAmountYear10')));

const sumPotentialLabel =
    () =>
        DIV({ className: 'potential-label' },
            DIV({},
                SPAN({}, tr('solSolarPotentialStr1')),
                SPAN({ className: 'highlight-value' },
                    getPanelUnits(),
                    ` ${tr('solPanelsPV')}`),
                SPAN({}, ` ${tr('solSolarPotentialStr2')} `),
                SPAN({ className: 'highlight-value' },
                    `${tr('solSolarPotentialStr3')} ${tr('solSolarPotentialStr4')} `,
                    gains(),
                    ` ${tr('solOn10Years')}`),
            ),
        );


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            vk(withEuro(getOutputPv('CVAmountYear10')), 'gainGreenCertif', 'green-cert'),
            vk(withEuro(getOutputPv('selfConsumptionAmountYear10')), 'gainElecInvoice', 'gain-elec'),
            vk(withTonsCO2(getOutputPv('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
            vk(withEuro(getOutputPv('installationCost', 0)), 'buyingPrice', 'buying-price'),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            buildingAdress(),
            sumPotentialLabel(),
            sumPotentialValues(),
        );



