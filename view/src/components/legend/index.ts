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
import { DIV, SPAN, H1, H2 } from '../elements';
import queries from '../../queries/legend';
import events from '../../events/legend';
import appEvents from '../../events/app';
import appQueries from '../../queries/app';
import tr, { fromRecord } from '../../locale';
import { AppLayout, LegendPage } from '../../shape';
import legendItem from './legend-item';
import legendTools from './../legend-tools';
import info from './../map-info';
import { IMapInfo, getMessageRecord } from 'sdi/source';

const logger = debug('sdi:legend');

const legendLegend = (mapInfo: IMapInfo) => {
    return (
        mapInfo.layers
            .slice()
            .reverse()
            .reduce<React.DOMElement<{}, Element>[]>((acc, info) => {
                if (info.visible) {
                    const items = legendItem(info);
                    return acc.concat(items);
                }
                return acc;
            }, [])
    );
};


const legendDatas = (mapInfo: IMapInfo) => {
    return mapInfo.layers.map((layer) => {
        const metadata = appQueries.getDatasetMetadata(layer.metadataId);
        let name = layer.id;
        if (metadata) {
            name = fromRecord(getMessageRecord(metadata.resourceTitle));
        }
        return DIV({ className: 'layer-item' },
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
    });
};





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
        return DIV({ className: 'switcher' }, switchItem('tools'));
    }

    return DIV({ className: 'switcher' }, switchItem('legend'));

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
