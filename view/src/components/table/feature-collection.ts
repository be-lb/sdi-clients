
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
import tr, { fromRecord } from 'sdi/locale';
import { DIV } from 'sdi/components/elements';
import { SelectRowHandler, TableDataRow, baseTable } from 'sdi/components/table';
import { scopeOption } from 'sdi/lib';

import { layerTableQueries } from '../../queries/table';
import { layerTableEvents } from '../../events/table';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape/types';
import { button } from '../button';
import { startExtract, stopExtract } from '../../events/map';
import { withExtract } from '../../queries/map';
import { fromNullable } from 'fp-ts/lib/Option';

const logger = debug('sdi:table/feature-collection');

const closeButton = button('close');
const extractButton = button('extract');
const noExtractButton = button('noExtract');


const renderExtract =
    () => withExtract().fold(
        () => DIV({ className: 'toggle' },
            DIV({ className: 'active' }, tr('extractOff')),
            extractButton(startExtract),
            DIV({ className: 'no-active' }, tr('extractOn'))),
        () => DIV({ className: 'toggle' },
            DIV({ className: 'no-active' }, tr('extractOff')),
            noExtractButton(stopExtract),
            DIV({ className: 'active' }, tr('extractOn'))),
    )


const toolbar = () => {
    const { metadata } = appQueries.getCurrentLayerInfo();
    const layerName = metadata ? fromRecord(getMessageRecord(metadata.resourceTitle)) : '...';
    return DIV({ className: 'table-toolbar', key: 'table-toolbar' },
        DIV({ className: 'table-title' }, layerName),
        DIV({ className: 'table-download' },
            renderExtract()
            // SPAN({ className: 'dl-item' }, 'geojson'),
            // SPAN({ className: 'dl-item' }, 'gpx'),
            // SPAN({ className: 'dl-item' }, 'shapefile'),
            // SPAN({ className: 'dl-item' }, 'kml'),
            // SPAN({ className: 'dl-item' }, 'csv'),
            // SPAN({ className: 'dl-item' }, 'geotif')
        ),
        closeButton(() => {
            appEvents.unsetCurrentFeature();
            appEvents.setLayout(AppLayout.MapFS);
        }));
};

const onRowSelect: SelectRowHandler =
    (row: TableDataRow) =>
        scopeOption()
            .let('meta',
            fromNullable(appQueries.getCurrentLayerInfo().metadata))
            .let('layer',
            ({ meta }) => fromNullable(
                appQueries.getLayerData(meta.uniqueResourceIdentifier)))
            .let('feature',
            ({ layer }) => fromNullable(
                layer.features.find(f => f.id === row.from)))
            .map(({ feature }) => {
                appEvents.setCurrentFeature(feature);
                appEvents.setLayout(AppLayout.MapAndTableAndFeature);
            });


const base = baseTable(layerTableQueries, layerTableEvents);

const render = base({
    className: 'attr-select-wrapper',
    toolbar,
    onRowSelect,
});

export default render;

logger('loaded');

