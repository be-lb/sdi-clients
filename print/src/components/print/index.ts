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

import { DIV, H1 } from 'sdi/components/elements';
import langSwitch from 'sdi/components/lang-switch';
import tr from 'sdi/locale';
import { IMapInfo, MessageRecord } from 'sdi/source';
import { uniqId } from 'sdi/util';


import { getMapInfo } from '../../queries/app';
import { setPrintRequest } from '../../events/map';
import { getInteractionMode, getPrintResponse } from '../../queries/map';
import { Orientation, Format } from './context';
import { applySpec, TemplateName } from './template';
import renderCustom from './custom';
import { renderPDF } from './generate';

const logger = debug('sdi:print');

export const resolution = 300;

export interface PrintProps {
    template: TemplateName;
    orientation: Orientation;
    format: Format;
}


export interface PrintState {
    customTitle: MessageRecord | null;
}

export const defaultPrintState =
    (): PrintState => ({
        customTitle: null,
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
            case 'start': return DIV({}, 'Downloading Base Map');
            case 'error': return DIV({}, 'Error');
            case 'end':
                window.setTimeout(
                    () => renderPDF(mapInfo, response), 1);
                return DIV({}, 'Render PDF');
        }
    };


const renderButton =
    (label: string, props: PrintProps) =>
        DIV({
            className: props.orientation,
            onClick: () => {
                applySpec(props.template)('map', spec => spec.rect)
                    .map(({ width, height }) => {
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
            H1({}, tr('printMap')),
            langSwitch(),
            renderCustom(mapInfo),
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
