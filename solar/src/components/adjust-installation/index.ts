import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox } from '../item-factory';


const panelIntegration =
    () =>
        DIV({ className: 'switch-wrapper' },
            DIV({ className: 'switch-title' }, tr('panelIntegration') + ' : '),
            DIV({ className: 'switch' },
                DIV({ className: 'value first-value' }, tr('yes') + ' '),
                DIV({ className: 'switch-icon' }),
                DIV({ className: 'value second-value' }, ' ' + tr('no')),
            ),

        );

export const calcInstallation =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-title' }, '4. ' + tr('installation') + ' : '),
            DIV({ className: 'adjust-item-widget' },
                DIV({ className: 'input-label' }, tr('technoType') + ' : '),
                checkBox('monocristal'),
                checkBox('polycristal'),
                checkBox('monocristalHR'),
                panelIntegration()));




