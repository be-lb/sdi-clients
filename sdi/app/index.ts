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

import { dispatch, query } from '../shape';
import { fromNullable } from 'fp-ts/lib/Option';


// events
export const setLang = (l: 'fr' | 'nl') => {
    document.body.setAttribute('lang', l);
    dispatch('app/lang', () => l);
};


// queries
export const getUserId = () => fromNullable(query('app/user'));

export const getApiUrl = (path: string) => `${query('app/api-root')}${path}`;

export const getLang = () => query('app/lang');

export const getCSRF = () => fromNullable(query('app/csrf'));

export const getRoot = () => query('app/root');

