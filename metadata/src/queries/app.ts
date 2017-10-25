
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

import { query } from 'sdi/shape';
import { MessageRecord, ILayerInfo, Inspire } from 'sdi/source';

export interface SyntheticLayerInfo {
    name: MessageRecord | null;
    info: ILayerInfo | null;
    metadata: Inspire | null;
}


const queries = {


    getUserData() {
        return query('data/user');
    },

    getLayout() {
        const ll = query('app/layout');
        if (ll.length === 0) {
            throw (new Error('PoppingEmptyLayoutList'));
        }
        return ll[ll.length - 1];
    },


};

export default queries;
