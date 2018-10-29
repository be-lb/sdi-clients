import { fromPredicate } from 'fp-ts/lib/Option';
import { thermicHotWaterProducerEnum } from 'solar-sim';

import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { thermicTechnology, thermalTechnologyLabels } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { note } from './note';


const technologies: thermicHotWaterProducerEnum[] = ['electric', 'fuel', 'gas'];

const icon =
    (t: thermicHotWaterProducerEnum) =>
        DIV({ className: `adjust-picto picto-water-${t}` });

const condTech =
    fromPredicate((t: thermicHotWaterProducerEnum) => t === thermicTechnology());

const titleAndPicto =
    () => {
        const icons: React.ReactNode[] = [];
        technologies.map(condTech).forEach(i => i.map(t => icons.push(icon(t))));
        return DIV({ className: 'adjust-item-header' },
            DIV({ className: 'adjust-item-title' },
                '1. ' + tr('solHeatProdSys')), ...icons);
    };


const renderSelect =
    () => {
        const checkBox = inputSelect(thermicTechnology, setInputF('thermicHotWaterProducer'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({}, ...technologies.map(t => checkBox(thermalTechnologyLabels[t], t))));
    };

export const calcTechnologyThermal =
    () =>
        DIV({ className: 'adjust-item installation' },
            titleAndPicto(),
            note('thermal_sys'),
            DIV({ className: 'adjust-item-widget' },
                renderSelect()));




