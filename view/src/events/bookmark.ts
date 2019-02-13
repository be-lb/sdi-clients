/*
 *  Copyright (C) 2019 Atelier Cartographique <contact@atelier-cartographique.be>
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

import { right, left, Either } from 'fp-ts/lib/Either';
import { some } from 'fp-ts/lib/Option';
import { Coordinate } from 'openlayers';

import { dispatch, query } from 'sdi/shape';
import { getFeatureProp } from 'sdi/source';
import { addLayer, removeLayer } from 'sdi/map';

import { bookmarkLayerName, bookmarkLayerInfo, bookmarkLayerID } from '../components/bookmark';


const updateBookmarks =
    () => {
        removeLayer(bookmarkLayerID);
        addBookmarksToMap();
    };


export const addBookmarkFromMark =
    (): Either<boolean, boolean> => {
        const interaction = query('port/map/interaction');
        if (interaction.label === 'mark') {
            const pos = interaction.state.coordinates;
            addBookmark(pos);
            return right(true);
        }
        return left(false);
    };

export const addBookmark =
    (pos: Coordinate) => {
        dispatch('component/bookmark', (state) => {
            const name = `Bookmark ${state.features.length}`;
            state.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: pos,
                },
                properties: { name },
                id: `ID_${state.features.length + 1}`,
            });
            return state;
        });
        updateBookmarks();
    };

export const removeBookmark =
    (name: string) => {
        dispatch('component/bookmark', (state) => {
            const features = state.features.filter(f => getFeatureProp(f, 'name', '') !== name);
            return { ...state, features };
        });
        updateBookmarks();
    };



export const addBookmarksToMap =
    () => {
        dispatch('data/maps', maps => maps.map(m => ({
            ...m,
            layers: m.layers.filter(l => l.id !== bookmarkLayerID).concat([bookmarkLayerInfo]),
        })));
        addLayer(
            () => ({
                name: bookmarkLayerName,
                info: bookmarkLayerInfo,
                metadata: null,
            }),
            () => right(some(query('component/bookmark'))));
    };
