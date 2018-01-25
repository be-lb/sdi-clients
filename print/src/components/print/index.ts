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

import { DIV, H1, A, H2 } from 'sdi/components/elements';
import { IMapInfo, ILayerInfo, LayerGroup } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';
import { getRoot } from 'sdi/app';
import { uniqId } from 'sdi/util';


import legendItem from './legend-item';
import { getMapInfo } from '../../queries/app';
import { setPrintRequest } from '../../events/map';
import { getInteractionMode, getPrintResponse } from '../../queries/map';

const logger = debug('sdi:legend');


const renderTitle =
    () => getMapInfo().fold(
        () => DIV(),
        mapInfo => DIV({ className: 'map-title' },
            H1({}, A({ href: `${getRoot()}view`, target: '_top' }, fromRecord(mapInfo.title)))));


interface Group {
    g: LayerGroup | null;
    layers: ILayerInfo[];
}

const groupItems =
    (layers: ILayerInfo[]) =>
        layers.slice().reverse().reduce<Group[]>((acc, info) => {
            const ln = acc.length;
            if (ln === 0) {
                return [{
                    g: info.group,
                    layers: [info],
                }];
            }
            const prevGroup = acc[ln - 1];
            const cg = info.group;
            const pg = prevGroup.g;
            // Cases:
            // info.group == null && prevGroup.g == null => append
            // info.group != null && prevGroup.g != null && info.group.id == prevGroup.id => append
            if ((cg === null && pg === null)
                || (cg !== null && pg !== null && cg.id === pg.id)) {
                prevGroup.layers.push(info);
                return acc;
            }
            // info.group == null && prevGroup.g != null => new
            // info.group != null && prevGroup.g == null => new
            // info.group != null && prevGroup.g != null && info.group.id != prevGroup.id => new

            return acc.concat({
                g: cg,
                layers: [info],
            })

        }, []);


const renderLegend =
    (groups: Group[]) =>
        groups.map((group) => {
            const items = group.layers.map(legendItem);
            if (group.g !== null) {
                return (
                    DIV({ className: 'legend-group named' },
                        DIV({ className: 'legend-group-title' },
                            fromRecord(group.g.name)),
                        DIV({ className: 'legend-group-items' }, items)));
            }
            return (
                DIV({ className: 'legend-group anonymous' }, items));
        });


type Dim = [number, number];
const dims = {
    a0: [1189, 841] as Dim,
    a1: [841, 594] as Dim,
    a2: [594, 420] as Dim,
    a3: [420, 297] as Dim,
    a4: [297, 210] as Dim,
    a5: [210, 148] as Dim,
};


const renderPrintProgress =
    (_mapInfo: IMapInfo) => {
        const iLabel = getInteractionMode();
        if (iLabel !== 'print') {
            return DIV();
        }
        const response = getPrintResponse();
        const imageData = response.data;
        switch (response.status) {
            case 'none': return DIV({}, 'Not Started');
            case 'start': return DIV({}, 'Started');
            case 'error': return DIV({}, 'Error');
            case 'end': return DIV({
                onClick: () => {
                    const pdf = new Pdf('portrait', undefined, 'a4');
                    const [height, width] = dims.a4;
                    pdf.addImage(
                        imageData, 'PNG', 0, 0, width, height);
                    pdf.text('TEXT', width / 2, height / 2);
                    // const legend = document.createElement('div');
                    // domRender(renderLegend(groupItems(mapInfo.layers)), legend);
                    // pdf.addHTML(legend, 10, dims.a4[0] / 2, {}, () => {
                    // });
                    pdf.save('map.pdf');
                },
            }, 'download PDF');
        }
    };


const legendLegend =
    (mapInfo: IMapInfo) =>
        DIV({ className: 'legend' },
            renderTitle(),
            DIV({ className: 'print-block' },
                DIV({
                    onClick: () => {
                        const [height, width] = dims.a4;
                        const resolution = 150;
                        const id = uniqId();
                        setPrintRequest({
                            id, width, height, resolution,
                        });
                    },
                }, 'print!')),
            renderPrintProgress(mapInfo),
            H2({}, tr('mapLegend')),
            ...renderLegend(groupItems(mapInfo.layers)));


const render =
    () => getMapInfo().fold(
        () => DIV(),
        info => legendLegend(info),
    );


export default render;

logger('loaded');
