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
import { IMapInfo } from 'sdi/source';

const queries = {
    getAll() {
        const maps = query('data/maps');
        const cats = query('data/categories');
        const ret = cats.map((cat) => {
            const cid = cat.id;
            const catMaps = maps.reduce<IMapInfo[]>((acc, m) => {
                if (m.categories.indexOf(cid) >= 0) {
                    return acc.concat(m);
                }
                return acc;
            }, []);
            return [cat, catMaps];
        });
        const uncategorized = maps.reduce<IMapInfo[]>((acc, m) => {
            if (m.categories.length === 0) {
                return acc.concat(m);
            }
            return acc;
        }, []);
        ret.push([{ id: '', name: { fr: '', nl: '' } }, uncategorized]);
        return ret;
    },

    // search() {
    //     // return [query('data/maps')].filter(ref => (fromRecord(ref.title).toLowerCase().indexOf(query('component/search').query.toLocaleLowerCase()) > -1));
    //     return query('data/maps');
    // },
};

export default queries;
