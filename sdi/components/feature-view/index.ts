
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
import { ReactNode } from 'react';

import { Feature, FeatureViewOptions } from '../../source';
import { getAlias } from '../../app';
import { getFeatureProperties } from '../../util';
import { DIV } from '../elements';
import { TimeseriePlotter } from '../timeserie';

import config from './config';

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
                        getAlias(k)),
                    DIV({ className: 'feature-field-value' }, val)));
        };

const renderDefault =
    (feature: Feature) => {
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


// const selectRowFeature =
//     (row: TableDataRow) => {
//         const { metadata } = getCurrentLayerInfo();
//         if (metadata) {
//             const layer = getLayerData(metadata.uniqueResourceIdentifier);
//             if (layer) {
//                 const feature = layer.features[row.from as number];
//                 setCurrentFeatureData(feature);
//             }
//         }
//     };

// const checkSelected =
//     () => {
//         const selected = getSelected();
//         if (selected < 0) {
//             selectRow(0);
//             const row = getRow(0);
//             if (row) {
//                 selectRowFeature(row);
//             }
//         }
//     };

const render =
    (viewOptions: FeatureViewOptions, feature: Feature, tsPlotter: TimeseriePlotter) => {

        // checkSelected();
        switch (viewOptions.type) {
            case 'default': return renderDefault(feature);
            case 'config': return config(feature, viewOptions, tsPlotter);
        }

    };
export default render;

logger('loaded');
