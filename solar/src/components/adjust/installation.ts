import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { toggle, inputSelect } from '../item-factory';
import { pvTechnology } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const panelIntegration =
    () =>
        DIV({ className: 'switch-wrapper' },
            DIV({ className: 'switch-title' }, tr('panelIntegration') + ' : '),
            toggle('yes', 'no'));

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

export const calcInstallation =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-title' }, '3. ' + tr('installation')),
            DIV({ className: 'adjust-item-widget' },
                DIV({ className: 'adjust-picto-wrapper' },
                    DIV({ className: 'adjust-picto panel' }),
                    panelIntegration()),
                renderSelect()));




