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


import { constantsIO } from 'solar-sim';

import {
    fetchIO, IMapInfo, IMapInfoIO, FeatureCollection, fetchWithoutValidationIO, IMapBaseLayer, IMapBaseLayerIO, InspireIO, Inspire, FeatureIO, FeatureCollectionIO,
} from 'sdi/source';
import { getApiUrl } from 'sdi/app';

import { CapakeyIO, BaseLayerCollection, BaseLayerCollectionIO, WidgetDescriptionIO } from './io';




export const fetchKey =
    (longitude: number, latitude: number) => {
        const url = getApiUrl(`geodata/solar/key/${longitude}/${latitude}`);
        return fetchIO(CapakeyIO, url);
    };

export const fetchRoofs =
    (capakey: string) => {
        const url = getApiUrl(`geodata/solar/roofs/${capakey}/`);
        return fetchIO(FeatureCollectionIO, url);
    };

export const fetchRoof =
    (roofId: number) => {
        const url = getApiUrl(`geodata/solar/radiations/${roofId}/`);
        return fetchIO(FeatureIO, url);
    };


export const fetchGeom =
    (capakey: string) => {
        const url = getApiUrl(`geodata/solar/geom/for/${capakey}/`);
        return fetchIO(FeatureCollectionIO, url);
    };


export const fetchBuilding =
    (capakey: string) => {
        const url = getApiUrl(`geodata/solar/3d/for/${capakey}/`);
        return fetchIO(FeatureCollectionIO, url);
    };



export const fetchLayer =
    (url: string): Promise<FeatureCollection> => fetchWithoutValidationIO(url);

export const fetchBaseLayer =
    (url: string): Promise<IMapBaseLayer> => fetchIO(IMapBaseLayerIO, url);

export const fetchMap =
    (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url);


export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> => fetchIO(InspireIO, url);


export const fetchBaseLayerAll =
    (url: string): Promise<BaseLayerCollection> => fetchIO(BaseLayerCollectionIO, url);

export const fetchConstants =
    (url: string) => fetchIO(constantsIO, url);

export const fetchNotes =
    (url: string) => fetchIO(WidgetDescriptionIO, url);
