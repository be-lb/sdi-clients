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

import { DIV } from 'sdi/components/elements';
import { lineColorForGroup, lineWidthForGroup, fillColorForGroup, fillColor, lineWidth, lineColor, pattern, patternForGroup } from './tool-input';

export const renderPolygonForGroup =
    (idx: number) => {
        return (
            DIV({ key: `renderPolygonForGroup-${idx}`, className: 'app-col-main style-toolbox-main' },
                fillColorForGroup(idx),
                patternForGroup(idx),
                lineWidthForGroup(idx),
                lineColorForGroup(idx))
        );
    };

export const renderPolygon =
    () => {
        return (
            DIV({ className: 'app-col-main style-toolbox-main' },
                fillColor(),
                pattern(),
                lineWidth(),
                lineColor())
        );
    };

