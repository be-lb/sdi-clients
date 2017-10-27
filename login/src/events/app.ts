
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

import { dispatch } from 'sdi/shape';

import { AppLayout } from '../app';
import { fetchUser } from '../remote';

const logger = debug('sdi:events/app');

export const loadUser =
    (url: string) =>
        fetchUser(url)
            .then((user) => {
                dispatch('data/user', () => user);
                setLayout('Logout');
            });


export const setLayout =
    (l: AppLayout) =>
        dispatch('app/layout', state => state.concat([l]));

logger('loaded');
