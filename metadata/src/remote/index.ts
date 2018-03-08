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
    fetchPaginatedIO,
    IAliasCollection,
    IAliasCollectionIO,
    IMapInfo,
    IMapInfoIO,
    Inspire,
    InspireIO,
    ITimeserie,
    ITimeserieIO,
    IUser,
    IUserIO,
    postIO,
    TopicCategoryIO,
    TopicCategory,
    KeywordIO,
    Keyword,
} from 'sdi/source';


import * as io from 'io-ts';


const putOptions =
    (): RequestInit => ({
        method: 'PUT',
    });

export const fetchLayer = (url: string): Promise<FeatureCollection> => fetchIO(FeatureCollectionIO, url);
export const fetchMap = (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url);
export const fetchAlias = (url: string): Promise<IAliasCollection> => fetchIO(IAliasCollectionIO, url);
export const fetchUser = (url: string): Promise<IUser> => fetchIO(IUserIO, url);
export const fetchDatasetMetadata = (url: string): Promise<Inspire> => fetchIO(InspireIO, url);

export const fetchAllDatasetMetadata = (url: string) => fetchPaginatedIO(InspireIO, url);

export const fetchTimeserie = (url: string): Promise<ITimeserie> => fetchIO(ITimeserieIO, url);
export const fetchCategories = (url: string): Promise<Category[]> => fetchIO(CategoryCollectionIO, url);



// tslint:disable-next-line:variable-name
const UploadedIO = io.interface({
    id: io.string,
    url: io.string,
});

export type Uploaded = io.TypeOf<typeof UploadedIO>;
export const upload =
    (url: string, f: File): Promise<Uploaded> => {
        const data = new FormData();
        const options: RequestInit = {};

        data.append('file', f);
        options.body = data;

        return postIO(UploadedIO, url, null, options);
    };


export const putMetadata = (url: string, data: Inspire): Promise<Inspire> => postIO(InspireIO, url, data, putOptions());

export const fetchAllTopic = (url: string): Promise<TopicCategory[]> => fetchIO(io.array(TopicCategoryIO), url);
export const fetchAllKeyword = (url: string): Promise<Keyword[]> => fetchIO(io.array(KeywordIO), url);