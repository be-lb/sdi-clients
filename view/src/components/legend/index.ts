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
import { DIV, SPAN, H1, H2, NODISPLAY, IMG } from 'sdi/components/elements';
import { getMessageRecord, LayerGroup, ILayerInfo } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';
import { translateMapBaseLayer } from 'sdi/util';

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
            const layers = group.layers.filter(l => l.visible === true);
            if (layers.length === 0) {
                return DIV(); // FIXME - we can do better than that
            }
            const items = layers.map(legendItem);
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

const dataItem =
    (info: ILayerInfo) => (
        DIV({ className: 'layer-item' },
            DIV({ className: 'layer-actions' },
                SPAN({
                    className: info.visible ? 'visible' : 'hidden',
                    title: tr('visible'),
                    onClick: () => {
                        appEvents.setLayerVisibility(info.id, !info.visible);
                    },
                }),
                SPAN({
                    className: 'table',
                    title: tr('attributesTable'),
                    onClick: () => {
                        appEvents.setCurrentLayer(info.id);
                        appEvents.setLayout(AppLayout.MapAndTable);
                    },
                })),
            DIV({ className: 'layer-title' }, SPAN({},
                fromNullable(
                    appQueries.getDatasetMetadata(info.metadataId))
                    .fold(
                        info.id,
                        md => fromRecord(getMessageRecord(md.resourceTitle))))))
    );

const renderData =
    (groups: Group[]) =>
        groups.map((group) => {
            const items = group.layers.map(dataItem);
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
        return DIV({
            className: 'switcher infos',
            title: tr('mapTools'),
        }, switchItem('tools'));
    }

    return DIV({
        className: 'switcher infos',
        title: tr('mapLegend'),
    }, switchItem('legend'));

};


const wmsLegend =
    () => {
        const bl = appQueries.getCurrentBaseLayer();
        if (null === bl) {
            return NODISPLAY();
        }
        if (queries.displayWMSLegend()) {
            const tl = translateMapBaseLayer(bl)
            const lyrs = tl.params.LAYERS.split(',');
            const legends = lyrs.map(lyr => IMG({
                key: `legend-image-${tl.url}-${lyr}`,
                src: `${tl.url}?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=${tl.params.VERSION}&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${lyr}`,
            }));

            return DIV({},
                DIV({
                    onClick: () => events.setWMSLegendVisible(false),
                }, 'Hide WMS Legend'),
                ...legends)
        }

        return DIV({},
            DIV({
                onClick: () => events.setWMSLegendVisible(true),
            }, 'Show WMS Legend'))
    }

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
                                ...renderLegend(groupItems(mapInfo.layers)), wmsLegend()),
                            DIV({ className: 'datas-wrapper' },
                                H2({}, tr('mapDatas')),
                                ...renderData(groupItems(mapInfo.layers)))),
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
    return NODISPLAY();
};


export default legend;

logger('loaded');
