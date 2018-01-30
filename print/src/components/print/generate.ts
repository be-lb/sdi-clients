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
import { fromNullable } from 'fp-ts/lib/Option';

import { IMapInfo } from 'sdi/source';
import { fromRecord } from 'sdi/locale';
import { PrintResponse } from 'sdi/map';


import { getTitle } from '../../queries/app';
import { getScaleLine } from '../../queries/map';
import { createContext, Box, makeImage, makeText, paintBoxes, makeLine, makeLayoutVertical, Rect, Coords, makeRect } from './context';
import { applySpec, ApplyFn } from './template';
import { renderLegend } from '../legend';
import { PrintProps, resolution } from './index';

const logger = debug('sdi:print');

const renderTitle =
    (f: ApplyFn<Box>, title: string) =>
        f('title', ({ rect, textAlign, fontSize }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(title, fontSize, '#006f90', textAlign),
                    makeText((new Date()).toLocaleDateString(), 8, 'grey'),
                ]),
            ],
        }));


const coordsFromRect =
    (rect: Rect): Coords[] => [
        [0, 0],
        [rect.width, 0],
        [rect.width, rect.height],
        [0, rect.height],
        [0, 0],
    ];

const renderMap =
    (f: ApplyFn<Box>, imageData: string) =>
        f('map', ({ rect, strokeWidth, color }) => ({
            ...rect,
            children: [
                makeImage(imageData),
                makeLine(coordsFromRect(rect), strokeWidth, color),
            ],
        }));

const renderScaleline =
    (f: ApplyFn<Box>) =>
        f('scaleline', ({ rect, strokeWidth, color, fontSize }) => {
            const { width, count, unit } = getScaleLine();
            const y = rect.height * 0.66;
            const sWidth = (width / (resolution / 72)) * 0.3528;
            const offset = (rect.width - sWidth) / 2;
            const scaleline: Coords[] = [
                [offset, y - 1],
                [offset, y],
                [offset + sWidth, y],
                [offset + sWidth, y - 1],
            ];

            logger(`scaleline ${count}${unit} : ${width}px => ${sWidth}pt`);

            return {
                ...rect,
                children: [
                    makeRect(coordsFromRect(rect), 'white'),
                    makeLine(scaleline, strokeWidth, color),
                    {
                        x: rect.x, y: rect.y + (rect.height / 3),
                        width: rect.width - offset, height: rect.height / 2,
                        children: [makeText(`${count} ${unit}`, fontSize, color, 'right')],
                    },
                ],
            };
        });


export const renderPDF =
    (mapInfo: IMapInfo, response: PrintResponse<PrintProps>) =>
        fromNullable(response.props).map((props) => {
            const { template } = props;
            const apply = applySpec(template);
            const pdf = createContext(props.orientation, props.format);
            const boxes: Box[] = [];
            const mapTitle = fromRecord(getTitle(mapInfo));

            renderTitle(apply, mapTitle)
                .map(b => boxes.push(b));

            renderMap(apply, response.data)
                .map(b => boxes.push(b));

            renderLegend(props.template, mapInfo)
                .map(b => boxes.push(b));

            renderScaleline(apply)
                .map(b => boxes.push(b));

            paintBoxes(pdf, boxes);

            pdf.save('map.pdf');
        });




logger('loaded');
