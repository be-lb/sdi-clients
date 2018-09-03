import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { pvTechnology } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const renderSelect =
    () => {
        const checkBox = inputSelect(pvTechnology, setInputF('pvTechnology'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({ className: 'multi-checkbox-label' }, tr('solHeatProdSys') + ' : '),
            DIV({},
                checkBox('solElectricBoiler', 'poly'),
                checkBox('solMazout', 'mono'),
                checkBox('solPellet', 'mono'),
                checkBox('solGaz', 'mono_high')));
    };

export const calcInstallationThermal =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '2. ' + tr('installation'))),
            DIV({ className: 'adjust-item-widget' },
                renderSelect()));




