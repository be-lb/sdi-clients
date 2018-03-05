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

import { DIV, NODISPLAY } from 'sdi/components/elements';
import { MessageRecord, IMapInfo } from 'sdi/source';
import tr from 'sdi/locale';


import queries from '../../queries/app';
import { getInteractionMode, getPrintResponse } from '../../queries/map';
import { setPrintResponse } from '../../events/map';
import { Orientation, Format } from './context';
import { TemplateName } from './template';
import { renderPDF } from './generate';
import { ReactNode } from 'react';


const logger = debug('sdi:print');

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


const wrap =
    (...children: ReactNode[]) =>
        DIV({ className: 'print-progress' }, ...children);

const wrapItem =
    (passed: boolean, current: boolean, ...children: ReactNode[]) =>
        DIV({
            className: `print-progress-item ${passed ? 'done' : (current ? 'doing' : 'todo')}`,
        }, ...children);


const renderInitial =
    (step: number) =>
        wrapItem(step > 0, step === 0,
            DIV({}, tr('printNotStarted')));

const renderDownload =
    (step: number) =>
        wrapItem(step > 1, step === 1,
            DIV({}, tr('printDownloadingBaseMap')));

const renderPrepare =
    (step: number) =>
        wrapItem(step > 2, step === 2,
            DIV({}, tr('printPreparingPDF')));

const renderItems =
    (step: number) =>
        wrap(
            renderInitial(step),
            renderDownload(step),
            renderPrepare(step),
        );

const renderError =
    () => wrap(DIV({}, 'Error'));

const renderPrintProgress =
    (mapInfo: IMapInfo) => {
        const iLabel = getInteractionMode();
        if (iLabel !== 'print') {
            return DIV({}, 'ERROR: Not Printing');
        }
        const response = getPrintResponse();
        switch (response.status) {
            case 'error': return renderError();
            case 'none': return renderItems(0);
            case 'start': return renderItems(1);
            case 'end':
                window.setTimeout(
                    () => renderPDF(mapInfo, response), 0);
                setPrintResponse({
                    id: response.id,
                    data: '',
                    status: 'done',
                    props: response.props,
                });
                return renderItems(2);
        }
        return renderItems(3);
    };

const render =
    () =>
        fromNullable(queries.getMapInfo())
            .fold(NODISPLAY(), renderPrintProgress);

export default render;

logger('loaded');
