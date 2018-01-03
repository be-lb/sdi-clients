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

import { DIV, SPAN } from 'sdi/components/elements';
import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';
import { propName, fontSize, fontColor, markerCodepointForGroup, markerSizeForGroup, markerColorForGroup, markerCodepoint, markerSize, markerColor, offsetX, offsetY } from './tool-input';
import { button } from '../button';
import tr from 'sdi/locale';

const markerButton = button('switch', 'switchMarker');
const labelButton = button('switch', 'switchLabel');

const switchConfig =
    (a: 'marker' | 'label') => {
        if ('label' === a) {
            return markerButton(() => events.setPointConfig('marker'));
        }
        return labelButton(() => events.setPointConfig('label'));
    };


const renderLabelPosition =
    () => {
        const pos = queries.getPositionForLabel();
        let cp = queries.getMarkerCodepoint(0);
        if (0 === cp) {
            cp = queries.getMarkerCodepointForGroup(0, 0);
            if (0 === cp) {
                cp = 0xf111;
            }
        }
        const setPos =
            (p: typeof pos) => () => {
                events.setPositionForLabel(p);
            };
        const elem = (p: typeof pos) => {
            const className = (p === pos) ? `label active ${p}` : `label ${p}`;
            return DIV({ className, onClick: setPos(p) });
        };

        return (
            DIV({ className: 'style-tool label-position' },
                SPAN({ className: 'style-tool-label' }, tr('labelPostion')),
                DIV({ className: 'label-position-widget' },
                    DIV({ className: 'row' },
                        elem('above')),
                    DIV({ className: 'row' },
                        elem('left'),
                        DIV({ className: 'picto' }, String.fromCodePoint(cp)),
                        elem('right')),
                    DIV({ className: 'row' },
                        elem('under'))))
        );
    };

const renderLabelInputs =
    () => ([
        propName(),
        fontColor(),
        fontSize(),
        renderLabelPosition(),
        offsetX(),
        offsetY(),
    ]);


const renderLabelFull =
    () => {
        return (
            DIV({ className: 'app-col-main style-toolbox-main' },
                switchConfig(queries.getPointConfig()),
                ...renderLabelInputs())
        );
    };


const renderMarkerFull =
    () => {
        return DIV({ className: 'app-col-main style-toolbox-main' },
            switchConfig(queries.getPointConfig()),
            markerCodepoint(),
            markerSize(),
            markerColor());
    };

// in simple mode
export const renderPointFull =
    () => {
        switch (queries.getPointConfig()) {
            case 'label': return renderLabelFull();
            case 'marker': return renderMarkerFull();
        }
    };

// when in grouped mode
export const renderMarkerForGroup =
    (idx: number) => {
        return DIV({ key: `renderMarkerForGroup-${idx}`, className: 'app-col-main style-toolbox-main' },
            markerCodepointForGroup(idx),
            markerSizeForGroup(idx),
            markerColorForGroup(idx));
    };

export const renderLabelOnly =
    () => {
        return DIV({ className: 'app-col-main style-toolbox-main' },
            ...renderLabelInputs());
    };


