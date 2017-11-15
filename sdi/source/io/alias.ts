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

export const IAliasIO = i({
    id: io.number,
    select: io.string,
    replace: MessageRecordIO,
}, 'IAliasIO');
export type IAliasIO = typeof IAliasIO;
export type IAlias = TypeOf<IAliasIO>;


export const IAliasCollectionIO = a(IAliasIO);

export type IAliasCollection = TypeOf<typeof IAliasCollectionIO>;
