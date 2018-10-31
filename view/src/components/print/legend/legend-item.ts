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
import { Box } from 'sdi/print/context';

import legendPoint from './legend-point';
import legendLinestring from './legend-linestring';
import legendPolygon from './legend-polygon';
import { Spec } from '../template';

const logger = debug('sdi:legend-item');



const renderLegendItem =
    (spec: Spec, layerInfo: ILayerInfo): Box => {
        switch (layerInfo.style.kind) {
            case 'polygon-continuous':
            case 'polygon-discrete':
            case 'polygon-simple':
                return legendPolygon(spec, layerInfo.style, layerInfo);
            case 'point-discrete':
            case 'point-simple':
            case 'point-continuous':
                return legendPoint(spec, layerInfo.style, layerInfo);
            case 'line-simple':
            case 'line-discrete':
            case 'line-continuous':
                return legendLinestring(spec, layerInfo.style, layerInfo);
            default:
                throw (new Error('UnknownStyleKind'));
        }
    };
export default renderLegendItem;

logger('loaded');
