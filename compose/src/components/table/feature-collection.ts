
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
import { DIV, SPAN } from '../elements';
import { fromRecord } from '../../locale';
import { AppLayout } from '../../shape';
import button from '../button';

const logger = debug('sdi:table/feature-collection');

const closeButton = button('close');

const toolbar = () => {
    const { name } = appQueries.getCurrentLayerInfo();
    const layerName = name ? fromRecord(name) : '';
    return DIV({ className: 'table-toolbar', key: 'table-toolbar' },
        DIV({ className: 'table-title' }, layerName),
        DIV({ className: 'table-download' },
            SPAN({ className: 'dl-item' }, 'geojson'),
            SPAN({ className: 'dl-item' }, 'gpx'),
            SPAN({ className: 'dl-item' }, 'shapefile'),
            SPAN({ className: 'dl-item' }, 'kml'),
            SPAN({ className: 'dl-item' }, 'csv'),
            SPAN({ className: 'dl-item' }, 'geotif')),
        closeButton(() => {
            appEvents.unsetCurrentFeatureData();
            appEvents.setLayout(AppLayout.MapFS);
        }));
};

const onRowSelect: SelectRowHandler =
    (row: TableDataRow) => {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const layer = appQueries.getLayerData(lid);
            if (layer) {
                const feature = layer.features[row.from];
                appEvents.setCurrentFeatureData(feature);
            }
        }
    };

const render = base({
    className: 'attr-select-wrapper',
    loadData: queries.loadLayerData,
    loadKeys: queries.loadLayerKeys,
    loadTypes: queries.loadLayerTypes,
    toolbar,
    onRowSelect,
});

export default render;

logger('loaded');

