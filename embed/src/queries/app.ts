
import { query } from 'sdi/shape';
import { fromNullable } from 'fp-ts/lib/Option';

export const getUserData =
    () => query('data/user');


export const getLayout =
    () => query('app/layout');


export const getMapInfo =
    () => fromNullable(query('data/map'));


export const getBaseLayer =
    () => getMapInfo().fold(
        () => null,
        m => m.baseLayer,
    );


export const getLayerId =
    () => query('app/layerId');

export const getFeatureId =
    () => query('app/featureId');


export const getDatasetMetadata =
    (id: string) => fromNullable(
        query('data/metadata')
            .find(md => md.id === id));

