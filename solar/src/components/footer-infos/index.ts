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

export const urbisReward =
    () =>
        DIV({ className: 'reward urbis' },
            tr('solUrbisLabel'),
            A({ href: tr('solUrbisLink') }, 'UrbIS'),
        );

export const createdBy =
    () =>
        DIV({ className: 'reward created-by' },
            tr('solCreatorsLabel'),
            A({ href: 'http://www.apere.org' }, 'APERe'),
            ', ',
            A({ href: 'https://champs-libres.coop' }, 'Champs Libres'),
            ' & ',
            A({ href: 'https://atelier-cartographique.be' }, 'Atelier Cartographique'),
        );

