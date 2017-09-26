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
import { DIV } from '../elements';
import { createElement as s } from 'react';
import { MouseEvent } from 'react';
import queries from '../../queries/timeserie';
import events from '../../events/timeserie';
import { ITimeserie, ITimeserieRow } from 'sdi/source';
import { IChartScale, IDimensions, IChartWindow, ITimeserieInteractive } from '../../shape';
import { formatDate } from '../../locale/index';

const logger = debug('sdi:components/timeserie');

interface IPadding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export const initialState = (): ITimeserieInteractive => ({
    cursorPosition: -1,
    selection: { start: -1, width: 0 },
    window: { start: 0, width: 100 },
    active: false,
    editingSelection: false,
});

/**
 * Returns an array filled with 'undefined'. This way the array can be filled
 * with a map or reduce
 * @param size 
 */
const mappableEmptyArray = (size: number): undefined[] => Array(size).fill(undefined);

type tickAlignment = 'start' | 'middle' | 'end';

type DOMProperties = { [key: string]: any };

const graphsize: IDimensions = { width: 400, height: 200 };

const padding: IPadding = { top: 40, right: 0, bottom: 40, left: 80 };

const maxbarcount = 100;

const svg = (els: any[], properties?: {}) =>
    s('svg', {
        viewBox: `-${padding.left} -${padding.top} ${graphsize.width + padding.left} ${graphsize.height + padding.top + padding.bottom}`,
        ...properties,
    },
        //   s('?xml-stylesheet', { type: 'text/css', href: '/style/chart-bar.css' }),
        ...els);


const line = (x1: number, y1: number, x2: number, y2: number, properties?: DOMProperties) =>
    s('line', { x1, y1, x2, y2, ...properties });


const rect = (x: number, y: number, width: number, height: number, properties?: DOMProperties) =>
    s('rect', { x, y, width, height, ...properties });


const text = (x: number, y: number, text: string, textAnchor: tickAlignment = 'start', properties?: DOMProperties) =>
    s('text', { x, y, textAnchor, ...properties }, text);


const circle = (cx: number, cy: number, r: number, properties?: DOMProperties) =>
    s('circle', { cx, cy, r, ...properties });


const getBarwidth = (barcount: number) => graphsize.width / barcount;

/**
 * Simplify data points
 */
export const simplifyData = (data: ITimeserie, lengthMax: number) => {
    if (data.length > lengthMax) {
        const baseSampleSize = Math.floor(data.length / lengthMax);
        const restChunk = (data.length - (baseSampleSize * lengthMax)) / lengthMax;
        let rest = 0;
        let k = 0;

        return mappableEmptyArray(lengthMax).map<ITimeserieRow>(() => {
            rest += restChunk;
            let sampleSize = baseSampleSize;

            if (rest >= 1) {
                sampleSize = baseSampleSize + 1;
                rest -= 1;
            }

            let sum = 0;
            let samples = 0;
            const limit = Math.min(k + sampleSize, data.length);

            for (let i = k; i < limit; i += 1) {
                const val = data[i][1];
                if (val !== null) {
                    sum += val;
                    samples += 1;
                }
            }

            const average = (samples > 0) ? sum / samples : null;
            const startDate = data[k][0];
            const startQuality = data[k][2];

            k += sampleSize;

            return [startDate, average, startQuality];
        });
    }

    return data;
};

/**
 * Return a copy of the window with a positive width
 * @param window
 */
export const absoluteWindow = (window: IChartWindow) => {
    if (window.width < 0) {
        return { start: Math.max(window.start + window.width, 0), width: Math.abs(window.width) };
    }
    else {
        return { start: window.start, width: window.width };
    }
};

const deriveScale = (data: ITimeserie, padding = .25): IChartScale | null => {
    let min: number | null = null;
    let max: number | null = null;

    for (let i = 0; i < data.length; i += 1) {
        const val = data[i][1];

        if (val !== null) {
            min = (min !== null && min < val) ? min : val;
            max = (max !== null && max > val) ? max : val;
        }
    }

    if (min !== null && max !== null) {
        const spread = max - min;
        return { min: min - spread * padding, max: max + spread * padding };
    }

    return null;
};

const asSvgX = (el: SVGElement, clientX: number) => {
    const clientRect = el.getBoundingClientRect();
    const graphWidth = graphsize.width + padding.left;
    const scale = graphWidth / clientRect.width;

    return (clientX - clientRect.left) * scale - padding.left;
};

