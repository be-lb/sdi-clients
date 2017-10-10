
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
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import tableQueries from '../../queries/table';
import tableEvents from '../../events/table';
import config from './config';
import { DIV } from '../elements';
import { ReactNode } from 'react';
import { getFeatureProperties } from '../../util/app';
import { TableDataRow } from '../table/base';

interface NotNullProperties {
    [key: string]: any;
}

const logger = debug('sdi:feature-view');

const renderRow =
    (props: NotNullProperties) =>
        (k: string) => {
            const className = 'feature-field';
            const val = `${props[k]}`;
            return (
                DIV({ className },
                    DIV({ className: 'feature-field-label' },
                        appQueries.getAlias(k)),
                    DIV({ className: 'feature-field-value' }, val)));
        };

const renderDefault =
    () => {
        const feature = appQueries.getCurrentFeature();
        const lines: ReactNode[] = [];
        if (feature) {
            const props = getFeatureProperties(feature);
            if (props) {
                return (
                    DIV({ className: 'feature-view config' },
                        Object.keys(props).map(renderRow(props)))
                );
            }
        }
        return DIV({ className: 'feature-view default' }, ...lines);
    };


const selectRow =
    (row: TableDataRow) => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        if (metadata) {
            const layer = appQueries.getLayerData(metadata.uniqueResourceIdentifier);
            if (layer) {
                const feature = layer.features[row.from];
                appEvents.setCurrentFeatureData(feature);
            }
        }
    };

const checkSelected =
    () => {
        const selected = tableQueries.getSelected();
        if (selected < 0) {
            tableEvents.select(0);
            const row = tableQueries.getRow();
            if (row) {
                selectRow(row);
            }
        }
    };

const render =
    () => {
        const { info } = appQueries.getCurrentLayerInfo();
        if (info) {
            checkSelected();
            switch (info.featureViewOptions.type) {
                case 'default': return renderDefault();
                case 'config': return config();
            }
        }
        return DIV({ className: 'feature-view' });
    };
export default render;

logger('loaded');
