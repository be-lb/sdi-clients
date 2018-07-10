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
import { IUgWsAddress } from 'sdi/ports/geocoder';
import { inputs, roof } from 'solar-sim';
import { } from 'sdi/source';

export type TypologyEnum =
    | 'closed'
    | 'detached'
    | 'apartments'
    | 'administrative'
    | 'collective'
    | 'industrial'
    ;
// State Augmentation

declare module 'sdi/shape' {
    export interface IShape {
        'data/solar-sim': roof[];
        'solar-sim/address': IUgWsAddress | null;
        'solar-sim/inputs': inputs;
    }
}
