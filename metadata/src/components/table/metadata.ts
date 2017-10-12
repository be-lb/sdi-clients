
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
import queries from '../../queries/table';
import appEvents from '../../events/app';
import { H1, DIV } from '../elements';
import tr from '../../locale';
import { AppLayout } from '../../shape';
// import button from '../button';

const logger = debug('sdi:table/layers');

// const closeButton = button('close');

const toolbar = () => {
    return DIV({
        className: 'table-toolbar',
    }, H1({}, tr('sheetList')));
};

const onRowSelect: SelectRowHandler =
    () => {
        appEvents.setLayout(AppLayout.Single);
    };


const render = base({
    className: 'layer-select-wrapper',
    loadData: queries.loadLayerListData,
    loadKeys: queries.loadLayerListKeys,
    loadTypes: queries.loadLayerListTypes,
    onRowSelect,
    toolbar,
});

export default render;

logger('loaded');

