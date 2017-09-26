

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
import { DIV, INPUT, A, IMG, P, H1 } from './elements';
import { AppLayout } from '../shape';
import events from '../events/mapnavigator';
import appEvents from '../events/app';
// import appQueries from '../queries/app';
import queries from '../queries/mapnavigator';
import tr, { fromRecord } from '../locale';
import { ChangeEvent } from 'react';
import { IMapInfo, Category } from 'sdi/source';
// import { stringify } from 'qs';

const logger = debug('sdi:mapnavigator');

export const renderTile =
    (category: Category) =>
        (map: IMapInfo) => {
            // const params = stringify({
            //     m: map.id,
            //     api: appQueries.getApiUrl(''),
            // });
            const url = `${map.id}`;
            return (
                DIV({ className: 'map-navigator-tile' },
                    A({ href: url, target: '_top' },
                        DIV({ className: 'category-title' }, fromRecord(category.name)),
                        IMG({ src: map.imageUrl }),
                        DIV({ className: 'map-title' }, fromRecord(map.title)),
                        P({}, fromRecord(map.description).substr(0, 200) + '...'),
                        DIV({ className: 'read-more' }))));
        };


export const renderCategory =
    (c: [Category, IMapInfo[]]) => c[1].map(renderTile(c[0]));

export const searchField = () => (
    DIV({
        className: 'input-wrapper map-navigator-search',
    },
        INPUT({
            type: 'search',
            name: 'search',
            placeholder: tr('search'),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                events.query(e.target.value);
                appEvents.setLayout(AppLayout.MapNavigatorFS);
            },
        }))
);

export const render = () => DIV({ className: 'map-navigator' },
    DIV({ className: 'map-navigator-category-container' },
        H1({}, tr('atlasEnv')),
        ...queries.getAll().map(renderCategory)));

export default render;

logger('loaded');
