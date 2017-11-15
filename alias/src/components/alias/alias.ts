
import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { button } from '../button';
import { buildForm } from '../../events/alias';

import form from './form';
import table from './table';

const render =
    () => {
        return DIV({ className: 'alias-wrapper' },
            H1({}, tr('aliasDictonary')),
            DIV({ className: 'alias-widget' },
                DIV({ className: 'alias-table' },
                    table(),
                    button('add', 'createAlias')(() => buildForm(''))),
                form()))
    };


export default render;
