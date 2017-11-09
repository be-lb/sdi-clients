
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

import { baseTable } from 'sdi/components/table';
import { DIV } from 'sdi/components/elements';

import { layerTableQueries } from '../../queries/table';
import { layerTableEvents, selectFeature } from '../../events/table';
import appQueries from '../../queries/app';
import { fromRecord } from 'sdi/locale';

const logger = debug('sdi:table/feature-collection');

const toolbar = () => {
    const { name } = appQueries.getCurrentLayerInfo();
    const layerName = name ? fromRecord(name) : '';
    return DIV({ className: 'table-toolbar', key: 'table-toolbar' },
        DIV({ className: 'table-title' }, layerName));
};


const base = baseTable(layerTableQueries, layerTableEvents);

const render = base({
    className: 'attr-headless-wrapper',
    toolbar,
    onRowSelect: selectFeature,
});

export default render;

logger('loaded');
