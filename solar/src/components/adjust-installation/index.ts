import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { checkBox } from '../item-factory';


export const calcInstallation =
    () =>
        DIV({ className: 'adjust-item installation' },
            DIV({ className: 'adjust-item-title' }, '4. ' + tr('installation') + ' : '),
            DIV({ className: 'input-wrapper' },
                DIV({ className: 'input-label' }, tr('technoType')),
                DIV({ className: 'checkbox-list' },
                    checkBox('monocristal'),
                    checkBox('polycristal'),
                    checkBox('monocristalHR'))),
            checkBox('panelIntegration'));




