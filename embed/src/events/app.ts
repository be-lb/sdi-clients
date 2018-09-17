import { fromNullable, some } from 'fp-ts/lib/Option';
import { right } from 'fp-ts/lib/Either';

import { queryK, dispatch } from 'sdi/shape';
import { scopeOption } from 'sdi/lib';
import { getApiUrl } from 'sdi/app';
import { IMapInfo, getMessageRecord, Inspire, ILayerInfo } from 'sdi/source';
import { removeLayerAll, addLayer } from 'sdi/map';

import { fetchUser, fetchMap, fetchDatasetMetadata, fetchLayer, fetchBaseLayer, fetchAlias } from '../remote';
import { viewEvents } from './map';
import { AppLayout } from '../shape';


export const loadUser =
    (url: string) =>
        fetchUser(url)
            .then((user) => {
                dispatch('data/user', () => user);
            });

export const setLayout =
    (l: AppLayout) => dispatch('app/layout', () => l);

export const setCurrentFeatureById =
    (lid: string, fid: string | number) => {
        dispatch('app/layerId', () => lid);
        dispatch('app/featureId', () => fid);
    };

export const unsetCurrentFeature =
    () => {
        dispatch('app/layerId', () => null);
        dispatch('app/featureId', () => null);
    };

// Very simple route mod

const getRoute = queryK('app/route');

const cleanRoute =
    () => getRoute()
        .reduce((acc, s) => {
            if (s.length > 0) {
                return acc.concat([s]);
            }
            return acc;
        }, [] as string[]);

const getNumber =
    (s?: string) => {
        if (s) {
            const n = parseFloat(s);
            if (!Number.isNaN(n)) {
                return n;
            }
        }
        return null;
    };

const setMapView =
    () => {
        const r = cleanRoute();
        scopeOption()
            .let('lat', fromNullable(getNumber(r[1])))
            .let('lon', fromNullable(getNumber(r[2])))
            .let('zoom', fromNullable(getNumber(r[3])))
            .map(({ lat, lon, zoom }) => {
                viewEvents.updateMapView({
                    dirty: 'geo',
                    center: [lat, lon],
                    zoom,
                });
            });
    };


const loadLayer =
    (info: ILayerInfo, metadata: Inspire) => {
        const id = metadata.uniqueResourceIdentifier;
        const url = getApiUrl(`layers/${id}`);

        fetchLayer(url)
            .then((layer) => {
                dispatch('data/layer', state => state.concat([[info.id, layer]]));
                addLayer(
                    () => ({
                        name: getMessageRecord(metadata.resourceTitle),
                        info,
                        metadata,
                    }),
                    () => right(some(layer)),
                );
            });
    };

export const loadBaseLayer =
    (id: string, url: string) => {
        fetchBaseLayer(url)
            .then((bl) => {
                dispatch('data/baselayers', state => ({ ...state, [id]: bl }));
            });
    };

const loadMetadata =
    (info: IMapInfo) => {
        removeLayerAll();
        info.layers.forEach((layerInfo) => {
            const url = getApiUrl(`metadatas/${layerInfo.metadataId}`);
            fetchDatasetMetadata(url)
                .then((md) => {
                    dispatch('data/metadata', state => state.concat([md]));
                    loadLayer(layerInfo, md);
                });
        });
    };

export const loadAlias =
    (url: string) =>
        fetchAlias(url)
            .then((alias) => {
                dispatch('data/alias', () => alias);
            });


const loadMap =
    (mid: string) =>
        fetchMap(getApiUrl(`maps/${mid}`))
            .then((info) => {
                dispatch('data/map', () => info);
                loadMetadata(info);
            });


export const initMap =
    () => {
        const r = cleanRoute();
        if (r.length > 0) {
            loadMap(r[0]);
            setMapView();
        }
        else {
            // TODO
        }
    };
