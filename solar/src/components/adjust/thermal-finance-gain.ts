import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

const bonus =
    () =>
        DIV({ className: 'gain' },
            DIV({ className: 'wrapper-multi-checkbox' },
                DIV({ className: 'wrapper-checkbox' },
                    DIV({ className: 'checkbox' }),
                    DIV({ className: 'checkbox-label' }, '2 500 €')),
                DIV({ className: 'wrapper-checkbox' },
                    DIV({ className: 'checkbox' }),
                    DIV({ className: 'checkbox-label' }, '3 000 €')),
                DIV({ className: 'wrapper-checkbox' },
                    DIV({ className: 'checkbox' }),
                    DIV({ className: 'checkbox-label' }, '3 500 €')),
            ),
        );


export const calcFinanceThermalGain =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '3. ' + tr('bonus')),
                DIV({ className: 'adjust-picto picto-gain' })),
            DIV({ className: 'adjust-item-widget' },
                bonus()));




