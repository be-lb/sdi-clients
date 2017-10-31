

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

import { DIV, INPUT, IMG, P, H1 } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { IMapInfo } from 'sdi/source';

import { queryMaps } from '../events/mapnavigator';
import { navigateMap } from '../events/route';
import { getMaps } from '../queries/mapnavigator';

const logger = debug('sdi:mapnavigator');

// export const renderTile =
//     (category: Category) =>
//         (map: IMapInfo) => {
//             const mid = map.id;
//             return (
//                 DIV({ className: 'map-navigator-tile' },
//                     DIV({
//                         onClick: () => mid ? navigateMap(mid) : null,
//                     }, DIV({ className: 'category-title' }, fromRecord(category.name)),
//                         IMG({ src: map.imageUrl }),
//                         DIV({ className: 'map-title' }, fromRecord(map.title)),
//                         P({}, fromRecord(map.description).substr(0, 200) + '...'),
//                         DIV({ className: 'read-more' }))));
//         };


// export const renderCategory =
//     (c: [Category, IMapInfo[]]) => c[1].map(renderTile(c[0]));

export const searchField = () => (
    DIV({
        className: 'input-wrapper map-navigator-search',
    },
        INPUT({
            key: 'map-navigator-search-input',
            type: 'search',
            name: 'search',
            placeholder: tr('searchAtlas'),
            onChange: e => queryMaps(e.target.value.trim()),
        }))
);

const renderMap =
    (map: IMapInfo) => {
        const mid = map.id;
        return (
            DIV({
                key: mid,
                className: 'map-navigator-tile',
            },
                DIV({
                    onClick: () => mid ? navigateMap(mid) : null,
                },
                    IMG({ src: map.imageUrl }),
                    DIV({ className: 'map-title' }, fromRecord(map.title)),
                    P({}, fromRecord(map.description).substr(0, 200) + '...'),
                    DIV({ className: 'read-more' }))));
    };

const renderMaps =
    () => getMaps().map(renderMap);

export const render = () =>
    DIV({ className: 'map-navigator' },
        H1({}, tr('mapList')),
        searchField(),
        DIV({ className: 'maps-container' }, renderMaps()));

export default render;

logger('loaded');
