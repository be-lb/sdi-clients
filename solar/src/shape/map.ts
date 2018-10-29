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

import { IMapInfo, IMapBaseLayer, MessageRecord } from 'sdi/source';
import { IUgWsResponse } from 'sdi/ports/geocoder';
import { IMapViewData, Interaction, IMapScale } from 'sdi/map';


// State Augmentation

declare module 'sdi/shape' {
    export interface IShape {
        'component/geocoder/response': IUgWsResponse | null;
        'component/geocoder/input': string;

        'port/map/view': IMapViewData;
        'port/map/interaction': Interaction;
        'port/map/loading': MessageRecord[];
        'port/map/scale': IMapScale;

        'data/maps': IMapInfo[];
        'data/baselayers': { [k: string]: IMapBaseLayer };
    }
}
