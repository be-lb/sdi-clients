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
import tr from 'sdi/locale';

import { bookmarkLayerName, bookmarkLayerInfo, bookmarkLayerID, defaultBookmarks, bookmarkMetadataID, bookmarkMetadata } from '../components/bookmark';
import { getBookmarks } from '../queries/bookmark';


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
        dispatch('data/layers', (state) => {
            const fc = (bookmarkLayerID in state) ? state[bookmarkLayerID] : defaultBookmarks();

            const n = fc.features.length + 1;
            const name = `${tr('bookmark')} ${n}`;
            fc.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: pos,
                },
                properties: { name },
                id: `ID_${n}`,
            });
            return { ...state, [bookmarkLayerID]: fc };
        });
        updateBookmarks();
    };

export const removeBookmark =
    (name: string) => {
        dispatch('data/layers', (state) => {
            const fc = (bookmarkLayerID in state) ? state[bookmarkLayerID] : defaultBookmarks();
            const features = fc.features.filter(f => getFeatureProp(f, 'name', '') !== name);
            const newFc = { ...fc, features };
            return { ...state, [bookmarkLayerID]: newFc };
        });
        updateBookmarks();
    };



export const addBookmarksToMap =
    () => {
        dispatch('data/datasetMetadata', state => ({ ...state, [bookmarkMetadataID]: bookmarkMetadata }));
        dispatch('data/maps', maps => maps.map(m => ({
            ...m,
            layers: m.layers.filter(l => l.id !== bookmarkLayerID).concat([bookmarkLayerInfo]),
        })));
        addLayer(
            () => ({
                name: bookmarkLayerName,
                info: bookmarkLayerInfo,
                metadata: bookmarkMetadata,
            }),
            () => right(some(getBookmarks())));
    };
