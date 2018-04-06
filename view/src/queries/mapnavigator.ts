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
import { IMapInfo, makeRecord } from 'sdi/source';
import { fromRecord } from 'sdi/locale';

export const getCategories =
    () => {
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
        ret.push([{ id: '', name: makeRecord() }, uncategorized]);
        return ret;
    };

export const getNavigatorQuery =
    () => query('component/mapnavigator').query;

const filterMap =
    (pat: RegExp) =>
        (m: IMapInfo) => {
            const title = fromRecord(m.title);
            const description = fromRecord(m.description);
            return pat.test(title) || pat.test(description);
        }

const getFilteredMaps =
    (q: string) =>
        query('data/maps').filter(filterMap(new RegExp(`.*${q}.*`, 'i')));

export const getMaps =
    () => {
        const q = getNavigatorQuery();
        if (q.length > 0) {
            return getFilteredMaps(q);
        }
        return query('data/maps');
    };


