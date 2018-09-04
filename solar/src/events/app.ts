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

import * as debug from 'debug';
import { fromNullable } from 'fp-ts/lib/Option';
import pointOnFeature from '@turf/point-on-feature';
import bbox from '@turf/bbox';

import { dispatch, query } from 'sdi/shape';
import { queryReverseGeocoder } from 'sdi/ports/geocoder';
import { getLang } from 'sdi/app';
import { defaultInteraction } from 'sdi/map';

import { FeatureCollection, Feature } from 'sdi/source';

import { AppLayout } from '../app';
import { fetchRoof, fetchGeom, fetchBuilding, fetchBaseLayerAll, fetchKey, fetchRoofIdentifiers } from '../remote';
import { updateRoofs } from './simulation';
import { Coordinate, Extent } from 'openlayers';
import { updateGeocoderResponse, addRoofLayer, clearRoofLayer } from './map';
import { navigatePreview } from './route';

const logger = debug('sdi:events/app');


export const setLayout =
    (l: AppLayout) => {
        dispatch('app/layout', state => state.concat([l]));
        if ('Locate' === l) {
            dispatch('port/map/interaction', () => ({ label: 'singleclick', state: null }));
        }
        else {
            dispatch('port/map/interaction', defaultInteraction);
        }
    };


const centerMap =
    (capakey: string) => {
        const geoms = query('solar/data/geoms');
        if (capakey in geoms) {
            const [minx, miny, maxx, maxy] = bbox(geoms[capakey]);
            const width = maxx - minx;
            const height = maxy - miny;
            const sideMax = Math.max(width, height);
            const sideMin = Math.min(width, height);
            const abbox: Extent = [
                minx - ((sideMax - sideMin) / 2),
                miny - ((sideMax - sideMin) / 2),
                minx + sideMax,
                miny + sideMax,
            ];

            dispatch('port/map/view', state => ({
                ...state,
                dirty: 'geo/extent',
                extent: abbox,
            }));
        }
    };

const createCollection =
    (fs: Feature[]): FeatureCollection => ({
        type: 'FeatureCollection',
        crs: {
            type: 'name',
            properties: {
                name: 'urn:ogc:def:crs:EPSG::31370',
            },
        },
        features: fs,
    });


const loadRoof =
    (capakey: string, r: (a: FeatureCollection) => void, s: () => void) => {
        const rids = query('solar/loading');
        if (rids.length > 0) {
            const rid = rids[0];
            fetchRoof(rid)
                .then((feature) => {
                    dispatch('solar/loading', ids => ids.filter(id => id !== rid));
                    dispatch('solar/loaded', ids => [...ids, rid]);
                    dispatch('solar/data/roofs', (state) => {
                        const ns = { ...state };
                        if (capakey in ns) {
                            ns[capakey].features = state[capakey].features.concat([feature]);
                        }
                        else {
                            ns[capakey] = createCollection([feature]);
                        }
                        return ns;
                    });
                })
                .then(() => loadRoof(capakey, r, s))
                .catch(s);
        }
        else {
            r(query('solar/data/roofs')[capakey]);
        }
    };

const loadRoofs =
    (capakey: string) =>
        fromNullable(query('solar/data/roofs')[capakey])
            .foldL(
                () => {
                    return fetchRoofIdentifiers(capakey)
                        .then(({ roofs }) => {
                            dispatch('solar/loading', () => roofs);
                            return (new Promise((solve, ject) => loadRoof(capakey, solve, ject)));
                        });
                },
                fc => Promise.resolve(fc),
        );


const loadGeometry =
    (capakey: string) =>
        fromNullable(query('solar/data/geoms')[capakey])
            .foldL(
                () => fetchGeom(capakey).then((fc) => {
                    dispatch('solar/data/geoms', state => ({ ...state, [capakey]: fc }));
                    return fc;
                }),
                fc => Promise.resolve(fc),
        );

const loadBuildings =
    (capakey: string) =>
        fromNullable(query('solar/data/buildings')[capakey])
            .foldL(
                () => fetchBuilding(capakey).then((fc) => {
                    dispatch('solar/data/buildings', state => ({ ...state, [capakey]: fc }));
                    return fc;
                }),
                fc => Promise.resolve(fc),
        );


const checkAddress =
    (ck: string) => {
        logger('checkAddress');
        const a = query('solar/address');
        if (a) {
            return Promise.resolve();
        }
        const gs = query('solar/data/geoms');
        if (!(ck in gs)) {
            return Promise.reject();
        }
        const { geometry } = pointOnFeature(gs[ck]);
        if (null === geometry) {
            return Promise.reject();
        }
        const [x, y] = geometry.coordinates;
        return (new Promise((resolve, reject) => {
            queryReverseGeocoder(x, y, getLang())
                .then((response) => {
                    if (!response.error) {
                        logger(`Got address ${response.result.address}`);
                        dispatch('solar/address', () => response.result.address);
                        resolve();
                    }
                    else {
                        reject();
                    }
                })
                .catch(reject);
        }));
    };

export const loadCoordinate =
    (coord: Coordinate) => {
        queryReverseGeocoder(coord[0], coord[1], getLang())
            .then((response) => {
                if (!response.error) {
                    dispatch('solar/address', () => response.result.address);
                    updateGeocoderResponse(null);
                    fetchKey(coord[0], coord[1])
                        .then(({ capakey }) => navigatePreview(capakey))
                        .catch((err: string) => {
                            logger(`Could not fetch a capakey: ${err}`);
                        });
                }
            });
    };

export const loadCapakey =
    (capakey: string) => {
        clearRoofLayer();
        dispatch('app/capakey', () => capakey);
        dispatch('solar/loading', () => []);
        dispatch('solar/loaded', () => []);
        const loaders = [
            loadRoofs(capakey),
            loadGeometry(capakey),
            loadBuildings(capakey),
        ];
        Promise.all(loaders)
            .then(() => updateRoofs(capakey))
            .then(() => centerMap(capakey))
            .then(() => addRoofLayer(capakey))
            .then(() => {
                checkAddress(capakey);
            });

    };

export const loadAllBaseLayers =
    (url: string) => {
        fetchBaseLayerAll(url)
            .then((blc) => {
                dispatch('data/baselayers', () => blc);
            });
    };

logger('loaded');
