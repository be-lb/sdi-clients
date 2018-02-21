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

import { DIV } from 'sdi/components/elements';
import { fromNullable } from 'fp-ts/lib/Option';

import { IMapInfo } from 'sdi/source';

import queries from '../../queries/app';
import events from '../../events/app';
import info from './info';
import attachments from './attachments';
import legend from './legend';
import { remove } from '../button';

const logger = debug('sdi:map-info');



const renderRemove =
    (mi: IMapInfo) => (
        DIV({ className: 'remove-map' },
            remove(`remove-map-${mi.id}`, 'removeMap')(() => events.deleteMap(mi.id as string)))
    );

const render =
    () => fromNullable(queries.getMapInfo())
        .fold(
            DIV({ className: 'map-legend' }),
            mi => (
                DIV({ className: 'map-legend' },
                    info(mi),
                    attachments(mi),
                    legend(mi),
                    renderRemove(mi)
                )));

export default render;

logger('loaded');
