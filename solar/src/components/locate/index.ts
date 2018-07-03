
import { DIV } from 'sdi/components/elements';

import map from '../map';


const render =
    () =>
        DIV({ className: 'locate-box' },
            map());

export default render;
