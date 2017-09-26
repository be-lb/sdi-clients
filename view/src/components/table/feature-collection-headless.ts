
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
import base, { SelectRowHandler, TableDataRow } from './base';
import queries from '../../queries/table';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import { fromRecord } from '../../locale/index';
import { DIV } from '../elements';

const logger = debug('sdi:table/feature-collection');

const toolbar = () => {
    const layerInfo = appQueries.getCurrentLayerInfo();
    const layerName = layerInfo ? fromRecord(layerInfo.name) : '';
    return DIV({ className: 'table-toolbar', key: 'table-toolbar' },
        DIV({ className: 'table-title' }, layerName));
};

const onRowSelect: SelectRowHandler =
    (row: TableDataRow) => {
        const lid = appQueries.getCurrentLayer();
        if (lid) {
            const layer = appQueries.getLayer(lid);
            if (layer) {
                const feature = layer.features[row.from];
                appEvents.setCurrentFeature(feature);
            }
        }
    };

const render = base({
    className: 'attr-headless-wrapper',
    loadData: queries.loadLayerData,
    loadKeys: queries.loadLayerKeys,
    loadTypes: queries.loadLayerTypes,
    toolbar,
    onRowSelect,
});

export default render;

logger('loaded');

