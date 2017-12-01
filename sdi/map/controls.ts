

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

import { MapEvent, control } from 'openlayers';
import { SetScaleLine, IMapScale } from './index';
import { DIV } from '../components/elements';

interface ScaleLineOptions {
    minWidth: number;
    setScaleLine: SetScaleLine;
}

let previousCount = -1;
let previousWidth = -1;
let previousSuffix = '';

export const scaleLine =
    (options: ScaleLineOptions) => {
        const render = (mapEvent: MapEvent) => {
            // if (!condition()) {
            //     return;
            // }
            const frameState = mapEvent.frameState;
            if (!frameState) {
                return;
            }

            const viewState = frameState.viewState;
            if (!viewState) {
                return;
            }

            let pointResolution = viewState.resolution;
            const nominalCount = options.minWidth * pointResolution;
            let suffix = '';
            //  else if (units == ol.control.ScaleLineUnits.METRIC) 
            if (nominalCount < 1) {
                suffix = 'mm';
                pointResolution *= 1000;
            }
            else if (nominalCount < 1000) {
                suffix = 'm';
            }
            else {
                suffix = 'km';
                pointResolution /= 1000;
            }


            let i = 3 * Math.floor(
                Math.log(options.minWidth * pointResolution) / Math.log(10));
            let count: number;
            let width: number;
            const LEADING_DIGITS = [1, 2, 5];
            // tslint:disable-next-line:no-constant-condition
            while (true) {
                count = LEADING_DIGITS[((i % 3) + 3) % 3] *
                    Math.pow(10, Math.floor(i / 3));
                width = Math.round(count / pointResolution);
                if (isNaN(width)) {
                    return;
                }
                else if (width >= options.minWidth) {
                    break;
                }
                i += 1;
            }

            if (count !== previousCount || width !== previousWidth || suffix !== previousSuffix) {
                previousCount = count;
                previousWidth = width;
                previousSuffix = suffix;
                options.setScaleLine(count, suffix, width);
            }
        };

        return (
            new control.ScaleLine({ render })
        );
    };

export const renderScaleline =
    (sl: IMapScale) =>
        DIV({ className: 'map-scale', style: { width: `${sl.width}px` } },
            DIV({ className: 'map-scale-label' }, `${sl.count} ${sl.unit}`),
            DIV({ className: 'map-scale-line' },
                DIV({ className: 'quarter' }),
                DIV({ className: 'quarter' }),
                DIV({ className: 'half' })));


export const zoomControl =
    (target: Element) => {
        return (
            new control.Zoom({
                target,
                className: 'zoom',
                zoomInLabel: '',
                zoomOutLabel: '',
                zoomInTipLabel: '', // FIXME - make this locale-aware
                zoomOutTipLabel: '',
            })
        );
    };


const northArrow = document.createElement('div');
northArrow.setAttribute('class', 'north-arrow');

export const rotateControl =
    (target: Element) => {
        return (
            new control.Rotate({
                target,
                className: 'rotate',
                autoHide: false,
                label: northArrow,
            })
        );
    };


const fsInNode = document.createElement('div');
fsInNode.setAttribute('class', 'fullscreen-in');
const fsOutNode = document.createElement('div');
fsOutNode.setAttribute('class', 'fullscreen-out');

export const fullscreenControl =
    (target: Element) => {
        return (
            new control.FullScreen({
                target,
                className: 'fullscreen',
                label: fsInNode,
                labelActive: fsOutNode,
            })
        );
    };

