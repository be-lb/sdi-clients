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


import { i, a, MessageRecordIO, TypeOf } from './io';
import * as io from 'io-ts';

export const IRoleIO = i({
    id: io.string,
    label: MessageRecordIO,
}, 'IRoleIO');
export type IRole = TypeOf<typeof IRoleIO>;



export const IUserIO = i({
    id: io.string,
    name: io.string,
    roles: a(IRoleIO),
    maps: a(io.string),
    layers: a(io.string),
}, 'IUserIO');
export type IUser = TypeOf<typeof IUserIO>;


export const CredentialsIO = i({
    username: io.string,
    password: io.string,
});
export type Credentials = TypeOf<typeof CredentialsIO>;
