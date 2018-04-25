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

import { query } from 'sdi/shape';
import { getLang } from 'sdi/app';
import { FeatureCollection, RowConfig } from 'sdi/source';
import { getLayerPropertiesKeys } from 'sdi/util';

import appQueries from './app';




export const getFeatureViewType =
    () => {
        const { info } = appQueries.getCurrentLayerInfo();
        if (info) {
            return info.featureViewOptions.type;
        }
        return null;
    };


export const getConfig =
    () => {
        const { info } = appQueries.getCurrentLayerInfo();
        if (info
            && info.featureViewOptions
            && info.featureViewOptions.type === 'config') {
            return info.featureViewOptions;
        }
        const rows: RowConfig[] = [];
        return { type: 'config', rows };
    };


export const getRows =
    () => {
        const lc = getLang();
        const allRows = getConfig().rows;
        return allRows.filter(r => r.lang === lc);
    };


export const getRow =
    (index: number): (RowConfig | undefined) => getRows()[index];


export const getCurrentIndex =
    () => query('component/feature-config').currentRow;


export const getCurrentRow =
    () => getRow(getCurrentIndex());


export const getEditedValue =
    () => {
        return query('component/feature-config').editedValue;
    };


// Layer / FeatureCollection

export const getLayer =
    (): FeatureCollection => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        const empty: FeatureCollection = { type: 'FeatureCollection', features: [] };
        if (metadata !== null) {
            return appQueries.getLayerData(metadata.uniqueResourceIdentifier).fold(
                () => empty,
                o => o.fold(empty, fc => fc));
        }
        return empty;
    };


export const getKeys =
    (): string[] => {
        return getLayerPropertiesKeys(getLayer());
    };


