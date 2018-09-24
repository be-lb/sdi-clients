import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';





export const actionContact =
    () =>
        DIV({ className: 'action-contact' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solContactStr1')),
            H1({}, tr('solContactStr2')),
            // DIV({ className: 'action-info' }, ##IMPORTANT : keep those commented lines until end of dev, in case BE changes his mind on wording
            //     DIV({}, tr('solActContactStr1')),
            //     DIV({}, tr('solActContactStr2')),
            //     DIV({}, tr('solActContactStr3')),
            //     DIV({}, tr('solActContactStr4'))),
        );

export const actionChange =
    () =>
        DIV({ className: 'action-change' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solChangeStr1')),
            H1({}, tr('solChangeStr2')),
            // DIV({ className: 'action-info' },
            //     DIV({}, tr('solActChangeStr1')),
            //     DIV({}, tr('solActChangeStr2')),
            //     DIV({}, tr('solActChangeStr3')),
            //     DIV({}, tr('solActChangeStr4'))),
        );


export const actionInfo =
    () =>
        DIV({ className: 'action-info' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solCalculInfoStrPart1')),
            H1({}, tr('solCalculInfoStrPart2')),
        );

export const actionPrint =
    () =>
        DIV({ className: 'action-print' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solPrintStr1')),
            H1({}, tr('solPrintStr2')),
            // DIV({ className: 'action-info' },
            //     DIV({}, tr('solActPrintStr1')),
            //     DIV({}, tr('solActPrintStr2')),
            //     DIV({ className: 'pdf' })),
        );






