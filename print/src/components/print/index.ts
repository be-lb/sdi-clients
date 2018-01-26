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

import { DIV } from 'sdi/components/elements';
import { IMapInfo } from 'sdi/source';
import { fromRecord } from 'sdi/locale';
import { uniqId } from 'sdi/util';
import { PrintResponse } from 'sdi/map';


import { getMapInfo } from '../../queries/app';
import { setPrintRequest } from '../../events/map';
import { getInteractionMode, getPrintResponse } from '../../queries/map';
import { createContext, Box, makeImage, makeText, paintBoxes, makeLine, Orientation, Format, makeLayoutVertical } from './context';
import { applySpec, TemplateName, ApplyFn } from './template';
import { renderLegend } from '../legend';

const logger = debug('sdi:print');


export interface PrintProps {
    template: TemplateName;
    orientation: Orientation;
    format: Format;
}


const renderTitle =
    (f: ApplyFn<Box>, title: string) =>
        f('title', ({ rect }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(title, 24),
                    makeText((new Date()).toLocaleDateString(), 8),
                ]),
            ],
        }));


const renderMap =
    (f: ApplyFn<Box>, imageData: string) =>
        f('map', ({ rect, strokeWidth }) => ({
            ...rect,
            children: [
                makeImage(imageData),
                makeLine([
                    [rect.x, rect.y],
                    [rect.x + rect.width, rect.y],
                    [rect.x + rect.width, rect.y + rect.height],
                    [rect.x, rect.y + rect.height],
                    [rect.x, rect.y],
                ], strokeWidth, '#CCCCCC'),
            ],
        }));


const renderPDF =
    (mapInfo: IMapInfo, response: PrintResponse<PrintProps>) =>
        fromNullable(response.props).map((props) => {
            const apply = applySpec(props.template);
            const pdf = createContext(props.orientation, props.format);
            const boxes: Box[] = [];
            const mapTitle = fromRecord(mapInfo.title);

            renderTitle(apply, mapTitle)
                .map(b => boxes.push(b));

            renderMap(apply, response.data)
                .map(b => boxes.push(b));

            renderLegend(apply, mapInfo)
                .map(b => boxes.push(b));

            paintBoxes(pdf, boxes);

            pdf.save('map.pdf');
        });



const renderPrintProgress =
    (mapInfo: IMapInfo) => {
        const iLabel = getInteractionMode();
        if (iLabel !== 'print') {
            return DIV();
        }
        const response = getPrintResponse();
        switch (response.status) {
            case 'none': return DIV({}, 'Not Started');
            case 'start': return DIV({}, 'Started');
            case 'error': return DIV({}, 'Error');
            case 'end': return DIV({
                onClick: () => renderPDF(mapInfo, response),
            }, 'download PDF');
        }
    };


const renderButton =
    (label: string, props: PrintProps) =>
        DIV({
            onClick: () => {
                applySpec(props.template)('map', spec => spec.rect)
                    .map(({ width, height }) => {
                        const resolution = 72;
                        const id = uniqId();
                        setPrintRequest({
                            id, width, height, resolution, props,
                        });
                    });
            },
        }, label);

const legendLegend =
    (mapInfo: IMapInfo) =>
        DIV({ className: 'legend' },
            DIV({ className: 'print-block' },
                renderButton('Paysage A4', {
                    template: 'a4/landscape',
                    format: 'a4',
                    orientation: 'landscape',
                }),
                renderButton('Portrait A4', {
                    template: 'a4/portrait',
                    format: 'a4',
                    orientation: 'portrait',
                }),
            ),
            renderPrintProgress(mapInfo));


const render =
    () => getMapInfo().fold(
        () => DIV(),
        info => legendLegend(info),
    );


export default render;

logger('loaded');
