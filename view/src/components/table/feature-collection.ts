
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

import { getMessageRecord } from 'sdi/source';
import { fromRecord } from 'sdi/locale';
import { DIV, SPAN } from 'sdi/components/elements';
import { SelectRowHandler, TableDataRow, baseTable } from 'sdi/components/table';

import { layerTableQueries } from '../../queries/table';
import { layerTableEvents } from '../../events/table';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape/types';
import { button } from '../button';

const logger = debug('sdi:table/feature-collection');

const closeButton = button('close');

const toolbar = () => {
    const { metadata } = appQueries.getCurrentLayerInfo();
    const layerName = metadata ? fromRecord(getMessageRecord(metadata.resourceTitle)) : '...';
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
            appEvents.unsetCurrentFeature();
            appEvents.setLayout(AppLayout.MapFS);
        }));
};

const onRowSelect: SelectRowHandler =
    (row: TableDataRow) => {
        const lid = appQueries.getCurrentLayer();
        if (lid) {
            const layer = appQueries.getLayerData(lid);
            if (layer) {
                const feature = layer.features[row.from as number];
                appEvents.setCurrentFeature(feature);
                appEvents.setLayout(AppLayout.MapAndTableAndFeature);
            }
        }
    };

const base = baseTable(layerTableQueries, layerTableEvents);

const render = base({
    className: 'attr-select-wrapper',
    toolbar,
    onRowSelect,
});

export default render;

logger('loaded');

