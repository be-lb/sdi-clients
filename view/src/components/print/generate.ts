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

import { IMapInfo, makeRecord } from 'sdi/source';
import { fromRecord, formatNumber } from 'sdi/locale';
import { PrintResponse, PrintRequest } from 'sdi/map';
import {
    createContext,
    Box,
    makeImage,
    makeText,
    paintBoxes,
    makeLine,
    makeLayoutVertical,
    Rect,
    Coords,
    makePolygon,
} from 'sdi/print/context';

import appEvents from '../../events/app';
import { getPrintTitle } from '../../queries/app';
import { stopPrint } from '../../events/map';
import { applySpec, ApplyFn } from './template';
import { renderLegend } from './legend';
import { PrintProps } from './index';
import { logoData } from './logo';
import { AppLayout } from '../../shape/types';

const logger = debug('sdi:view/print');

const renderTitle =
    (f: ApplyFn<Box>, title: string) =>
        f('title', ({ rect, textAlign, fontSize }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(title, fontSize, '#006f90', textAlign),
                    // makeText((new Date()).toLocaleDateString(), 8, 'grey'),
                ]),
            ],
        }));


const renderAttribution =
    (f: ApplyFn<Box>) =>
        f('attribution', ({ rect, textAlign, fontSize, color }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText('Bruxelles Environnement / Leefmilieu Brussel', fontSize, color, textAlign),
                ]),
            ],
        }));

const renderCredits =
    (f: ApplyFn<Box>) =>
        f('credits', ({ rect, textAlign, fontSize, color }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(fromRecord(makeRecord(
                        'Fond de plan: Brussels UrbIS ®© - CIRB - CIBG',
                        'Achtergrond: Brussels UrbIS ®© - CIRB - CIBG')), fontSize, color, textAlign),
                ]),
            ],
        }));


const coordsFromRect =
    (rect: Rect, strokeWidth: number): Coords[] => [
        [-(strokeWidth / 2), 0],
        [rect.width, 0],
        [rect.width, rect.height],
        [0, rect.height],
        [0, -(strokeWidth / 2)],
    ];


const renderMap =
    (f: ApplyFn<Box>, imageData: string) =>
        f('map', ({ rect, strokeWidth, color }) => ({
            ...rect,
            children: [
                makeImage(imageData),
                makeLine(coordsFromRect(rect, strokeWidth), strokeWidth, color),
            ],
        }));

const scaleLineCount = [
    1,
    2,
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    2000,
    5000,
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000,
    5000000,
    10000000,
    20000000,
    50000000,
    100000000,
];


const renderScaleline =
    (f: ApplyFn<Box>, response: PrintResponse<PrintProps>) =>
        f('scaleline', ({ rect, strokeWidth, color, fontSize }) => {
            const mapRectWidth = ((f as any) as ApplyFn<number>)('map', spec => spec.rect.width).fold(1, w => w);

            const ext = response.extent;
            logger(`scaleline extent ${ext}`)
            const mw = ext[2] - ext[0];

            const pointsize = mw / mapRectWidth;
            const count = scaleLineCount.find(s => (s / pointsize) >= rect.width) || 0;
            const sWidth = count / pointsize;
            const unit = 'm';
            const y = rect.height * 0.66;

            const offset = rect.width - sWidth;
            const scaleline: Coords[] = [
                [offset, y - 1],
                [offset, y],
                [offset + sWidth, y],
                [offset + sWidth, y - 1],
            ];

            return {
                ...rect,
                children: [
                    makeLine(scaleline, strokeWidth, color),
                    {
                        x: rect.x + offset,
                        y: rect.y + (rect.height / 3),
                        width: sWidth,
                        height: rect.height / 2,
                        children: [
                            makeText(`${formatNumber(count)} ${unit}`,
                                fontSize, color, 'center'),
                        ],
                    },
                ],
            };
        });

const renderNorthArrow =
    (f: ApplyFn<Box>) =>
        f('north', ({ rect, color }) => {
            const naSz = rect.width;
            const northArrow: Coords[] = [
                [naSz / 7.25, naSz / 7.25],
                [naSz / 2, naSz / 1.2],
                [naSz / 1.2, naSz / 7.25],
                [naSz / 2, naSz / 3.2],
            ].map(c => [c[0], naSz - c[1]] as Coords);

            return {
                ...rect,
                children: [
                    makePolygon(northArrow, color),
                ],
            };
        });



const renderLogo =
    (f: ApplyFn<Box>) =>
        f('logo', ({ rect }) => ({
            ...rect,
            children: [
                makeImage(logoData),
            ],
        }));

export const renderPDF =
    (mapInfo: IMapInfo, _request: PrintRequest<PrintProps>, response: PrintResponse<PrintProps>) =>
        fromNullable(response.props).map((props) => {
            const { template } = props;
            const apply = applySpec(template);
            const pdf = createContext(props.orientation, props.format);
            const boxes: Box[] = [];
            const mapTitle = fromRecord(getPrintTitle(mapInfo));

            renderTitle(apply, mapTitle)
                .map(b => boxes.push(b));

            renderMap(apply, response.data)
                .map(b => boxes.push(b));

            renderLegend(props.template, mapInfo)
                .map(b => boxes.push(b));

            renderScaleline(apply, response)
                .map(b => boxes.push(b));

            renderNorthArrow(apply)
                .map(b => boxes.push(b));

            renderLogo(apply)
                .map(b => boxes.push(b));

            renderCredits(apply)
                .map(b => boxes.push(b));

            renderAttribution(apply)
                .map(b => boxes.push(b));

            paintBoxes(pdf, boxes);

            pdf.save(`${fromRecord(getPrintTitle(mapInfo))}.pdf`);
            stopPrint();
            appEvents.setLayout(AppLayout.MapAndInfo);
        });




logger('loaded');
