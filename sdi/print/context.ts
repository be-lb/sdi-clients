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
import * as Pdf from 'jspdf';
import * as Color from 'color';

const logger = debug('sdi:print/context');

export type Orientation = 'landscape' | 'portrait';
export type TextAlign = 'left' | 'right' | 'center';
export type VerticalAlign = 'top' | 'bottom' | 'center';

type Dim = [number, number];
const dims = {
    a0: [1189, 841] as Dim,
    a1: [841, 594] as Dim,
    a2: [594, 420] as Dim,
    a3: [420, 297] as Dim,
    a4: [297, 210] as Dim,
    a5: [210, 148] as Dim,
};
type Dims = typeof dims;
export type Format = keyof Dims;



export type Page = Pdf & {
    width: number;
    height: number;
};

export type Coords = [number, number];



export interface CommandImage {
    kind: 'Image';
    data: string;
}

export const makeImage =
    (data: string): CommandImage => ({
        kind: 'Image',
        data,
    });

export interface CommandTileImage {
    kind: 'TileImage';
    data: string;
    splitRatio: number;
}


export const makeLargeImage =
    (data: string): CommandImage => ({
        kind: 'Image',
        data,
    });


export interface CommandText {
    kind: 'Text';
    data: string;
    fontSize: number;
    color: string;
    textAlign: TextAlign;
    verticalAlign: VerticalAlign;
}

export const makeText =
    (
        data: string,
        fontSize: number,
        color = 'black',
        textAlign = 'left' as TextAlign,
        verticalAlign = 'top' as VerticalAlign,
    ): CommandText => ({
        kind: 'Text',
        data,
        fontSize,
        color,
        textAlign,
        verticalAlign,
    });


export interface CommandLine {
    kind: 'Line';
    strokeWidth: number;
    coords: Coords[];
    color: string;
}

export const makeLine =
    (coords: Coords[], strokeWidth: number, color = 'black'): CommandLine => ({
        kind: 'Line',
        coords,
        strokeWidth,
        color,
    });

export interface CommandPolygon {
    kind: 'Polygon';
    coords: Coords[];
    color: string;
}

export const makePolygon =
    (coords: Coords[], color = 'black'): CommandPolygon => ({
        kind: 'Polygon',
        coords,
        color,
    });


export interface CommandRect {
    kind: 'Rect';
    coords: Coords[];
    color: string;
}

export const makeRect =
    (coords: Coords[], color = 'black'): CommandRect => ({
        kind: 'Rect',
        coords,
        color,
    });


export type Command =
    | CommandImage
    | CommandText
    | CommandLine
    | CommandPolygon
    | CommandRect
    ;


export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const rectToString =
    (r: Rect) =>
        `<${r.x} ${r.y} ${r.width} ${r.height}>`;

const printRect =
    (b: Box) => logger(`Box(${b.name ? b.name : ''}) ${rectToString(b)}`);



export type LayoutItems = Box[];
export type LayoutDirection = 'vertical' | 'horizontal';
export interface Layout {
    direction: LayoutDirection;
    items: LayoutItems;
    name?: string;
}

export type BoxChild = Command | Box | Layout;
export type BoxChildren = BoxChild[];

export type Box = Rect & {
    children: BoxChildren;
    name?: string;
};

const isBox = (a: BoxChild): a is Box => {
    return 'children' in a;
};

const isLayout = (a: BoxChild): a is Layout => {
    return 'items' in a;
};


export const nullRect =
    (): Rect => ({ x: 0, y: 0, width: 0, height: 0 });


export const makeLayout =
    (direction: LayoutDirection, width: number, height: number, children: BoxChildren): Layout => ({
        direction,
        items: children.map(c => ({
            x: 0, y: 0, width, height, children: [c],
        })),
    });

export const makeLayoutVertical =
    (width: number, height: number, children: BoxChildren): Layout =>
        makeLayout('vertical', width, height, children);

export const makeLayoutHorizontal =
    (width: number, height: number, children: BoxChildren): Layout =>
        makeLayout('horizontal', width, height, children);

// export const nextBox =
//     (d: BoxDirection) => (r: Rect, b: Box): Box => {
//         if (d === 'vertical') {
//             return { ...b, y: r.y + r.height };
//         }
//         return { ...b, x: r.x + r.width };
//     };

