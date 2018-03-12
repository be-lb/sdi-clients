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
    Attachment,
    AttachmentIO,
    deleteIO,
    fetchPaginatedIO,
    fetchWithoutValidationIO,
    IMapBaseLayer,
    IMapBaseLayerIO,
    defaultFetchOptions,
} from 'sdi/source';


import * as io from 'io-ts';
// import { getCSRF } from 'sdi/app';



const putOptions =
    (): RequestInit => ({
        method: 'PUT',
    });


export const fetchLayer =
    (url: string): Promise<FeatureCollection> =>
        fetchWithoutValidationIO(url);

export const fetchMap =
    (url: string): Promise<IMapInfo> =>
        fetchIO(IMapInfoIO, url);

export const fetchBaseLayer =
    (url: string): Promise<IMapBaseLayer> =>
        fetchIO(IMapBaseLayerIO, url);

export const fetchAlias =
    (url: string): Promise<IAliasCollection> =>
        fetchIO(IAliasCollectionIO, url);

export const fetchUser =
    (url: string): Promise<IUser> =>
        fetchIO(IUserIO, url);

export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> =>
        fetchIO(InspireIO, url);

export const fetchAllDatasetMetadata =
    (url: string) =>
        fetchPaginatedIO(InspireIO, url);

export const fetchTimeserie =
    (url: string): Promise<ITimeserie> =>
        fetchIO(ITimeserieIO, url);

export const fetchCategories =
    (url: string): Promise<Category[]> =>
        fetchIO(CategoryCollectionIO, url);

export const fetchAttachment =
    (url: string): Promise<Attachment> =>
        fetchIO(AttachmentIO, url);


export const postAttachment =
    (url: string, data: Partial<Attachment>): Promise<Attachment> =>
        postIO(AttachmentIO, url, data);

export const putAttachment =
    (url: string, data: Attachment): Promise<Attachment> =>
        postIO(AttachmentIO, url, data, putOptions());

export const delAttachment =
    (url: string): Promise<void> => deleteIO(url);


export const putMap =
    (url: string, data: IMapInfo): Promise<IMapInfo> =>
        postIO(IMapInfoIO, url, data, putOptions());

export const postMap =
    (url: string, data: IMapInfo): Promise<IMapInfo> =>
        postIO(IMapInfoIO, url, data);

export const deleteMap =
    (url: string): Promise<void> =>
        deleteIO(url);

export const postLayerInfo =
    (url: string, data: ILayerInfo): Promise<ILayerInfo> => postIO(ILayerInfoIO, url, data);

export const postLayer =
    (url: string, data: FeatureCollection): Promise<FeatureCollection> =>
        postIO(FeatureCollectionIO, url, data);

export const postUser =
    (url: string, data: IUser): Promise<IUser> =>
        postIO(IUserIO, url, data);



// tslint:disable-next-line:variable-name
const UploadedIO = io.interface({
    id: io.string,
    url: io.string,
});

export type Uploaded = io.TypeOf<typeof UploadedIO>;
export const upload =
    (url: string, f: File): Promise<Uploaded> => {
        const options = defaultFetchOptions();
        const data = new FormData();
        data.append('file', f);
        options.body = data;
        const headers = options.headers as Headers;
        if (headers) {
            headers.delete('Content-Type');
        }

        return postIO(UploadedIO, url, null, options);
    };
