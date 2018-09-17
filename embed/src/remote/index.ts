

import {
    fetchIO,
    IUser,
    IUserIO,
    IMapInfo,
    IMapInfoIO,
    Inspire,
    InspireIO,
    FeatureCollection,
    ITimeserieIO,
    ITimeserie,
    IMapBaseLayer,
    IMapBaseLayerIO,
    fetchWithoutValidationIO,
    IAliasCollection,
    IAliasCollectionIO,
} from 'sdi/source';



export const fetchUser =
    (url: string): Promise<IUser> =>
        fetchIO(IUserIO, url);

export const fetchMap =
    (url: string): Promise<IMapInfo> =>
        fetchIO(IMapInfoIO, url);

export const fetchBaseLayer =
    (url: string): Promise<IMapBaseLayer> =>
        fetchIO(IMapBaseLayerIO, url);

export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> =>
        fetchIO(InspireIO, url);

export const fetchAlias =
    (url: string): Promise<IAliasCollection> => fetchIO(IAliasCollectionIO, url);

export const fetchLayer =
    (url: string): Promise<FeatureCollection> =>
        fetchWithoutValidationIO(url);

export const fetchTimeserie =
    (url: string): Promise<ITimeserie> =>
        fetchIO(ITimeserieIO, url);
