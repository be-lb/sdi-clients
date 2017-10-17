
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

import { query } from './index';
import { MessageRecord, ILayerInfo, Inspire } from 'sdi/source';

export interface SyntheticLayerInfo {
    name: MessageRecord | null;
    info: ILayerInfo | null;
    metadata: Inspire | null;
}


const queries = {

    getUserId() {
        return query('app/user');
    },

    getUserData() {
        return query('data/user');
    },

    getApiUrl(s: string) {
        return `${query('app/api-root')}${s}`;
    },

    getRoot() {
        return query('app/root');
    },


    getLang() {
        return query('app/lang');
    },

    getLayout() {
        const ll = query('app/layout');
        if (ll.length === 0) {
            throw (new Error('PoppingEmptyLayoutList'));
        }
        return ll[ll.length - 1];
    },

    getCSRF() {
        return query('app/csrf');
    },

};

export default queries;
