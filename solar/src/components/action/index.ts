import { DIV, H1, A, BR } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { getSystem } from '../../queries/simulation';


const switchLinkPVTH =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return tr('solLinkInstallateurPV');
            case 'thermal': return tr('solLinkInstallateurTH');
        }
    };


export const actionContact =
    () =>
        A({
            className: 'action-link',
            href: switchLinkPVTH(),
            target: '_blank',
        },
            DIV({ className: 'action action-contact' },
                DIV({ className: 'action-picto' }),
                H1({}, tr('solContactStr1'), BR({}), tr('solContactStr2')),
            ));


export const actionChange =
    () =>
        A({
            className: 'action-link',
            href: tr('solLinkInfoGreenEnergy'),
            target: '_blank',
        },
            DIV({ className: 'action action-change' },
                DIV({ className: 'action-picto' }),
                H1({}, tr('solChangeStr1'), BR({}), tr('solChangeStr2')),
            ));


export const actionInfo =
    () =>
        A({
            className: 'action-link',
            href: tr('solLinkFAQ'),
            target: '_blank',
        },
            DIV({ className: 'action action-info' },
                DIV({ className: 'action-picto' }),
                H1({}, tr('solCalculInfoStrPart1'), BR({}), tr('solCalculInfoStrPart2')),
            ));


export const actionPrint =
    () =>
        DIV({ className: 'action action-print' },
            DIV({ className: 'action-picto' }),
            H1({}, tr('solPrintStr1'), BR({}), tr('solPrintStr2')),
        );






