import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withM2 } from 'sdi/util';


import { area, power, obstacleRate, annualProduction, annualConsumption, autonomy, installationCost, CVAmountYearN, totalGain25Y, returnTime, savedCO2emissions, potential, streetName, streetNumber, locality, areaExcellent, areaMedium, areaLow } from '../../queries/simulation';



const kv =
    (key: MessageKey, v: string) => DIV({ className: 'kv' },
        SPAN({ className: 'key' }, tr(key)),
        SPAN({ className: 'value' }, v));


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
            kv('buyingPrice', installationCost()),
            kv('gainGreenCertif', CVAmountYearN()),
            kv('gainElecInvoice', '$invoice'),
            kv('gainEnvironment', savedCO2emissions()),
            DIV({ className: 'note' }, tr('estim10Y')),
        );

const sumArea =
    () =>
        DIV({ className: 'summary-area' },
            DIV({ className: 'area-barchart' }),
            DIV({ className: 'area-kv-wrapper' },
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, withM2(areaExcellent())),
                    SPAN({ className: 'key' }, tr('orientationGreat'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, withM2(areaMedium())),
                    SPAN({ className: 'key' }, tr('orientationGood'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, withM2(areaLow())),
                    SPAN({ className: 'key' }, tr('unusable'))),
            ));


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
            kv('surface', area()),
            kv('power', power()),
            kv('obstacleEstimation', obstacleRate()));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            kv('yearProduction', annualProduction()),
            kv('yearConsumption', annualConsumption()),
            kv('solarAutonomy', autonomy()));

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            kv('buyingPrice', installationCost()),
            kv('gainGreenCertif', CVAmountYearN()),
            kv('gainElecInvoice', '$elec'),
            kv('gainTotal25Y', totalGain25Y()),
            kv('returnTime', returnTime()));




export const summaryDetailed =
    () =>
        DIV({ className: 'summary-detailled' },
            DIV({ className: 'summary-detailled-title' }, tr('sheet')),
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



