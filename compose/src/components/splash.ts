import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import queries from '../queries/app';

const render =
    () =>
        DIV({},
            H1({}, tr('studio')),
            DIV({}, `${tr('loadingData')}: ${queries.getSplash()}%`));

export default render;
