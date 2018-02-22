import { fromNullable } from 'fp-ts/lib/Option';

import { queryK, dispatch } from 'sdi/shape';
import { scopeOption } from 'sdi/lib';
import { getApiUrl } from 'sdi/app';
import { IMapInfo, getMessageRecord, Inspire, ILayerInfo, MessageRecord } from 'sdi/source';
import { removeLayerAll, addLayer } from 'sdi/map';

import { fetchUser, fetchMap, fetchDatasetMetadata, fetchLayer, fetchBaseLayer } from '../remote';
import { viewEvents } from './map';


export const loadUser =
    (url: string) =>
        fetchUser(url)
            .then((user) => {
                dispatch('data/user', () => user);
            });



export const setCurrentFeatureById =
    (lid: string, fid: string | number) => {
        dispatch('app/layerId', () => lid);
        dispatch('app/featureId', () => fid);
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
            .let('minx', fromNullable(getNumber(r[1])))
            .let('miny', fromNullable(getNumber(r[2])))
            .let('maxx', fromNullable(getNumber(r[3])))
            .let('maxy', fromNullable(getNumber(r[4])))
            .map(({ minx, miny, maxx, maxy }) => {
                viewEvents.updateMapView({
                    dirty: 'geo/extent',
                    extent: [minx, miny, maxx, maxy],
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
                    () => layer,
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


export const setCustomTitle =
    (customTitle: MessageRecord) =>
        dispatch('component/print',
            s => ({ ...s, customTitle }));

export const resetCustomTitle =
    () =>
        dispatch('component/print',
            s => ({ ...s, customTitle: null }));
