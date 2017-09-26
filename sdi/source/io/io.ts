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
 
import * as iots from 'io-ts';

export const i = iots.interface;
export const u = iots.union;
export const l = iots.literal;
export const a = iots.array;
export const t = iots.tuple;
export const p = iots.partial;
export type TypeOf<RT extends iots.Any> = iots.TypeOf<RT>;

// tslint:disable-next-line:variable-name
export const MessageRecordIO = iots.intersection([
    i({
        fr: iots.string,
        nl: iots.string,
    }),
    p({
        parameters: iots.dictionary(iots.string, iots.any),
    }),
]);

export type MessageRecord = iots.TypeOf<typeof MessageRecordIO>;


