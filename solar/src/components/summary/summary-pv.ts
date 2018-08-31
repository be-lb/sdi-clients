import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withTCO2 } from 'sdi/util';


import { getOutput, streetName, streetNumber, locality, potential } from '../../queries/simulation';



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

const sumPotentialRank =
    () =>
        DIV({ className: 'potential-rank' },
            DIV({ className: 'this-building' }, tr('solThisBuildingGotA')),
            DIV({ className: 'potential-rank-value' }, potential()));


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            vk(withEuro(getOutput('installationCost', 0)), 'buyingPrice', 'buying-price'),
            vk(withEuro(getOutput('CVAmountYearN')), 'gainGreenCertif', 'green-cert'),
            vk(withEuro(getOutput('selfConsumptionAmountYearN')), 'gainElecInvoice', 'gain-elec'),
            vk(withTCO2(getOutput('savedCO2emissions') / 1000), 'gainEnvironment', 'gain-env'),
            // DIV({ className: 'note' }, tr('estim10Y')),
        );


export const summary =
    () =>
        DIV({ className: 'summary' },
            sumAdress(),
            sumPotentialRank(),
            sumPotentialValues(),
        );



