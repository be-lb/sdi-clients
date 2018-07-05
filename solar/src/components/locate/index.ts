
import { DIV, INPUT } from 'sdi/components/elements';

import map from '../map';
import tr from 'sdi/locale';



const render =
    () =>
        DIV({ className: 'locate-box' },
            DIV({ className: 'locate-adress' },
                INPUT({ 
                    className: 'locate-input',
                    type: 'text',
                    name: 'adress',
                    placeholder: tr('geocode') }),
                DIV({ className: 'btn-analyse' }, tr('analyse'))),
            map());

export default render;
