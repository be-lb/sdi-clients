
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

import { DIV, SPAN } from 'sdi/components/elements';
import queries from '../../queries/app';
import events from '../../events/app';
import tr, { fromRecord, formatDate } from 'sdi/locale';
import { AppLayout } from '../../shape/types';
import { button } from '../button';
import { ReactNode } from 'react';


const selectMap = (mid?: string) => () => {
    if (mid) {
        events.setCurrentMapId(mid);
        events.setLayout(AppLayout.MapAndInfo);
    }
};

const addMap = () => {
    events.newMap();
};

const editButton = button('edit', 'editMap');
const addButton = button('add', 'add');

const renderAdd = () => (
    DIV({ className: 'dashboard-map-item add' },
        DIV({ className: 'dashboard-map-title' },
            SPAN({}, tr('newMap'))),
        addButton(addMap))
);

const renderItems = (maps: string[]) => {

    return (
        maps.map((mid) => {
            const map = queries.getMap(mid);
            if (!map) {
                return DIV();
            }
            const elements: ReactNode[] = [];
            elements.push(DIV({ className: 'dashboard-map-title' },
                fromRecord(map.title)));
            if (map.imageUrl) {
                elements.push(DIV({
                    className: 'image',
                    style: {
                        backgroundImage: `url(${map.imageUrl})`,
                    },
                }));
            }
            elements.push(DIV({ className: 'dashboard-date-updated' },
                SPAN({}, tr('lastModified')), formatDate(new Date(map.lastModified))),
                editButton(selectMap(map.id)));

            return (
                DIV({ className: 'dashboard-map-item' }, ...elements)
            );
        })
    );
};

const render = () => {
    const user = queries.getUserData();
    if (null === user) {
        return DIV({}, 'Sorry, you\'re not logged in.');
    }
    const maps = user.maps;
    return (
        DIV({ className: 'dashboard-maps' },
            renderAdd(),
            ...renderItems(maps),
        )
    );
};

export default render;
