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

import { IMapInfo, ILayerInfo, LayerGroup } from 'sdi/source';
import { fromRecord } from 'sdi/locale';
import { scopeOption } from 'sdi/lib';


import legendItem from './legend-item';
import { Box, makeText, Layout } from '../context';
import { Spec, TemplateName, applySpec } from '../template';

const logger = debug('sdi:print/legend');


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
            });

        }, []);


// const groupMargin = 10;


const boxHeight =
    (bs: Box[]) =>
        bs.reduce<number>((acc, b) => acc + b.height, 0);

type SpecConfig = {
    legend: Spec;
    legendItem: Spec;
};

const renderGroups =
    (spec: SpecConfig, groups: Group[]): Box => {
        const items: Box[] =
            groups.reduce<Box[]>((boxes, group) => {
                const layers = group.layers.filter(l => l.visible === true);
                if (layers.length > 0) {
                    const items = layers.map(
                        (info) => {
                            const box = legendItem(spec.legendItem, info);
                            const label = info.legend;
                            box.name = `layer-${info.id}`;

                            logger(`box ${info.id} ${box.height}`);
                            if (label && fromRecord(label).trim().length > 0) {
                                const lfs = spec.legendItem.fontSize * 1.2;
                                const lc = makeText(fromRecord(label), lfs);
                                const lcBox: Box = {
                                    x: 0, y: 3, width: box.width, height: 7,
                                    children: [lc],
                                    name: `label-${info.id}`,
                                };
                                const ll: Layout = {
                                    direction: 'vertical',
                                    items: [lcBox, box],
                                };
                                return {
                                    x: 0, y: 0,
                                    width: box.width, height: box.height + 13,
                                    children: [ll],
                                    name: fromRecord(label),
                                };
                            }
                            return box;
                        });

                    if (group.g !== null) {
                        const gnfs = spec.legendItem.fontSize * 1.2;
                        const gnh = spec.legendItem.rect.height;
                        const groupName = makeText(
                            fromRecord(group.g.name),
                            gnfs,
                            spec.legendItem.color,
                            'left', 'center',
                        );
                        const groupNameBox: Box = {
                            x: 0, y: 0,
                            width: spec.legend.rect.width,
                            height: gnh,
                            children: [groupName],
                        };

                        const groupLayout: Layout = {
                            direction: 'vertical',
                            name: 'layout-vertical',
                            items: [
                                groupNameBox,
                                ...items,
                            ],
                        };
                        const groupBox: Box = {
                            name: `group-${fromRecord(group.g.name)}`,
                            x: 5, y: 0,
                            width: spec.legend.rect.width,
                            height: boxHeight(items) + gnh,
                            children: [groupLayout],
                        };

                        return boxes.concat(groupBox);
                    }
                    return boxes.concat(items);
                }
                return boxes;
            }, []);

        const boxed: Box = {
            ...spec.legend.rect,
            name: 'legend',
            children: [{
                direction: 'vertical',
                items,
            }],
        };

        logger(boxed);
        return boxed;
    };



export const renderLegend =
    (tn: TemplateName, mapInfo: IMapInfo) => {
        const withSpec = applySpec(tn);
        // f('legend', spec => renderGroups(spec, groupItems(mapInfo.layers))))
        return scopeOption()
            .let('legend', withSpec('legend', s => s))
            .let('legendItem', withSpec('legendItem', s => s))
            .map(
                scope => renderGroups(scope, groupItems(mapInfo.layers)));
    };



logger('loaded');
