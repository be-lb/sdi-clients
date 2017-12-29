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
import { DIV, SPAN, H1, H2 } from 'sdi/components/elements';
import { IMapInfo, getMessageRecord, LayerGroup } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';

import queries from '../../queries/legend';
import events from '../../events/legend';
import appEvents from '../../events/app';
import appQueries from '../../queries/app';
import legendItem from './legend-item';
import legendTools from './../legend-tools';
import info from './../map-info';
import { AppLayout, LegendPage } from '../../shape/types';
import { fromNullable } from 'fp-ts/lib/Option';

const logger = debug('sdi:legend');


interface TaggedNode<T> {
    node: React.ReactNode | React.ReactNode[];
    tag: T;
}

type GroupOrNull = LayerGroup | null;

const makeGroupWithLabel =
    (group: LayerGroup, items: React.ReactNode[]) => (
        DIV({ className: 'legend-group' },
            DIV({ className: 'legend-group-title' },
                fromRecord(group.name)),
            items));

const makeGroup =
    (items: React.ReactNode[]) => (
        DIV({ className: 'legend-group' }, items));

const legendLegend =
    (mapInfo: IMapInfo) =>
        mapInfo.layers
            .slice()
            .reverse()
            .reduce<TaggedNode<GroupOrNull>[]>((acc, info) => {
                if (info.visible) {
                    const accL = acc.length;
                    const previousGroup = accL > 0 ? acc[accL - 1].tag : null;
                    const items = legendItem(info);
                    if (info.group) {
                        if (previousGroup
                            && previousGroup.id === info.group.id) {
                            return acc.concat({
                                node: makeGroup(items),
                                tag: info.group,
                            });
                        }
                        return acc.concat({
                            node: makeGroupWithLabel(info.group, items),
                            tag: info.group,
                        });
                    }
                    return acc.concat({
                        node: items,
                        tag: info.group,
                    });
                }
                return acc;
            }, [])
            .map(tn => tn.node);


const legendDatas =
    (mapInfo: IMapInfo) =>
        mapInfo.layers
            .slice()
            .reverse()
            .map((layer, idx, layers) => {
                const name = fromNullable(
                    appQueries.getDatasetMetadata(layer.metadataId))
                    .fold(
                    () => layer.id,
                    md => fromRecord(getMessageRecord(md.resourceTitle)));

                const node = DIV({ className: 'layer-item' },
                    DIV({ className: 'layer-actions' },
                        SPAN({
                            className: layer.visible ? 'visible' : 'hidden',
                            title: tr('visible'),
                            onClick: () => {
                                appEvents.setLayerVisibility(layer.id, !layer.visible);
                            },
                        }),
                        SPAN({
                            className: 'table',
                            title: tr('attributesTable'),
                            onClick: () => {
                                appEvents.setCurrentLayer(layer.id);
                                appEvents.setLayout(AppLayout.MapAndTable);
                            },
                        })),
                    DIV({ className: 'layer-title' }, SPAN({}, name)));

                const pg = idx > 0 ? layers[idx - 1].group : null;
                if (layer.group) {
                    if (pg && pg.id === layer.group.id) {
                        return makeGroup([node]);
                    }
                    return makeGroupWithLabel(layer.group, [node]);
                }
                return node;
            });






const footer = () => {
    return DIV({ className: 'legend-footer' });
};


const switchItem = (p: LegendPage) => {
    return DIV({
        className: `switch-${p}`,
        onClick: () => {
            events.setPage(p);
        },
    });
};

export const switcher = () => {
    const currentPage = queries.currentPage();
    if (currentPage === 'legend') {
        return DIV({ className: 'switcher infos' }, switchItem('tools'));
    }

    return DIV({ className: 'switcher infos' }, switchItem('legend'));

};

const legend = () => {
    const currentPage = queries.currentPage();
    const mapInfo = appQueries.getMapInfo();
    if (mapInfo) {
        switch (currentPage) {
            case 'legend':
                return (
                    DIV({ className: 'map-legend' },
                        DIV({ className: 'legend-header' },
                            H1({}, fromRecord(mapInfo.title))),
                        DIV({ className: 'legend-main' },
                            info(),
                            DIV({ className: 'styles-wrapper' },
                                H2({}, tr('mapLegend')),
                                ...legendLegend(mapInfo)),
                            DIV({ className: 'datas-wrapper' },
                                H2({}, tr('mapDatas')),
                                ...legendDatas(mapInfo))),
                        footer())
                );

            case 'tools':
                return (
                    DIV({ className: 'map-legend' },
                        DIV({ className: 'legend-header' },
                            H1({}, fromRecord(mapInfo.title))),
                        DIV({ className: 'legend-main' },
                            DIV({ className: 'tools-wrapper' },
                                ...legendTools())),
                        footer())
                );
        }
    }
    return DIV();
};


export default legend;

logger('loaded');
