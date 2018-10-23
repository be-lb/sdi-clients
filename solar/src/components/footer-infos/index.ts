import { DIV, A } from 'sdi/components/elements';
import tr from 'sdi/locale';


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


export const homegradeContact =
    () =>
        DIV({ className: 'contact-link' },
            tr('solContactHomegrade'),
            ' : ',
            A({
                href: 'http://www.homegrade.brussels',
                target: '_blank',
            }, 'www.homegrade.brussels'),
        );

export const facilitateurContact =
    () =>
        DIV({ className: 'contact-link' },
            tr('solContactFacilitateur'),
            ' : ',
            A({
                href: tr('solLinkFacilitateur'),
                target: '_blank',
            }, tr('solFacilitateurLabel')),
        );


export const beContact =
    () =>
        DIV({ className: 'beContact-link' },
            A({
                href: tr('solLinkContactBE'),
                target: '_blank',
            }, tr('solContactBELabel')),
        );

export const contactLinks =
    () =>
        DIV({ className: 'contact-links' },
            DIV({ className: 'footer-link-title' }, tr('solContactLinkLabel')),
            homegradeContact(),
            facilitateurContact(),
        );