export const getDims =
    (o: Orientation, f: Format) => {
        if (o === 'portrait') {
            const [height, width] = dims[f];
            return { width, height };
        }
        const [width, height] = dims[f];
        return { width, height };
    };

export const createContext =
    (o: Orientation, f: Format): Page => {
        const page = Object.assign(
            new Pdf(o, 'mm', f), getDims(o, f));
        page.setFont('helvetica', 'normal');
        return page;
    };

const renderImage =
    (page: Page) =>
        (rect: Rect, command: CommandImage) => {
            const { x, y, width, height } = rect;
            const { data } = command;
            logger(`addImage ${x} ${y}`);
            page.addImage(
                data, 'PNG', x, y, width, height);

            return rect;
        };

export const renderTileImage =
    (page: Page) =>
        (rect: Rect, command: CommandTileImage) => {
            const { x, y, width, height } = rect;
            const { data } = command;
            logger(`addImage ${x} ${y}`);
            page.addImage(
                data, 'PNG', x, y, width, height);

            return rect;
        };

const renderText =
    (page: Page) =>
        (rect: Rect, command: CommandText) => {
            const { x, y, width, height } = rect;
            const { data, fontSize, textAlign, color, verticalAlign } = command;
            // const lineHeight = fontSize * page.getLineHeight() / 72;
            const lineHeight = fontSize * 0.8 * 0.35;
            const iColor = Color(color);
            const lines = page
                .setFontSize(fontSize)
                .splitTextToSize(data, width);

            let adjustedY = y + lineHeight;
            if (verticalAlign === 'bottom') {
                adjustedY = y + height;
            }
            else if (verticalAlign === 'center') {
                adjustedY = (y + (height / 2)) + (lineHeight / 2);
            }

            page.setFont('helvetica', 'normal');
            page.setTextColor(iColor.red(), iColor.green(), iColor.blue());
            logger(`Text ${x} ${adjustedY} ${lines}`)
            switch (textAlign) {
                case 'left':
                    page.text(lines, x, adjustedY);
                    break;
                case 'right':
                    page.text(lines, x + width, adjustedY, null, null, 'right');
                    break;
                case 'center':
                    page.text(lines, x + (width / 2), adjustedY, null, null, 'center');
                    break;
            }
        };

const renderLine =
    (page: Page) =>
        (rect: Rect, command: CommandLine) => {
            const { x, y } = rect;
            const { coords, strokeWidth, color } = command;
            const ctx = page.context2d;
            if (coords.length > 1) {
                ctx.save();
                ctx.beginPath();
                ctx.setLineWidth(strokeWidth);
                ctx.setStrokeStyle(color);
                const start = coords[0];
                ctx.moveTo(x + start[0], y + start[1]);
                coords.slice(1)
                    .forEach(c => ctx.lineTo(x + c[0], y + c[1]));
                ctx.stroke();
                ctx.restore();
            }

            return rect;
        };

