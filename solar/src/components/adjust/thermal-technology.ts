import { fromPredicate } from 'fp-ts/lib/Option';
import { thermicHotWaterProducerEnum } from 'solar-sim';

import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { thermicTechnology, thermalTechnologyLabels } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const technologies: thermicHotWaterProducerEnum[] = ['electric', 'fuel', 'gas'];

const icon =
    (t: thermicHotWaterProducerEnum) =>
        DIV({ className: `rank-icon  active ${t}` });

const condTech =
    fromPredicate((t: thermicHotWaterProducerEnum) => t === thermicTechnology());

const titleAndPicto =
    () => {
        const icons: React.ReactNode[] = [];
        technologies.map(condTech).forEach(i => i.map(t => icons.push(icon(t))));
        return DIV({ className: 'adjust-item-header' },
            DIV({ className: 'adjust-item-title' },
                '1. ' + tr('technology')), ...icons);
    };


const renderSelect =
    () => {
        const checkBox = inputSelect(thermicTechnology, setInputF('thermicHotWaterProducer'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({ className: 'multi-checkbox-label' }, tr('solHeatProdSys') + ' : '),
            DIV({}, ...technologies.map(t => checkBox(thermalTechnologyLabels[t], t))));
    };

export const calcTechnologyThermal =
    () =>
        DIV({ className: 'adjust-item installation' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                renderSelect()));




