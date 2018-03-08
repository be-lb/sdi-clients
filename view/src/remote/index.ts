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

import { FeatureCollection, IMapInfoIO, IMapInfo, IAliasCollection, IAliasCollectionIO, IUserIO, IUser, InspireIO, Inspire, ITimeserieIO, ITimeserie, fetchIO, Category, CategoryCollectionIO, AttachmentIO, Attachment, fetchPaginatedIO, fetchWithoutValidationIO, IMapBaseLayer, IMapBaseLayerIO } from 'sdi/source';

import * as io from 'io-ts';



const mapArray = io.array(IMapInfoIO);

const BaseLayerCollectionIO = io.dictionary(io.string, IMapBaseLayerIO, 'BaseLayerCollection');
type BaseLayerCollection = io.TypeOf<typeof BaseLayerCollectionIO>;

export const fetchLayer =
    (url: string): Promise<FeatureCollection> => fetchWithoutValidationIO(url);
export const fetchBaseLayer =
    (url: string): Promise<IMapBaseLayer> => fetchIO(IMapBaseLayerIO, url);
export const fetchBaseLayerAll =
    (url: string): Promise<BaseLayerCollection> => fetchIO(BaseLayerCollectionIO, url);
export const fetchAllMaps =
    (url: string): Promise<IMapInfo[]> => fetchIO(mapArray, url);
export const fetchMap =
    (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url);
export const fetchAlias =
    (url: string): Promise<IAliasCollection> => fetchIO(IAliasCollectionIO, url);
export const fetchUser =
    (url: string): Promise<IUser> => fetchIO(IUserIO, url);

export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> => fetchIO(InspireIO, url);
export const fetchAllDatasetMetadata =
    (url: string) => fetchPaginatedIO(InspireIO, url);

export const fetchTimeserie =
    (url: string): Promise<ITimeserie> => fetchIO(ITimeserieIO, url);
export const fetchCategories =
    (url: string): Promise<Category[]> => fetchIO(CategoryCollectionIO, url);
export const fetchAttachment =
    (url: string): Promise<Attachment> => fetchIO(AttachmentIO, url);



