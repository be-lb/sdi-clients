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

import * as io from 'io-ts';

import {
    // Credentials,
    fetchIO,
    IUser,
    IUserIO,
    postIO,
    IAlias,
    IAliasIO,
    // fetchPaginatedIO,
    deleteIO,
} from 'sdi/source';
import { getCSRF } from 'sdi/app';


const fetchOptions =
    (): RequestInit => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        getCSRF().map(csrf => headers.append('X-CSRFToken', csrf));

        return {
            credentials: 'same-origin',
            headers,
        };
    };


const putOptions =
    (): RequestInit => ({
        method: 'PUT',
        ...fetchOptions(),
    });


export const fetchUser =
    (url: string): Promise<IUser> =>
        fetchIO(IUserIO, url);

export const fetchAllAlias =
    (url: string) =>
        fetchIO(io.array(IAliasIO), url, fetchOptions());

export const postAlias =
    (url: string, data: Partial<IAlias>): Promise<IAlias> =>
        postIO(IAliasIO, url, data, fetchOptions());

export const putAlias =
    (url: string, data: IAlias): Promise<IAlias> =>
        postIO(IAliasIO, url, data, putOptions());


export const delAlias =
    (url: string): Promise<void> =>
        deleteIO(url, fetchOptions());
