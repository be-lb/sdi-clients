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
import { DIV } from 'sdi/components/elements';
import { IMapInfo } from 'sdi/source';

import legendItem from './legend-item';
import { getMapInfo } from '../../queries/app';

const logger = debug('sdi:legend');

const legendLegend = (mapInfo: IMapInfo) =>
    DIV({ className: 'legend' },
        mapInfo.layers
            .slice()
            .reverse()
            .reduce<React.DOMElement<{}, Element>[]>((acc, info) => {
                if (info.visible) {
                    const items = legendItem(info);
                    return acc.concat(items);
                }
                return acc;
            }, [])
    );


const render =
    () => getMapInfo().fold(
        () => DIV(),
        info => legendLegend(info)
    );


export default render;

logger('loaded');
