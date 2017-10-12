
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
import base, { SelectRowHandler } from './base';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape';
import { loadLayerListData, loadLayerListKeys, loadLayerListTypes } from '../../queries/metadata';
import { selectMetadata } from '../../events/metadata';

const logger = debug('sdi:table/layers');

const onRowSelect: SelectRowHandler =
    (row) => {
        const id = row.from as string;
        selectMetadata(id);
        appEvents.setLayout(AppLayout.Single);
    };


const render = base({
    className: 'layer-select-wrapper',
    loadData: loadLayerListData,
    loadKeys: loadLayerListKeys,
    loadTypes: loadLayerListTypes,
    onRowSelect,
});

export default render;

logger('loaded');
