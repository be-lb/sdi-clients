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
import { ReactNode } from 'react';

import { DIV, SPAN, H1, H2, NODISPLAY, IMG } from 'sdi/components/elements';
import { getMessageRecord, LayerGroup, ILayerInfo, IMapInfo } from 'sdi/source';
import tr, { fromRecord, formatDate } from 'sdi/locale';
import { translateMapBaseLayer } from 'sdi/util';
import { divTooltipLeft, divTooltipTopRight } from 'sdi/components/tooltip';

import queries from '../../queries/legend';
import events from '../../events/legend';
import appEvents from '../../events/app';
import appQueries from '../../queries/app';
import legendItem from './legend-item';
import info from './../map-info';
import { AppLayout, LegendPage } from '../../shape/types';
import { MessageKey } from 'sdi/locale/message-db';
import webservices from '../legend-tools/webservices';
import print from '../legend-tools/print';
import share from '../legend-tools/share';
import location from '../legend-tools/location';
import measure from '../legend-tools/measure';
import { helpText } from 'sdi/components/helptext';
// import mapInfo from './../map-info';


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
            });

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
    (info: ILayerInfo) =>
        DIV({ className: 'layer-item' },
            DIV({ className: 'layer-actions' },
                divTooltipTopRight(
                    tr('visible'),
                    {},
                    SPAN({
                        className: info.visible ? 'visible' : 'hidden',
                        onClick: () => {
                            appEvents.setLayerVisibility(info.id, !info.visible);
                        },
                    })),
                divTooltipTopRight(
                    tr('attributesTable'),
                    {},
                    SPAN({
                        className: 'table',
                        onClick: () => {
                            appEvents.setCurrentLayer(info.id);
                            appEvents.setLayout(AppLayout.MapAndTable);
                        },
                    })),
            ),

            DIV({ className: 'layer-title' },
                fromNullable(
                    appQueries.getDatasetMetadata(info.metadataId))
                    .fold(
                        info.id,
                        md => appQueries.getLayerData(md.uniqueResourceIdentifier)
                            .fold<ReactNode>(
                                err => SPAN({
                                    className: 'error',
                                    title: err,
                                }, fromRecord(getMessageRecord(md.resourceTitle))),
                                () => SPAN({}, fromRecord(getMessageRecord(md.resourceTitle)))))));

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



const switchItem = (p: LegendPage, tk: MessageKey, currentPage: LegendPage) => {
    return divTooltipLeft(tr(tk), {
        className: `switch-item switch-${p} ${p === currentPage ? 'active' : ''}`,
        onClick: () => {
            appEvents.setLayout(AppLayout.MapFS);
            appEvents.unsetCurrentFeature();
            events.setPage(p);
        },
    }, DIV({ className: 'picto' }));
};


export const switcher = () => {
    const currentPage = queries.currentPage();
    return DIV({
        className: 'switcher',
    },
        switchItem('info', 'tooltip:info', currentPage),
        switchItem('legend', 'tooltip:legend', currentPage),
        switchItem('data', 'tooltip:data', currentPage),
        switchItem('base-map', 'tooltip:base-map', currentPage),
        switchItem('print', 'tooltip:print', currentPage),
        switchItem('share', 'tooltip:ishare', currentPage),
        switchItem('measure', 'tooltip:measure', currentPage),
        switchItem('locate', 'tooltip:locate', currentPage),
    );
};


const wmsLegend =
    () => {
        const bl = appQueries.getCurrentBaseLayer();
        if (null === bl) {
            return NODISPLAY();
        }
        if (queries.displayWMSLegend()) {
            const tl = translateMapBaseLayer(bl);
            const lyrs = tl.params.LAYERS.split(',').reverse();
            const legends = lyrs.map(lyr =>
                DIV({
                    className: 'wms-legend-item',
                    key: `legend-image-${tl.url}-${lyr}`,
                }, IMG({
                    src: `${tl.url}?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=${tl.params.VERSION}&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${lyr}`,
                })));

            return DIV({ className: 'wms-legend-wrapper' },
                DIV({
                    className: 'wms-legend-switch opened',
                    onClick: () => events.setWMSLegendVisible(false),
                }, tr('wmsLegendHide')),
                ...legends);
        }

        return DIV({ className: 'wms-legend-wrapper' },
            DIV({
                className: 'wms-legend-switch closed',
                onClick: () => events.setWMSLegendVisible(true),
            }, tr('wmsLegendDisplay')));
    };



const wrapLegend =
    (...es: ReactNode[]) =>
        DIV({ className: 'map-legend' }, ...es);



const renderMapInfoHeader =
    (mapInfo: IMapInfo, p: LegendPage) => DIV({
        className: `legend-header legend-header-${p}`,
    },
        H1({}, fromRecord(mapInfo.title)),
        DIV({ className: 'map-date' },
            SPAN({ className: 'map-date-label' }, tr('lastModified')), ' ',
            SPAN({ className: 'map-date-value' },
                formatDate(new Date(mapInfo.lastModified)))),
    );




const renderMapInfo =
    (mapInfo: IMapInfo) =>
        wrapLegend(
            renderMapInfoHeader(mapInfo, 'info'),
            DIV({ className: 'legend-main' },
                info()));

const renderMapLegend =
    (mapInfo: IMapInfo) =>
        wrapLegend(
            renderMapInfoHeader(mapInfo, 'legend'),
            DIV({ className: 'styles-wrapper' },
                H2({}, tr('mapLegend')),
                ...renderLegend(groupItems(mapInfo.layers)), wmsLegend()));

const renderMapData =
    (mapInfo: IMapInfo) =>
        wrapLegend(
            renderMapInfoHeader(mapInfo, 'data'),
            DIV({ className: 'datas-wrapper' },
                H2({}, tr('mapData')),
                helpText(tr('mapDataHelp')),
                ...renderData(groupItems(mapInfo.layers))));


const legend =
    () => {
        const currentPage = queries.currentPage();
        const mapInfo = appQueries.getMapInfo();
        if (mapInfo) {
            switch (currentPage) {
                case 'info': return renderMapInfo(mapInfo);
                case 'legend': return renderMapLegend(mapInfo);
                case 'data': return renderMapData(mapInfo);
                case 'base-map': return wrapLegend(renderMapInfoHeader(mapInfo, 'base-map'), webservices());
                case 'print': return wrapLegend(renderMapInfoHeader(mapInfo, 'print'), print());
                case 'share': return wrapLegend(renderMapInfoHeader(mapInfo, 'share'), share());
                case 'measure': return wrapLegend(renderMapInfoHeader(mapInfo, 'measure'), measure());
                case 'locate': return wrapLegend(renderMapInfoHeader(mapInfo, 'locate'), location());
            }
        }
        return NODISPLAY();

    };


export default legend;

logger('loaded');
