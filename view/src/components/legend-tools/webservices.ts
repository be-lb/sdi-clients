
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

import { DIV, H2, NODISPLAY, SPAN } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { translateMapBaseLayer } from 'sdi/util';
import { IMapBaseLayer } from 'sdi/source';

import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import { helpText } from 'sdi/components/helptext';

const logger = debug('sdi:webservices');

const renderCurrentBaseLayer =
    (bl: IMapBaseLayer) => {
        const tl = translateMapBaseLayer(bl);
        // const lyrs = tl.params.LAYERS.split(',');
        // const legends = lyrs.map(lyr => IMG({
        //     key: `legend-image-${tl.url}-${lyr}`,
        //     src: `${tl.url}?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=${tl.params.VERSION}&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${lyr}`,
        // }));

        return DIV({ className: 'base-layer active' },
            SPAN({}, tl.name));
    };


const renderBaseLayer =
    (id: string, current: string | null) =>
        fromNullable(appQueries.gteBaseLayer(id)).fold(
            NODISPLAY(),
            (bl) => {
                if (id === current) {
                    return renderCurrentBaseLayer(bl);
                }
                return DIV({
                    className: `base-layer`,
                    onClick: () => appEvents.setMapBaseLayer(id),
                }, fromRecord(bl.name));
            });


const renderService =
    (service: string) =>
        DIV({ className: 'webservice' },
            DIV({ className: 'webservice-name' }, service),
            appQueries.getBaseLayersForService(service)
                .map(id =>
                    renderBaseLayer(id, appQueries.getCurrentBaseLayerName())));


const webservices =
    () => {
        const services = appQueries.getBaseLayerServices();
        return DIV({ className: 'tool wms-picker' },
            H2({}, tr('wmsSwitch')),
            helpText(tr('wmsSwitchHelpText')),
            DIV({ className: 'tool-body' }, services.map(renderService)));
    };


export default webservices;

logger('loaded');
