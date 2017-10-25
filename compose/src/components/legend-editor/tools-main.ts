

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
import queries from '../../queries/legend-editor';
import { renderLine, renderLineForGroup } from './tool-line';
import { renderPolygon, renderPolygonForGroup } from './tool-polygon';
import { renderPointFull, renderMarkerForGroup } from './tool-point';

const render = () => {
    const lt = queries.getLegendType();
    const idx = queries.getSelectedStyleGroup();

    const tool =
        (simple: () => React.ReactNode, group: (a: number) => React.ReactNode) => {
            if (lt === 'simple') {
                return simple();
            }
            else if (idx >= 0) {
                return group(idx);
            }
            return DIV();
        };


    switch (queries.getGeometryType()) {
        case 'Point':
        case 'MultiPoint': return tool(renderPointFull, renderMarkerForGroup);
        case 'LineString':
        case 'MultiLineString': return tool(renderLine, renderLineForGroup);
        case 'Polygon':
        case 'MultiPolygon': return tool(renderPolygon, renderPolygonForGroup);
        case null: return DIV({}, 'ERROR - No Geometry Type');
    }
};

export default render;
