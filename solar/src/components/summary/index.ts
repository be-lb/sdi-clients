import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';



const kv =
    (key: MessageKey) => DIV({ className: 'kv' },
        SPAN({ className: 'key' }, tr(key)),
        SPAN({ className: 'value' }, '$value'));






const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, '$streetName $streetNumber'),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ' $locality')));

const sumPotentialRank =
    () =>
        DIV({ className: 'potential-rank' },
            DIV({ className: 'this-building' }, tr('thisBuildingGotA')),
            DIV({ className: 'potential-rank-value' }, '$SolarPotential'));


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice'),
            kv('gainEnvironment'),
            DIV({ className: 'note' }, tr('estim10Y')),
        );

const sumArea =
    () =>
        DIV({ className: 'summary-area' },
            DIV({ className: 'area-barchart' }),
            DIV({ className: 'area-kv-wrapper' },
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
                    SPAN({ className: 'key' }, tr('orientationGreat'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
                    SPAN({ className: 'key' }, tr('orientationGood'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
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
            kv('surface'),
            kv('power'),
            kv('obstacleEstimation'));

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('energy')),
            kv('yearProduction'),
            kv('yearConsumption'),
            kv('solarAutonomy'));

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('finance')),
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice'),
            kv('gainTotal25Y'),
            kv('returnTime'));




export const summaryDetailed =
    () =>
        DIV({ className: 'summary-detailled' },
            sumInstallation(),
            sumEnergy(),
            sumFinance(),
        );



