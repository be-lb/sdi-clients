
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


import { dispatchK, dispatch } from 'sdi/shape';
import { viewEventsFactory, scaleEventsFactory } from 'sdi/map';
import { IUgWsResponse } from 'sdi/ports/geocoder';
import { IMapInfo } from 'sdi/source';


export const scalelineEvents = scaleEventsFactory(dispatchK('port/map/scale'));
export const viewEvents = viewEventsFactory(dispatchK('port/map/view'));

export const updateGeocoderResponse =
    (serviceResponse: IUgWsResponse | null) =>
        dispatch('component/geocoder/response', () => serviceResponse);

export const clearGeocoderResponse = () => updateGeocoderResponse(null);

export const updateGeocoderTerm =
    (address: string) =>
        dispatch('component/geocoder/input', () => address);


const mapTemplate =
    (): IMapInfo => ({
        id: 'solar-locate',
        url: '/dev/null/solar-locate',
        lastModified: 1523599299611,
        status: 'published',
        title: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        description: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        baseLayer: 'urbis.irisnet.be/urbis_gray',
        categories: [],
        attachments: [],
        layers: [],
    });


export const loadLocateMap =
    () => {
        dispatch('app/current-map', () => 'solar-locate');
        dispatch('data/maps',
            state => state.concat([mapTemplate()]));
    };