const renderPolygon =
    (page: Page) =>
        (rect: Rect, command: CommandPolygon) => {
            const { x, y } = rect;
            const { coords, color } = command;
            const ctx = page.context2d;
            if (coords.length > 1) {
                ctx.save();
                ctx.beginPath();
                ctx.setFillStyle(color);
                const start = coords[0];
                ctx.moveTo(x + start[0], y + start[1]);
                coords.slice(1)
                    .forEach(c => ctx.lineTo(x + c[0], y + c[1]));
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            return rect;
        };


const renderRect =
    (page: Page) =>
        (rect: Rect, command: CommandRect) => {
            const { x, y } = rect;
            const { coords, color } = command;
            const ctx = page.context2d;
            if (coords.length > 1) {
                ctx.save();
                ctx.beginPath();
                ctx.setFillStyle(color);
                const start = coords[0];
                ctx.moveTo(x + start[0], y + start[1]);
                coords.slice(1)
                    .forEach(c => ctx.lineTo(x + c[0], y + c[1]));
                ctx.fill();
                ctx.restore();
            }

            return rect;
        };

// const scaleRectToPage =
//     (page: Page) =>
//         (r: Rect): Rect => ({
//             x: r.x * page.width / 100,
//             y: r.y * page.height / 100,
//             width: r.width * page.width / 100,
//             height: r.height * page.height / 100,
//         });

// const scaleCoordToPage =
//     (page: Page) =>
//         (c: Coords): Coords => ([
//             c[0] * page.width / 100,
//             c[1] * page.height / 100,
//         ]);

// const scaleLineToPage =
//     (page: Page) =>
//         (c: CommandLine): CommandLine =>
//             ({ ...c, coords: c.coords.map(scaleCoordToPage(page)) });


interface LayoutState {
    boxes: Box[];
    cx: number;
    cy: number;
    cw: number;
    ch: number;
    overflow: boolean;
}


const updateChildBoxes =
    (x: number, y: number, children: BoxChildren): BoxChildren =>
        children.map((b) => {
            if (isBox(b)) {
                return {
                    ...b,
                    x: x + b.x,
                    y: y + b.y,
                    children: updateChildBoxes(x, y, b.children),
                };
            }
            else {
                return b;
            }
        });

const processLayout =
    (rect: Rect, layout: Layout) => {
        const { direction, items } = layout;
        const maxy = rect.y + rect.height;
        const maxx = rect.x + rect.width;
        const state: LayoutState = {
            boxes: [],
            cx: rect.x,
            cy: rect.y,
            cw: 0,
            ch: 0,
            overflow: false,
        };
        logger(`layout ${layout.name || direction} ${rectToString(rect)}`);
        switch (direction) {
            case 'vertical':
                return items.reduce<LayoutState>((s, b) => {
                    logger(`current ${s.cx} ${s.cy}`);
                    if (s.overflow) {
                        return s;
                    }

                    const { boxes, cx, cy, cw } = s;
                    let ny = cy + b.y + b.height;

                    if (ny <= maxy) {
                        return {
                            boxes: boxes.concat([{
                                ...b, x: cx + b.x, y: cy + b.y,
                                children: updateChildBoxes(
                                    cx + b.x, cy + b.y, b.children),
                            }]),
                            cx, cy: ny,
                            cw: Math.max(s.cw, b.width), ch: 0, overflow: false,
                        };
                    }
                    // change column if space exhausted
                    else {
                        const nx = cx + cw;
                        ny = rect.y + b.y + b.height;
                        if (nx > maxx || ny > maxy) {
                            logger(`Space Exhausted Dropping Box`);
                            return { ...s, overflow: true };
                        }
                        else {
                            return {
                                boxes: boxes.concat([{
                                    ...b, x: nx, y: rect.y + b.y,
                                    children: updateChildBoxes(nx, ny, b.children),
                                }]),
                                cx: nx, cy: ny, cw: Math.max(s.cw, b.width), ch: 0, overflow: false,
                            };
                        }
                    }

                }, state).boxes;

            case 'horizontal': return items.reduce<LayoutState>((s) => {
                return s; // TODO
            }, state).boxes;
        }
    };

export const debugRect =
    (line: (rect: Rect, command: CommandLine) => Rect) =>
        (r: Rect) => line(r, {
            kind: 'Line',
            color: 'green',
            strokeWidth: 0.2,
            coords: [
                [0, 0],
                [r.width, 0],
                [r.width, r.height],
                [0, r.height],
                [0, 0],
            ],
        });


export const paintBoxes =
    (page: Page, boxes: Box[]) => {
        const image = renderImage(page);
        const text = renderText(page);
        const line = renderLine(page);
        const polygon = renderPolygon(page);
        const rect = renderRect(page);



        const processBox =
            (box: Box) => {
                printRect(box);
                if (debug.enabled('sdi:print/context')) {
                    debugRect(line)(box);
                }
                const { children } = box;
                for (let i = 0; i < children.length; i += 1) {
                    const child = children[i];
                    if (isBox(child)) {
                        processBox(child);
                    }
                    else if (isLayout(child)) {
                        processLayout(box, child).forEach(processBox);
                    }
                    else {
                        switch (child.kind) {
                            case 'Image': image(box, child); break;
                            case 'Text': text(box, child); break;
                            case 'Line': line(box, child); break;
                            case 'Polygon': polygon(box, child); break;
                            case 'Rect': rect(box, child); break;
                        }
                    }
                }
            };

        boxes.forEach(processBox);
    };

logger('loaded');
