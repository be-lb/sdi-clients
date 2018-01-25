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

import * as Pdf from 'jspdf';

export type Orientation = 'landscape' | 'portrait';

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
}

export type Coords = [number, number];



export interface CommandImage {
    kind: 'Image';
    data: string;
}

export

    export interface CommandText {
    kind: 'Text';
    data: string;
    fontSize: number;
    color: string;
}


export interface CommandLine {
    kind: 'Line';
    strokeWidth: number;
    coords: Coords[];
    color: string;
}


export type Command =
    | CommandImage
    | CommandText
    | CommandLine
    ;


export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Box = Rect & {
    children: Command[] | Box;
};

const isBox = (a: Command[] | Box): a is Box => {
    return (!Array.isArray(a)) && 'children' in a;
}


export const createContext =
    (o: Orientation, f: Format): Page => {
        const [height, width] = dims[f];
        const page = Object.assign(
            new Pdf(o, 'in', f), { width, height });
        page.setFont('helvetica', 'normal');
        return page;
    };

const renderImage =
    (page: Page) =>
        (rect: Rect, command: CommandImage) => {
            const { x, y, width, height } = rect;
            const { data } = command;
            page.addImage(
                data, 'PNG', x, y, width, height);

            return rect;
        };

const renderText =
    (page: Page) =>
        (rect: Rect, command: CommandText) => {
            const { x, y, width, height } = rect;
            const { data, fontSize } = command;
            const lines = page
                .setFontSize(fontSize)
                .splitTextToSize(data, width);
            page.text(lines, x, y);

            const textHeight = lines.length * fontSize * page.getLineHeight() / 72;
            return { x, y: y + textHeight, width, height: height - textHeight };
        };

const renderLine =
    (page: Page) =>
        (rect: Rect, command: CommandLine) => {
            const { x, y } = rect;
            const { coords, strokeWidth, color } = command;
            if (coords.length > 1) {
                page.context2d.setLineWidth(strokeWidth);
                page.context2d.setStrokeStyle(color);
                const start = coords[0];
                page.context2d.moveTo(x + start[0], y + start[1]);
                coords.slice(1)
                    .forEach(c => page.context2d.lineTo(x + c[0], y + c[1]));
                page.context2d.stroke();
            }

            return rect;
        };


export const render =
    (page: Page, boxes: Box[]) => {
        const image = renderImage(page);
        const text = renderText(page);
        const line = renderLine(page);

        const rects: Rect[] = [{
            x: 0, y: 0, width: 100, height: 100,
        }];

        const pushRect =
            (r: Rect) => {
                const pr = rects[rects.length - 1];
                const nr = {
                    x: r.x + pr.x,
                    y: r.y + pr.y,
                    width: r.width,
                    height: r.height,
                };
                rects.push(nr);
                return {
                    x: nr.x * pr.width / 100,
                    y: nr.y * pr.height / 100,
                    width: nr.width * pr.width / 100,
                    height: nr.height * pr.height / 100,
                };
            };

        const processBox =
            (box: Box) => {
                const rect = pushRect(box);
                const { children } = box;
                if (isBox(children)) {
                    processBox(children);
                }
                else {
                    children.reduce((r, command) => {
                        switch (command.kind) {
                            case 'Image': return image(r, command);
                            case 'Text': return text(r, command);
                            case 'Line': return line(r, command);
                        }
                    }, rect);
                }
                rects.pop();
            };

        boxes.forEach(processBox);
    };

