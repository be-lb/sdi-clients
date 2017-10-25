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
    Category,
    CategoryCollectionIO,
    FeatureCollection,
    FeatureCollectionIO,
    fetchIO,
    IAliasCollection,
    IAliasCollectionIO,
    ILayerInfo,
    ILayerInfoIO,
    IMapInfo,
    IMapInfoIO,
    Inspire,
    InspireIO,
    ITimeserie,
    ITimeserieIO,
    IUser,
    IUserIO,
    postIO,
} from 'sdi/source';


import * as io from 'io-ts';
import { getCSRF } from 'sdi/app';


const fetchOptions =
    (): RequestInit => {
        const headers = new Headers();
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

export const fetchLayer = (url: string): Promise<FeatureCollection> => fetchIO(FeatureCollectionIO, url, fetchOptions());
export const fetchMap = (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url, fetchOptions());
export const fetchAlias = (url: string): Promise<IAliasCollection> => fetchIO(IAliasCollectionIO, url, fetchOptions());
export const fetchUser = (url: string): Promise<IUser> => fetchIO(IUserIO, url);
export const fetchDatasetMetadata = (url: string): Promise<Inspire> => fetchIO(InspireIO, url, fetchOptions());
export const fetchAllDatasetMetadata = (url: string): Promise<Inspire[]> => fetchIO(io.array(InspireIO), url, fetchOptions());
export const fetchTimeserie = (url: string): Promise<ITimeserie> => fetchIO(ITimeserieIO, url, fetchOptions());
export const fetchCategories = (url: string): Promise<Category[]> => fetchIO(CategoryCollectionIO, url, fetchOptions());


export const putMap = (url: string, data: IMapInfo): Promise<IMapInfo> => postIO(IMapInfoIO, url, data, putOptions());
export const postMap = (url: string, data: IMapInfo): Promise<IMapInfo> => postIO(IMapInfoIO, url, data, fetchOptions());

export const postLayerInfo =
    (url: string, data: ILayerInfo): Promise<ILayerInfo> => postIO(ILayerInfoIO, url, data, fetchOptions());

export const postLayer = (url: string, data: FeatureCollection): Promise<FeatureCollection> => postIO(FeatureCollectionIO, url, data, fetchOptions());
export const postUser = (url: string, data: IUser): Promise<IUser> => postIO(IUserIO, url, data, fetchOptions());



// tslint:disable-next-line:variable-name
const UploadedIO = io.interface({
    id: io.string,
    url: io.string,
});

export type Uploaded = io.TypeOf<typeof UploadedIO>;
export const upload =
    (url: string, f: File): Promise<Uploaded> => {
        const data = new FormData();
        const headers = new Headers();
        const options: RequestInit = {};

        getCSRF().map(csrf => headers.append('X-CSRFToken', csrf));
        data.append('file', f);
        // headers.append('Content-Type', null);
        options.credentials = 'same-origin';
        options.headers = headers;
        options.body = data;

        return postIO(UploadedIO, url, null, options);
    };
