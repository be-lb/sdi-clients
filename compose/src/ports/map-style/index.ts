

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
 
import { Feature, style, render } from 'openlayers';

export { default as pointStyle } from './point';
export { default as lineStyle } from './line';
export { default as polygonStyle } from './polygon';

export type StyleFn = (a: Feature, b?: number) => style.Style[];

export interface IOLContext {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    olContext: render.canvas.Immediate;
}

export const getContext = (width: number, height: number): IOLContext | null => {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
        return null;
    }
    const olContext = render.toContext(canvasContext, {
        size: [height, width],
    });
    return { canvas, canvasContext, olContext };
};

export const markerFont = (sz: number) => `${sz}px FontAwesome`;
export const labelFont = (sz: number) => `bold ${sz}px open_sans`;
export const fontSizeExtractRegexp = new RegExp('.*?(\\d+)px.*');
export const fontSizeReplaceRegexp = new RegExp('(.*?)\\d+px(.*)');
