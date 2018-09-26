import { DIV, H1, BR } from 'sdi/components/elements';
import tr from 'sdi/locale';





export const actionContact =
    () =>
        DIV({ className: 'action-contact' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solContactStr1'), BR({}), tr('solContactStr2')),
        );

export const actionChange =
    () =>
        DIV({ className: 'action-change' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solChangeStr1'), BR({}), tr('solChangeStr2')),
        );


export const actionInfo =
    () =>
        DIV({ className: 'action-info' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solCalculInfoStrPart1'), BR({}), tr('solCalculInfoStrPart2')),
        );

export const actionPrint =
    () =>
        DIV({ className: 'action-print' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solPrintStr1'), BR({}), tr('solPrintStr2')),
        );






