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

import { ILayerInfo } from 'sdi/source';
import { fromRecord } from 'sdi/locale';
import { DIV } from 'sdi/components/elements';

import legendPoint from './legend-point';
import legendLinestring from './legend-linestring';
import legendPolygon from './legend-polygon';

const logger = debug('sdi:legend-item');

const withLabel =
    (layerInfo: ILayerInfo) =>
        (nodes: React.ReactNode[]) => {
            if (layerInfo.legend !== null) {
                const label = fromRecord(layerInfo.legend).trim();
                if (label.length > 0) {
                    return [
                        DIV({ className: 'legend-label' }, label),
                        ...nodes,
                    ];
                }
            }
            return nodes;
        };


const renderLegendItem =
    (layerInfo: ILayerInfo) => {
        const label = withLabel(layerInfo);
        switch (layerInfo.style.kind) {
            case 'polygon-continuous':
            case 'polygon-discrete':
            case 'polygon-simple':
                return label(legendPolygon(layerInfo.style, layerInfo));
            case 'point-discrete':
            case 'point-simple':
            case 'point-continuous':
                return label(legendPoint(layerInfo.style, layerInfo));
            case 'line-simple':
            case 'line-discrete':
            case 'line-continuous':
                return label(legendLinestring(layerInfo.style, layerInfo));
            default:
                throw (new Error('UnknownStyleKind'));
        }
    };
export default renderLegendItem;

logger('loaded');
