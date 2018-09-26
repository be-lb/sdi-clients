import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withEuroInclVAT, withM2, withKWc, withKWhY, withYear, withTCO2Y } from 'sdi/util';

import {
    getPanelUnits,
    locality,
    pvTechnologyLabel,
    streetName,
    streetNumber,
    totalArea,
    getAnimatedValuePv,
    usableRoofArea,
    getObstacleArea,
} from '../../queries/simulation';

import { clearInputs } from '../../events/simulation';



const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));

const vks =
    <T>(v: T, key: string, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, key));


export const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, `${streetName()} ${streetNumber()}`),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ` ${locality()}`)));


const sumRooftop =
    () =>
        DIV({ className: 'sum-rooftop-wrapper' },
            H2({}, tr('solMyRooftop')),
            vk(withM2(totalArea()), 'solTotalSurface'),
            vk(withM2(getObstacleArea()), 'obstacleEstimation'),
            vk(withM2(usableRoofArea()), 'solUsableRoofArea'),
        );

const sumEnergy =
    () =>
        DIV({ className: 'sum-energy-wrapper' },
            H2({}, tr('solMyEnergy')),
            vk(withKWhY(getAnimatedValuePv('annualProduction')), 'solProductionPanels'),
            vk(withKWhY(getAnimatedValuePv('annualConsumption')), 'solHomeConsumption'),
            vk(withPercent(getAnimatedValuePv('autonomy') * 100), 'solarAutonomy'),
            vk(withTCO2Y(getAnimatedValuePv('savedCO2emissions') / 1000, 1), 'gainEnvironment', 'gain-env'),
        );

const sumInstallation =
    () =>
        DIV({ className: 'sum-installation-wrapper' },
            H2({}, tr('solMyInstallation')),
            vks(getPanelUnits(), `${tr('solNumberOfPanels')} (${tr(pvTechnologyLabel())})`),
            vk(withM2(getAnimatedValuePv('maxArea')), 'solInstallationSurface'),
            vk(withKWc(getAnimatedValuePv('power'), 1), 'solTotalPower'),
            vk(withYear(25), 'solInstallationLifeTime'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-finance-wrapper' },
            H2({}, tr('solMyFinance')),
            vk(withEuroInclVAT(getAnimatedValuePv('installationCost')), 'buyingPrice'),
            vk(withEuro(getAnimatedValuePv('CVAmountYear25')), 'gainGreenCertif25Y'),
            vk(withEuro(getAnimatedValuePv('selfConsumptionAmountYear25')), 'gainElecInvoice25Y'),
            vk(withEuro(getAnimatedValuePv('totalGain25Y') - getAnimatedValuePv('installationCost')), 'gainTotal25Y'),
            vk(withYear(getAnimatedValuePv('returnTime')), 'returnTime'));


const reset =
    () => DIV({
        className: 'solar-btn btn-level-2 reset',
        onClick: () => clearInputs(),
    },
        DIV({ className: 'solar-inner-btn' },
            tr('resetValue'),
        ));


const printBtn =
    () => DIV({
        className: 'solar-btn print',
    },
        DIV({ className: 'solar-inner-btn' },
            tr('solPrintStr3'),
        ));



const footer =
    () =>
        DIV({ className: 'detail-footer' },
            printBtn(),
            reset(),
        );



export const summaryDetailedPhotovoltaic =
    () =>
        DIV({ className: 'summary-detailled' },
            sumAdress(),
            sumRooftop(),
            sumEnergy(),
            sumInstallation(),
            sumFinance(),
            footer(),
        );




