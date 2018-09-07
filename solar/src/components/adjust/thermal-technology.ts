import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { thermicTechnology } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const renderSelect =
    () => {
        const checkBox = inputSelect(thermicTechnology, setInputF('thermicHotWaterProducer'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({ className: 'multi-checkbox-label' }, tr('solHeatProdSys') + ' : '),
            DIV({},
                checkBox('solElectricBoiler', 'electric'),
                checkBox('solMazout', 'fuel'),
                // checkBox('solPellet', 'mono'),
                checkBox('solGaz', 'gas')));
    };

export const calcTechnologyThermal =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '1. ' + tr('technology'))),
            DIV({ className: 'adjust-item-widget' },
                renderSelect()));




