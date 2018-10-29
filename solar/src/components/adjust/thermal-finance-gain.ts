import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withEuro } from 'sdi/util';

import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { note } from './note';


const getThermicGrant = getInputF('thermicGrant');
const setThermicGrant = setInputF('thermicGrant');
const grants = [2500, 3000, 3500];

const klass =
    (n: number) => getThermicGrant() === n ? 'checkbox active' : 'checkbox';


const item =
    (n: number) =>
        DIV({
            key: `thermal-grant-${n}`,
            className: 'wrapper-checkbox',
            onClick: () => setThermicGrant(n),
        },
            DIV({ className: klass(n) }),
            DIV({ className: 'checkbox-label' }, withEuro(n)));

const bonus =
    () =>
        DIV({ className: 'gain' },
            DIV({ className: 'wrapper-multi-checkbox' },
                grants.map(item)),
        );

export const calcFinanceThermalGain =
    () =>
        DIV({ className: 'adjust-item finance' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' }, '3. ' + tr('bonus')),
                DIV({ className: 'adjust-picto picto-gain' })),
            note('thermal_grant'),
            DIV({ className: 'adjust-item-widget' },
                bonus()));




