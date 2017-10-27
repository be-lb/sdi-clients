
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
import { fromNullable } from 'fp-ts/lib/Option';

import { dispatchK, dispatch } from 'sdi/shape';
import { getRoot, getApiUrl } from 'sdi/app';

import {
    loginUser, logoutUser,
} from '../remote';
import { getCredentials, getNext } from '../queries/login';

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
        loginUser(getApiUrl('auth/login'), getCredentials())
            .then(u => dispatch('data/user', () => u))
            .then(() => {
                fromNullable(getNext()).map(next => window.location.assign(next));
            }));

export const tryLogout =
    () => (
        logoutUser(getApiUrl('auth/logout'))
            .then(() => window.location.assign(getRoot())));

logger('loaded');
