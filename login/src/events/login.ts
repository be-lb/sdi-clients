
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
import { dispatchK, dispatch } from './index';
import {
    loginUser,
} from '../remote';
import queries from '../queries/app';
import { getCredentials } from '../queries/login';

const logger = debug('sdi:events/login');

const login = dispatchK('component/login');

export const setUsername =
    (username: string) => login(
        s => ({ ...s, credentials: { ...s.credentials, username } }));

export const setPassword =
    (password: string) => login(
        s => ({ ...s, credentials: { ...s.credentials, password } }));

export const tryLogin =
    () => (
        loginUser(queries.getApiUrl('auth/login'), getCredentials())
            .then(u => dispatch('data/user', () => u)));

logger('loaded');
