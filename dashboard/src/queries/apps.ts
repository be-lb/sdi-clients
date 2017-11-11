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
import { Branded, brand } from 'sdi/lib';


const Black = Branded<string, 'white' | 'black'>((a) => {
    switch (brand(a)) {
        case 'black': return a.toString();
        case 'white': return a.split('').map(_ => '.').join('');
    }
})('black');

const blackList = [Black('default'), Black('login')];
const ex = Black.map(b => b);

export const getApps =
    () =>
        query('component/apps')
            .filter(a => {
                return blackList.map(b => ex(b)).indexOf(a.codename) === -1;
                // // Black.op(a => ) blackList.indexOf(a.codename) === -1
                // const op = Black.map(b => b === a.codename);
                // const ex = Black.map(b => b);
                // const r = blackList.findIndex(b => op(b)) < 0;
                // return r;
            });