export const graph = (data: ITimeserie, window: IChartWindow, withSelection: boolean = false) => {
    let zoom = 1;

    if (data.length > maxbarcount) {
        zoom = maxbarcount / data.length;
        data = simplifyData(data, maxbarcount);
    }

    const scale = deriveScale(data);
    if (scale !== null) {
        const spread = scale.max - scale.min;
        const barcount = Math.min(data.length, maxbarcount);
        const barwidth: number = getBarwidth(barcount);

        const activeBar = Math.floor((queries.getCursorPosition() - window.start) * zoom);
        const barAt = (x: number) => Math.floor(x / barwidth / zoom + window.start);
        const valueAt = (y: number) => scale.min + spread * (y / graphsize.height);
        const drawBars = () => {
            const bars = data.map((v, k) => {
                const val = v[1];
                if (val) {
                    const height = ((val - scale.min) / spread) * graphsize.height;
                    const highlighted = (k === activeBar) ? true : false;
                    return rect(k * barwidth, graphsize.height - height, barwidth, height, {
                        className: (highlighted) ? 'timeserie-bar active' : 'timeserie-bar',
                        key: `${k.toString()}|${v.toString()}|${highlighted}`,
                    });
                }
                else {
                    return null;
                }
            });

            return svg(bars, {
                style: { position: 'absolute', top: 0, left: 0 },
                onMouseMove: (e: MouseEvent<SVGElement>) => {
                    e.preventDefault();
                    events.setCursorPosition(barAt(asSvgX(e.currentTarget, e.clientX)));
                },
                key: `bars|${window.start.toString()}|${window.width.toString()}|${activeBar.toString()}`,
            });
        };


        const drawBackground = () => {
            const horizontalLineCount = 4;
            const horizontalLineIncrement = graphsize.height / (horizontalLineCount - 1);
            const verticalLineCount = 4;
            const verticalLineIncrement = graphsize.width / (verticalLineCount - 1);
            const timestampStart = data[0][0];
            const timestampEnd = data[data.length - 1][0];
            const timeSpread = timestampEnd - timestampStart;

            const horizontal = mappableEmptyArray(horizontalLineCount).map((_v, k) => {
                const y = graphsize.height - k * horizontalLineIncrement;
                const valueLabel = valueAt(k * horizontalLineIncrement).toFixed(2).toString();
                return [
                    line(-5, y, graphsize.width, y, { className: 'timeserie-grid' }),
                    text(-10, y, valueLabel, 'end', { className: 'timeserie-tick-label' }),
                ];
            });

            const vertical = mappableEmptyArray(verticalLineCount).map((_v, k) => {
                const x = k * verticalLineIncrement;
                const tickDate = new Date((x / graphsize.width) * timeSpread + timestampStart);
                const label = formatDate(tickDate);
                let alignment: tickAlignment = 'middle';
                if (k === 0) {
                    alignment = 'start';
                }
                else if ((k + 1) === verticalLineCount) {
                    alignment = 'end';
                }

                return [
                    line(x, 0, x, graphsize.height + 5, { className: 'timeserie-grid' }),
                    text(x, graphsize.height + 15, label, alignment, { className: 'timeserie-tick-label' }),
                ];
            });

            return svg([...vertical, ...horizontal]);
        };

        const drawSelection = () => {
            const selection = queries.getSelection();
            const left = (selection.start - window.start) * zoom * barwidth;
            const right = ((selection.start + selection.width) - window.start) * zoom * barwidth;
            const fillWidth = right - left;

            const fill = rect(Math.min(left, right), 0, Math.abs(fillWidth), graphsize.height, {
                key: `${left.toString()}|${right.toString()} `,
                className: 'timeserie-selection-fill',
            });
            const borderLeft = line(left, 0, left, graphsize.height, { className: 'timeserie-selection-border' });
            const borderRight = line(right, 0, right, graphsize.height, { className: 'timeserie-selection-border' });
            const adjustLeft = circle(left, graphsize.height * .5, 6, {
                className: 'timeserie-selection-adjust',
                onMouseDown: (e: MouseEvent<SVGElement>) => {
                    e.stopPropagation();
                    e.preventDefault();
                    events.invertSelection();
                    events.startEditing();
                },
            });
            const adjustRight = circle(right, graphsize.height * .5, 6, {
                className: 'timeserie-selection-adjust',
                onMouseDown: (e: MouseEvent<SVGElement>) => {
                    e.stopPropagation();
                    e.preventDefault();
                    events.startEditing();
                },
            });
            const contents = [];

            if (selection.start > 0) {
                contents.push(fill, borderLeft, borderRight, adjustLeft, adjustRight);
            }

            return svg(contents, {
                key: `selection|${window.start.toString()}|${window.width.toString()}`,
                style: { position: 'absolute', top: 0, left: 0 },
                onMouseDown: (e: MouseEvent<SVGElement>) => {
                    e.preventDefault();
                    const bar = barAt(asSvgX(e.currentTarget, e.clientX)) + window.start;

                    events.startEditing();
                    events.startSelection(bar);
                },
                onMouseMove: (e: MouseEvent<SVGElement>) => {
                    e.preventDefault();
                    const bar = barAt(asSvgX(e.currentTarget, e.clientX));
                    if (queries.isEditing()) {
                        events.setSelectionWidth((bar - selection.start));
                    }
                    else {
                        events.setCursorPosition(bar);
                    }
                },
                onMouseUp: (e: MouseEvent<SVGElement>) => {
                    e.preventDefault();
                    events.stopEditing();
                },
            });
        };

        const background = drawBackground();

        const bars = drawBars();

        if (withSelection) {
            return [background, bars, drawSelection()];
        }
        else {
            return [background, bars];
        }
    }
    return [DIV({}, 'No valid data')];
};


logger('loaded');
