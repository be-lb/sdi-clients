import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox, toggle } from '../item-factory';


const panelIntegration =
    () =>
        DIV({ className: 'switch-wrapper' },
            DIV({ className: 'switch-title' }, tr('panelIntegration') + ' : '),
            toggle('yes', 'no'));

export const calcInstallation =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-title' }, '4. ' + tr('installation')),
            DIV({ className: 'adjust-item-widget' },
                panelIntegration(),
                DIV({ className: 'input-label' }, tr('technoType') + ' : '),
                checkBox('monocristal'),
                checkBox('polycristal'),
                checkBox('monocristalHR')));




