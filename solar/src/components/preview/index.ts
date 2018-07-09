import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { summary } from '../summary';



// const switchThermal =
//     () =>
//         DIV({ className: 'switch-thermal' },
//             DIV({}, tr('solarPV')),
//             DIV({ className: 'switch-icon' }),
//             DIV({}, tr('solarThermal')));





const action =
    () =>
        DIV({ className: 'actions' },
            DIV({ className: 'action-settings' },
                H1({}, tr('solAdjustStr1')),
                H1({}, tr('solAdjustStr2')),
                DIV({ className: 'action-info' },
                    DIV({}, tr('solActSettingStr1')),
                    DIV({}, tr('solActSettingStr2')),
                    DIV({}, tr('solActSettingStr3')),
                    DIV({}, tr('solActSettingStr4')),
                )),
            DIV({ className: 'action-contact' },
                H1({}, tr('solContactStr1')),
                H1({}, tr('solContactStr2')),
                DIV({ className: 'action-info' },
                    DIV({}, tr('solActContactStr1')),
                    DIV({}, tr('solActContactStr2')),
                    DIV({}, tr('solActContactStr3')),
                    DIV({}, tr('solActContactStr4')),
                ),
            ),
            DIV({ className: 'action-change' },
                H1({}, tr('solChangeStr1')),
                H1({}, tr('solChangeStr2')),
                DIV({ className: 'action-info' },
                    DIV({}, tr('solActChangeStr1')),
                    DIV({}, tr('solActChangeStr2')),
                    DIV({}, tr('solActChangeStr3')),
                    DIV({}, tr('solActChangeStr4')),
                ),
            ),
            DIV({ className: 'action-print' },
                H1({}, tr('solPrintStr1')),
                H1({}, tr('solPrintStr2')),
                DIV({ className: 'action-info' },
                    DIV({}, tr('solActPrintStr1')),
                    DIV({}, tr('solActPrintStr2')),
                    DIV({}, 'PDF'),
                )));



const render =
    () =>
        DIV({ className: 'main-splitted-height' },
            DIV({ className: 'top' },
                context(),
                summary()),
            DIV({ className: 'bottom' },
                DIV({ className: 'action-title' }, tr('solAndNow')),
                action(),
            ));


export default render;
