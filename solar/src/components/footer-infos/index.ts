import { DIV, A } from 'sdi/components/elements';
import tr from 'sdi/locale';



export const contactLinks =
    () =>
        DIV({ className: 'contact-links' },
            DIV({ className: 'footer-link-title' }, tr('solContactLinkLabel')),
            DIV({ className: 'beContact-link' },
                tr('solContactLabel'),
                A({
                    href: tr('solLinkContactBE'),
                    target: '_blank',
                }, tr('solLinkContactBELabel')),
            ),
        );

export const disclaimer =
    () =>
        DIV({ className: 'disclaimer' },
            DIV({ className: 'footer-link-title' },
                tr('solDisclaimerLimit'),
            ),
            DIV({},
                tr('solDisclaimerLink'),
                ' ',
                A({
                    href: '',
                    target: '_blank',
                }, tr('moreInfos')),
            ));


