import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { pvTechnology } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const renderSelect =
    () => {
        const checkBox = inputSelect(pvTechnology, setInputF('pvTechnology'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({ className: 'multi-checkbox-label' }, tr('technoType') + ' : '),
            DIV({},
                checkBox('polycristal', 'poly'),
                checkBox('monocristal', 'mono'),
                checkBox('monocristalHR', 'mono_high')));
    };

export const calcTechnology =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '2. ' + tr('technology')),
                DIV({ className: 'adjust-picto picto-panel' })),
            DIV({ className: 'adjust-item-widget' },
                // DIV({ className: 'adjust-picto-wrapper' },
                renderSelect()));




