import { DIV, A } from 'sdi/components/elements';
import tr from 'sdi/locale';


export const disclaimerLink =
    () =>
        DIV({ className: 'disclaimer-link' },
            A({
                href: '',
                target: '_blank',
            }, tr('solDisclaimerLink')),
        );


export const homegradeContactLink =
    () =>
        DIV({ className: 'beContact-link' },
            tr('solContactHomegrade'),
            ' : ',
            A({
                href: 'http://www.homegrade.brussels',
                target: '_blank',
            }, 'www.homegrade.brussels'),
        );


export const beContactLink =
    () =>
        DIV({ className: 'beContact-link' },
            A({
                href: tr('solContactBE'),
                target: '_blank',
            }, tr('solContactBELabel')),
        );
