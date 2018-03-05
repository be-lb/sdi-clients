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

import tr from 'sdi/locale';
import { DIV, H2 } from 'sdi/components/elements';
import { IMapInfo } from 'sdi/source';
import { uniqId } from 'sdi/util';

import queries from '../../queries/app';
import events from '../../events/app';
import { setPrintRequest } from '../../events/map';
import { PrintProps } from '../print';
import { applySpec, getResolution } from '../print/template';
import renderCustom from '../print/custom';
import { AppLayout } from '../../shape/types';

const logger = debug('sdi:tool-print');


const renderButton =
    (label: string, props: PrintProps) =>
        DIV({
            className: props.orientation,
            onClick: () => {
                const resolution = getResolution(props.template);
                applySpec(props.template)('map', spec => spec.rect)
                    .map(({ width, height }) => {
                        events.setLayout(AppLayout.Print);
                        const id = uniqId();
                        setPrintRequest({
                            id, width, height, resolution, props,
                        });
                    });
            },
        }, label);


const renderBody =
    (mapInfo: IMapInfo) =>
        DIV({ className: 'tool-body' },
            renderCustom(mapInfo),
            DIV({ className: 'print-block' },
                renderButton('A4', {
                    template: 'a4/landscape',
                    format: 'a4',
                    orientation: 'landscape',
                }),
                renderButton('A4', {
                    template: 'a4/portrait',
                    format: 'a4',
                    orientation: 'portrait',
                }),
                renderButton('A0', {
                    template: 'a0/portrait',
                    format: 'a0',
                    orientation: 'portrait',
                }),
            ));


const render =
    () =>
        fromNullable(queries.getMapInfo())
            .fold(
                DIV({}, 'Print: Somethin missing'),
                mapInfo =>
                    DIV({ className: 'tool-group share-embed' },
                        DIV({ className: 'tool print' },
                            H2({}, tr('printMap')),
                            renderBody(mapInfo))));


export default render;

logger('loaded');
