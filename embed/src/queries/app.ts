
import { fromNullable } from 'fp-ts/lib/Option';
import { scopeOption } from 'sdi/lib';

import { query } from 'sdi/shape';

export const getUserData =
    () => query('data/user');


export const getMapInfo =
    () => fromNullable(query('data/map'));


export const getCurrentBaseLayerName =
    () => getMapInfo().fold(
        null,
        m => m.baseLayer,
    );

export const getBaseLayer =
    () => {
        const name = getCurrentBaseLayerName();
        const bls = query('data/baselayers');
        if (name && name in bls) {
            return bls[name];
        }
        return null;
    };

export const getLayerId =
    () => query('app/layerId');

export const getFeatureId =
    () => query('app/featureId');

export const getCurrentLayerInfo =
    () =>
        scopeOption()
            .let('info', getMapInfo())
            .let('lid', fromNullable(getLayerId()))
            .let('layer',
                ({ info, lid }) => fromNullable(info.layers.find(l => l.id === lid)))
            .pick('layer');

export const getCurrentFeature =
    () =>
        scopeOption()
            .let('lid', fromNullable(getLayerId()))
            .let('fid', fromNullable(getFeatureId()))
            .let('layer',
                ({ lid }) => fromNullable(query('data/layer').find(t => t[0] === lid)))
            .let('feature',
                ({ layer, fid }) => fromNullable(layer[1].features.find(f => f.id === fid)))
            .pick('feature');


export const getDatasetMetadata =
    (id: string) => fromNullable(
        query('data/metadata')
            .find(md => md.id === id));

