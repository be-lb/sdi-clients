import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withM2, withKWc, withKWhY, withYear, withTCO2 } from 'sdi/util';


import { getOutput, streetName, streetNumber, locality, potential, areaExcellent, areaMedium, areaLow } from '../../queries/simulation';



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

const sumArea =
    () => {
        const excellent = withPercent(areaExcellent());
        const medium = withPercent(areaMedium());
        const low = withPercent(areaLow());
        return DIV({ className: 'summary-area' },
            DIV({ className: 'area-barchart' }),
            DIV({ className: 'area-kv-wrapper' },
                DIV({ className: 'vk', style: { width: excellent } },
                    SPAN({ className: 'value' }, excellent),
                    SPAN({ className: 'key' }, tr('orientationGreat'))),
                DIV({ className: 'vk', style: { width: medium } },
                    SPAN({ className: 'value' }, medium),
                    SPAN({ className: 'key' }, tr('orientationGood'))),
                DIV({ className: 'vk', style: { width: low } },
                    SPAN({ className: 'value' }, low),
                    SPAN({ className: 'key' }, tr('unusable'))),
            ));
    };


export const summary =
    () =>
        DIV({ className: 'summary' },
            sumAdress(),
            sumPotentialRank(),
            sumPotentialValues(),
            sumArea(),
        );

const sumInstallation =
    () =>
        DIV({ className: 'sum-installation-wrapper' },
            H2({}, tr('installation')),
            vk(withM2(getOutput('maxArea')), 'surface'),
            vk(withKWc(getOutput('power'), 1), 'power'),
            vk(withPercent(getOutput('obstacleRate') * 100), 'obstacleEstimation'));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(withKWhY(getOutput('annualProduction')), 'yearProduction'),
            vk(withKWhY(getOutput('annualConsumption')), 'yearConsumption'),
            vk(withPercent(getOutput('autonomy') * 100), 'solarAutonomy'));

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(withEuro(getOutput('installationCost')), 'buyingPrice'),
            vk(withEuro(getOutput('CVAmountYearN')), 'gainGreenCertif'),
            vk(withEuro(getOutput('selfConsumptionAmountYearN')), 'gainElecInvoice'),
            vk(withEuro(getOutput('totalGain25Y')), 'gainTotal25Y'),
            vk(withYear(getOutput('returnTime')), 'returnTime'));




export const summaryDetailed =
    () =>
        DIV({ className: 'summary-detailled' },
            DIV({ className: 'summary-detailled-title' }, tr('sheet')),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



