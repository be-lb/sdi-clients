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


import {
    fetchIO, IMapInfo, IMapInfoIO, FeatureCollection, fetchWithoutValidationIO, IMapBaseLayer, IMapBaseLayerIO, InspireIO, Inspire,
} from 'sdi/source';




export const fetchLayer =
    (url: string): Promise<FeatureCollection> => fetchWithoutValidationIO(url);

export const fetchBaseLayer =
    (url: string): Promise<IMapBaseLayer> => fetchIO(IMapBaseLayerIO, url);

export const fetchMap =
    (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url);


export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> => fetchIO(InspireIO, url);
