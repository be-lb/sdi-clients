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


import { createElement as s } from 'react';
import { TimeserieConfig, ITimeserie } from '../../source';

import { plotQueries } from './queries';
import { plotEvents } from './events';
import { plotter } from './plot';

export interface NotNullProperties {
    [key: string]: any;
}

export interface ITimeserieCollection {
    [id: string]: ITimeserie;
}

export interface IDimensions {
    width: number;
    height: number;
}

export interface IChartScale {
    min: number;
    max: number;
}

export interface IChartWindow {
    start: number;
    end: number;
}

export interface ITimeserieInteractive {
    cursorPosition: number;
    selection: IChartWindow;
    active: Boolean;
    editingSelection: Boolean;
}

export interface IPadding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export const initialTimeserieState =
    (): ITimeserieInteractive => ({
        cursorPosition: -1,
        selection: { start: -1, end: -1 },
        active: false,
        editingSelection: false,
    });

export type QueryTimeserie = () => ITimeserieInteractive;
export type DispatchTimeserie = (handler: (s: ITimeserieInteractive) => ITimeserieInteractive) => void;

export type PlotDataLoader = (id: string, url: string) => void;
export type PlotDataGetter = (id: string) => ITimeserie | null;
export type CLidGetter = () => string | null;

export interface PlotQuerySet {
    getData(props: NotNullProperties, config: TimeserieConfig): ITimeserie | null;
    getTimeserieId(props: NotNullProperties, config: TimeserieConfig): string | null;
    getTimeserieUrl(props: NotNullProperties, config: TimeserieConfig): string;
    getSelection(): IChartWindow;
    isEditing(): Boolean;
    isActive(): Boolean;
    getCursorPosition(): number;
}


export interface PlotEventSet {
    loadData: PlotDataLoader;
    startSelection(start: number): void;
    endSelection(end: number): void;
    startEditing(): void;
    stopEditing(): void;
    setCursorPosition(position: number): void;
    clearSelection(): void;
}



/**
 * Returns an array filled with 'undefined'. This way the array can be filled
 * with a map or reduce
 * @param size 
 */
export const mappableEmptyArray = (size: number): undefined[] => Array(size).fill(undefined);

export type tickAlignment = 'start' | 'middle' | 'end';

export type DOMProperties = { [key: string]: any };

export const graphsize: IDimensions = { width: 400, height: 200 };

export const padding: IPadding = { top: 40, right: 0, bottom: 40, left: 0 };

export const maxbarcount = 100;

export const svg = (els: React.ReactSVGElement[], properties?: {}) =>
    s('svg', {
        viewBox: `-${padding.left} -${padding.top} ${graphsize.width + padding.left} ${graphsize.height + padding.top + padding.bottom}`,
        ...properties,
    }, ...els);


export const line = (x1: number, y1: number, x2: number, y2: number, properties?: DOMProperties) =>
    s('line', { x1, y1, x2, y2, ...properties });


export const rect = (x: number, y: number, width: number, height: number, properties?: DOMProperties) =>
    s('rect', { x, y, width, height, ...properties });


export const text = (x: number, y: number, text: string, textAnchor: tickAlignment = 'start', properties?: DOMProperties) =>
    s('text', { x, y, textAnchor, ...properties }, text);


export const circle = (cx: number, cy: number, r: number, properties?: DOMProperties) =>
    s('circle', { cx, cy, r, ...properties });

export const group =
    (elems: React.ReactSVGElement[]) =>
        s('g', {}, ...elems);


export const getBarwidth = (barcount: number) => graphsize.width / barcount;


export interface TimeseriePlotter {
    plotter: (data: ITimeserie, window: IChartWindow, refPoint: number | null) => React.ReactSVGElement | React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>[];

    queries: PlotQuerySet;
    events: PlotEventSet;
}

export const factory =
    (q: QueryTimeserie, g: PlotDataGetter, i: CLidGetter,
        d: DispatchTimeserie, l: PlotDataLoader): TimeseriePlotter => {
        const qs = plotQueries(q, g, i);
        const es = plotEvents(d, l, qs);
        return plotter(qs, es);
    };

export default factory;
