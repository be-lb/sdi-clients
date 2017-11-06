
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
import { SelectRowHandler, TableDataRow } from 'sdi/components/table';
import { base } from './base';
import queries from '../../queries/table';
// import events from '../../events/layer-editor';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import { fromRecord } from 'sdi/locale';
import { DIV, A, SPAN } from 'sdi/components/elements';
import { AppLayout } from '../../shape/types';
import { button } from '../button';
import { isAnchor, FreeText } from 'sdi/source';

const logger = debug('sdi:table/feature-collection-editable');

const closeButton = button('close');

const renderFreeText = (ft: FreeText, className?: string) => {
    if (isAnchor(ft)) {
        return A({ href: ft.href, className }, fromRecord(ft.text));
    }
    return SPAN({ className }, fromRecord(ft));
};

const toolbar = () => {
    const lid = appQueries.getCurrentLayerId();
    let layerName = SPAN();
    if (lid) {
        layerName = SPAN({}, lid);
        const md = appQueries.getDatasetMetadata(lid);
        if (md) {
            layerName = renderFreeText(md.resourceTitle);
        }
    }
    return DIV({ className: 'table-toolbar', key: 'table-toolbar' },
        DIV({ className: 'table-title' }, layerName),
        closeButton(() => {
            appEvents.unsetCurrentFeatureData();
            appEvents.setLayout(AppLayout.Dashboard);
        }));
};

const onRowSelect: SelectRowHandler =
    (row: TableDataRow) => {
        events.editRow(row);
    };



const render = base({
    className: 'attr-headless-wrapper',
    loadData: queries.loadLayerData,
    loadKeys: queries.loadLayerKeys,
    loadTypes: queries.loadLayerTypes,
    onRowSelect,
    toolbar,
});

export default render;

logger('loaded');

