import { DIV, SPAN, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withEuro, withLiter, withM2, withKWhY, withPercent, withTCO2Y, withYear } from 'sdi/util';

import { buildingAdress } from '../item-factory';
import {
    totalArea,
    usableRoofArea,
    getObstacleArea,
    getAnimatedValueThermal,
} from '../../queries/simulation';
import { clearInputs } from '../../events/simulation';
import { renderPDF } from './print';


const vk =
    <T>(v: T, key: MessageKey, vkClass = '') =>
        DIV({ className: `vk ${vkClass}` },
            SPAN({ className: 'value' }, `${v}`),
            SPAN({ className: 'key' }, tr(key)));


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
            vk(withKWhY(getAnimatedValueThermal('annualProduction')), 'solSolarProdYear'),
            vk(withKWhY(getAnimatedValueThermal('annualConsumption')), 'solSolarConsumptionYear'),
            vk(withPercent(getAnimatedValueThermal('autonomyRate') * 100), 'solSolarRateArea'),
            vk(withTCO2Y(getAnimatedValueThermal('savedCO2emissions') / 1000 / 10, 1), 'gainEnvironment'),
        );

const sumInstallation =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyInstallation')),
            vk(2, 'solNumberOfPanels'),
            vk(withM2(4.5, 1), 'surface'),
            vk(withLiter(300), 'solWaterStorage'),
            // vk(withYear(25), 'solInstallationLifeTime'),
        );


const sumFinance =
    () =>
        DIV({ className: 'sum-wrapper' },
            H2({}, tr('solMyFinance')),
            vk(withEuro(getAnimatedValueThermal('installationCost')), 'buyingPrice'),
            vk(withEuro(getAnimatedValueThermal('grant')), 'bonus'),
            vk(withEuro(getAnimatedValueThermal('thermalGain25')), 'gainEnergyInvoice25Y'),
            vk(withYear(getAnimatedValueThermal('returnTime')), 'returnTime'),
        );




const infosThermal =
    () =>
        DIV({ className: 'infos-thermal-wrapper' },
            sumRooftop(),
            sumEnergy(),
            sumInstallation(),
            sumFinance(),
        );

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


export const summaryDetailedThermal =
    () =>
        DIV({ className: 'summary-detailled' },
            buildingAdress(),
            infosThermal(),
            footer(),
        );
