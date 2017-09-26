


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
 
import { DIV, SPAN } from './elements';
import tr, { formatNumber } from '../locale';
import appEvents from '../events/app';
import mapEvents from '../events/map';
import mapQueries from '../queries/map';
import { AppLayout } from '../shape/index';

const stopMeasure = () => {
    appEvents.setLayout(AppLayout.MapFS);
    mapEvents.stopMeasure();
};

const measure = () => {
    const state = mapQueries.getMeasure();
    if (state.geometryType === 'LineString') {
        const length = mapQueries.getMeasuredLength();
        return (
            DIV({ className: 'measure-linestring' },
                SPAN({
                    dangerouslySetInnerHTML: {
                        __html: `${formatNumber(length)}&#8239;m`,
                    },
                }))
        );
    }
    else {
        const area = mapQueries.getMeasuredArea();
        return (
            DIV({ className: 'measure-area' },
                SPAN({
                    dangerouslySetInnerHTML: {
                        __html: `${formatNumber(area)}&#8239;m²`,
                    },
                }))
        );
    }

};

const render = () => {
    return DIV({ className: 'tool-widget geo-measure' },
        measure(),
        DIV({
            className: 'btn-stop measure-stop',
            onClick: stopMeasure,
        }, SPAN({}, tr('stop'))));
};

export default render;
