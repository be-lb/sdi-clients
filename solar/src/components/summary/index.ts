import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withTCO2Y } from 'sdi/util';


import { area, power, obstacleRate, annualProduction, annualConsumption, autonomy, installationCost, CVAmountYearN, totalGain25Y, returnTime, savedCO2emissions, potential, streetName, streetNumber, locality, areaExcellent, areaMedium, areaLow } from '../../queries/simulation';



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
            vk(installationCost(), 'buyingPrice', 'buying-price'),
            vk(CVAmountYearN(), 'gainGreenCertif', 'green-cert'),
            vk('$invoice', 'gainElecInvoice', 'gain-elec'),
            vk(savedCO2emissions(), 'gainEnvironment', 'gain-env'),
            DIV({ className: 'note' }, tr('estim10Y')),
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
            vk(area(), 'surface'),
            vk(power(), 'power'),
            vk(obstacleRate(), 'obstacleEstimation'));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            vk(annualProduction(), 'yearProduction'),
            vk(withTCO2Y(annualConsumption()), 'yearConsumption'),
            vk(autonomy(), 'solarAutonomy'));

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            vk(installationCost(), 'buyingPrice'),
            vk(CVAmountYearN(), 'gainGreenCertif'),
            vk('$elec', 'gainElecInvoice'),
            vk(totalGain25Y(), 'gainTotal25Y'),
            vk(returnTime(), 'returnTime'));




export const summaryDetailed =
    () =>
        DIV({ className: 'summary-detailled' },
            DIV({ className: 'summary-detailled-title' }, tr('sheet')),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



