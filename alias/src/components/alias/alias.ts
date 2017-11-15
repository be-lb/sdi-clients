
import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import form from './form';
import table from './table';

const render =
    () => {
        return DIV({ className: 'alias-wrapper' },
            H1({}, tr('aliasDictonary')),
            DIV({ className: 'alias-widget' },
                table(),
                form()))
    };


export default render;
