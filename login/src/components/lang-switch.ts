/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
import * as debug from 'debug';
import { SPAN } from './elements';
import queries from '../queries/app';
import events from '../events/app';
import tr from '../locale';

const logger = debug('sdi:lang-switch');

const sl = (lc: 'fr' | 'nl') => () => {
    events.setLang(lc);
};

export default () => {
    const lc = queries.getLang();
    switch (lc) {
        case 'fr':
            return (SPAN({
                className: 'lang-switch',
                onClick: sl('nl'),
            }, SPAN({ className: 'lang-switch-label' },
                `${tr('switchLang')}`)));

        case 'nl':
            return (SPAN({
                className: 'lang-switch',
                onClick: sl('fr'),
            }, SPAN({ className: 'lang-switch-label' },
                `${tr('switchLang')}`)));
    }
};

logger('loaded');
