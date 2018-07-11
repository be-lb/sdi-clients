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

import { dispatch, query } from 'sdi/shape';
import { getApiUrl } from 'sdi/app';

import { AppLayout } from '../app';
import { fetchMap, fetchRoof } from '../remote';

const logger = debug('sdi:events/app');


export const setLayout =
    (l: AppLayout) =>
        dispatch('app/layout', state => state.concat([l]));

export const startMap =
    () =>
        fromNullable(query('app/current-map'))
            .map((mid) => {
                fetchMap(getApiUrl(`/maps/${mid}`))
                    .then(
                        info => dispatch('data/maps',
                            state => ({ ...state, [mid]: info })));
            });

const loadRoofs =
    (capakey: string) =>
        fromNullable(query('solar/data/roofs')[capakey])
            .foldL(
                () => fetchRoof(capakey).then((fc) => {
                    dispatch('solar/data/roofs', state => ({ ...state, [capakey]: fc }))
                    return fc;
                }),
                fc => Promise.resolve(fc)
            );


const loadGeometry =
    (capakey: string) =>
        fromNullable(query('solar/data/geoms')[capakey])
            .foldL(
                () => fetchRoof(capakey).then((fc) => {
                    dispatch('solar/data/geoms', state => ({ ...state, [capakey]: fc }))
                    return fc;
                }),
                fc => Promise.resolve(fc)
            );

const loadBuildings =
    (capakey: string) =>
        fromNullable(query('solar/data/buildings')[capakey])
            .foldL(
                () => fetchRoof(capakey).then((fc) => {
                    dispatch('solar/data/buildings', state => ({ ...state, [capakey]: fc }))
                    return fc;
                }),
                fc => Promise.resolve(fc)
            );

export const loadCapakey =
    (capakey: string) => {
        dispatch('app/capakey', () => capakey);
        loadRoofs(capakey)
        loadGeometry(capakey)
        loadBuildings(capakey)
    };

logger('loaded');
