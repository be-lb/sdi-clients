

import {
    fetchIO,
    IUser,
    IUserIO,
    IMapInfo,
    IMapInfoIO,
    Inspire,
    InspireIO,
    FeatureCollection,
    FeatureCollectionIO,
    ITimeserieIO,
    ITimeserie,
} from 'sdi/source';



export const fetchUser =
    (url: string): Promise<IUser> =>
        fetchIO(IUserIO, url);

export const fetchMap =
    (url: string): Promise<IMapInfo> =>
        fetchIO(IMapInfoIO, url);

export const fetchDatasetMetadata =
    (url: string): Promise<Inspire> =>
        fetchIO(InspireIO, url);

export const fetchLayer =
    (url: string): Promise<FeatureCollection> =>
        fetchIO(FeatureCollectionIO, url);

export const fetchTimeserie =
    (url: string): Promise<ITimeserie> =>
        fetchIO(ITimeserieIO, url);
