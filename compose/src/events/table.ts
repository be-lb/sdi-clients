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

import { fromNullable, none } from 'fp-ts/lib/Option';

import { dispatchK, observe } from 'sdi/shape';
import { initialTableState, tableEvents, TableDataRow } from 'sdi/components/table';
import { FeatureCollection } from 'sdi/source';
import { scopeOption } from 'sdi/lib';

import appQueries from '../queries/app';
import appEvents from './app';

const table = dispatchK('component/table');

observe('app/current-layer', () => {
    table(initialTableState);
});


const findFeature =
    (fc: FeatureCollection, id: string | number) =>
        fromNullable(fc.features.find(f => f.id === id));

export const selectFeature =
    (row: TableDataRow) => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        scopeOption()
            .let('meta', fromNullable(metadata))
            .let('layer', s => appQueries.getLayerData(s.meta.uniqueResourceIdentifier).getOrElse(none))
            .let('feature', s => findFeature(s.layer, row.from))
            .map(({ feature }) => appEvents.setCurrentFeatureData(feature));
    };


export const layerTableEvents = tableEvents(table);
export const metadataTableEvents = tableEvents(table);


export const selectFeatureRow =
    (idx: number) => layerTableEvents.select(idx);


export const resetLayerTable =
    () => layerTableEvents.reset();
