
import { DIV, SPAN, INPUT } from 'sdi/components/elements';

import map from '../map';
import tr from 'sdi/locale';

import { toggle } from '../item-factory';


const wrapperTop =
    () =>
        DIV({ className: 'wrapper-top' },
            DIV({ className: 'locate-pitch' },
                SPAN({ className: 'bolt' }),
                SPAN({}, tr('howMuchOf')),
                SPAN({ className: 'pitch-bold' }, tr('electricity')),
                DIV({}, tr('orOf'), SPAN({ className: 'pitch-bold' }, tr('heat'))),
                DIV({}, tr('possibleToProduce')),
                DIV({}, tr('byRoof')),
                DIV({}, tr('atBxl'))),
            DIV({ className: 'locate-geocode' },
                DIV({},
                    SPAN({}, tr('calculateStrPart1')),
                    SPAN({ className: 'pitch-bold' }, tr('solarPotential')),
                    SPAN({}, tr('calculateStrPart2'))),
                toggle('solarThermal', 'solarPV'),
                DIV({ className: 'input-wrapper' },
                    INPUT({
                        className: 'locate-input',
                        type: 'text',
                        name: 'adress',
                        placeholder: tr('solarGeocode'),
                    }),
                    DIV({ className: 'btn-analyse' },
                        SPAN({ className: 'bolt' }),
                        tr('research'))),
                DIV({}, tr('orSelectBuildingOnMap'))));


const render =
    () =>
        DIV({ className: 'locate-box' },
            wrapperTop(),
            map());

export default render;
