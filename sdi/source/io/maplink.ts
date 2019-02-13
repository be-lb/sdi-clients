/*
 *  Copyright (C) 2019 Atelier Cartographique <contact@atelier-cartographique.be>
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


import { i, a, TypeOf } from './io';
import * as io from 'io-ts';

export const MapLinkIO = i({
    id: io.string,
    source: io.string,
    target: io.string,
}, 'MapLinkIO');
export type MapLinkIO = typeof MapLinkIO;
export type MapLink = TypeOf<MapLinkIO>;

export const MapLinkListIO = a(MapLinkIO);

export type MapLinkList = TypeOf<typeof MapLinkListIO>;
