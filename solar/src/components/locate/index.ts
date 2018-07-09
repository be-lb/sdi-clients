
import { DIV, SPAN, INPUT } from 'sdi/components/elements';

import map from '../map';
import tr from 'sdi/locale';

import { toggle } from '../item-factory';


const wrapperTop =
    () =>
        DIV({ className: 'wrapper-top' },
            DIV({ className: 'locate-pitch' },
                SPAN({ className: 'bolt' }),
                SPAN({}, tr('solHowMuchOf')),
                SPAN({ className: 'pitch-bold' }, tr('electricity')),
                DIV({}, tr('solOrOf'), SPAN({ className: 'pitch-bold' }, tr('heat'))),
                DIV({}, tr('solPossibleToProduce')),
                DIV({}, tr('solByRoof')),
                DIV({}, tr('solAtBxl'))),
            DIV({ className: 'locate-geocode' },
                DIV({},
                    SPAN({}, tr('solCalculateStrPart1')),
                    SPAN({ className: 'pitch-bold' }, tr('solSolarPotential')),
                    SPAN({}, tr('solCalculateStrPart2'))),
                toggle('solarThermal', 'solarPV'),
                DIV({ className: 'input-wrapper' },
                    INPUT({
                        className: 'locate-input',
                        type: 'text',
                        name: 'adress',
                        placeholder: tr('solSolarGeocode'),
                    }),
                    DIV({ className: 'btn-analyse' },
                        SPAN({ className: 'bolt' }),
                        tr('solResearch'))),
                DIV({}, tr('solOrSelectBuildingOnMap'))));


const render =
    () =>
        DIV({ className: 'locate-box' },
            wrapperTop(),
            map());

export default render;
