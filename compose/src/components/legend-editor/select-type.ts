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
import tr from 'sdi/locale';
import { StyleConfig } from 'sdi/source';

import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';

const logger = debug('sdi:legend-editor/select-type');

// Holds the old simple style to be able to go back
let prevSimpleStyle: StyleConfig;

const selectSimple = () => {
    events.selectSimple(prevSimpleStyle);
};

const backupSimpleStyle = () => {
    const style = queries.getStyle();

    if (style !== null) {
        prevSimpleStyle = style;
    }
};

const selectDiscrete = () => {
    if (queries.getLegendType() === 'simple') {
        backupSimpleStyle();
    }
    events.selectDiscrete();
};

const selectContinuous = () => {
    if (queries.getLegendType() === 'simple') {
        backupSimpleStyle();
    }
    events.selectContinuous();
};


export const render = () => {
    const legendType = queries.getLegendType();

    const options = [
        DIV({
            className: (legendType === 'simple') ? 'active' : '',
            onClick: () => selectSimple(),
        }, tr('legendTypeSimple')),

        DIV({
            className: (legendType === 'discrete') ? 'active' : '',
            onClick: () => selectDiscrete(),
        }, tr('legendTypeDiscrete')),

        DIV({
            className: (legendType === 'continuous') ? 'active' : '',
            onClick: () => selectContinuous(),
        }, tr('legendTypeContinuous')),
    ];

    return DIV({ className: 'app-col-main legend-picker' }, ...options);
};

export default render;

logger('loaded');
