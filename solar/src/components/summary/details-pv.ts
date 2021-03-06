import { DIV, SPAN, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withPercent, withEuro, withM2, withKWc, withKWhY, withYear, withTCO2Y } from 'sdi/util';

import {
    getPanelUnits,
    pvTechnologyLabel,
    totalArea,
    getAnimatedValuePv,
    usableRoofArea,
    getObstacleArea,
} from '../../queries/simulation';
import { buildingAdress } from '../item-factory';
import { clearInputs } from '../../events/simulation';
import { renderPDF } from './print';


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

const sumRooftop =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyRooftop')),
            vk(withM2(totalArea()), 'solTotalSurface'),
            vk(withM2(getObstacleArea()), 'obstacleEstimation'),
            vk(withM2(usableRoofArea()), 'solUsableRoofArea'),
        );

const sumEnergy =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyEnergy')),
            vk(withKWhY(getAnimatedValuePv('annualProduction')), 'solProductionPanels'),
            vk(withKWhY(getAnimatedValuePv('annualConsumption')), 'solHomeConsumption'),
            vk(withPercent(getAnimatedValuePv('autonomy', 0.001) * 100), 'solarAutonomy'),
            vk(withTCO2Y(getAnimatedValuePv('savedCO2emissions') / 1000 / 10, 1), 'gainEnvironment', 'gain-env'),
        );

const sumInstallation =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyInstallation')),
            vks(getPanelUnits(), `${tr('solNumberOfPanels')} (${tr(pvTechnologyLabel())})`),
            vk(withM2(getAnimatedValuePv('maxArea')), 'solInstallationSurface'),
            vk(withKWc(getAnimatedValuePv('power'), 1), 'solTotalPower'),
            vk(withYear(25), 'solInstallationLifeTime'),
        );

const sumFinance =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyFinance')),
            vk(withEuro(getAnimatedValuePv('installationCost')), 'buyingPrice'),
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
        onClick: () => renderPDF(),
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
            buildingAdress(),
            sumRooftop(),
            sumEnergy(),
            sumInstallation(),
            sumFinance(),
            footer(),
        );




