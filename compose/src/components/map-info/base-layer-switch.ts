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
import events from '../../events/app';
import queries from '../../queries/app';
import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
// import { IMapBaseLayer } from 'sdi/source';
// import { hashMapBaseLayer } from 'sdi/util';

const logger = debug('sdi:map-info/base-layer-switch');

// const baseLayers: IMapBaseLayer[] = [
//     {
//         name: {
//             fr: 'urbisFRGray',
//             nl: 'urbisNLGray', // ?
//         },
//         srs: 'EPSG:31370',
//         params: {
//             LAYERS: {
//                 fr: 'urbis{LANG#upper}Gray',
//                 nl: 'urbisNLGray', // ?
//             },
//             VERSION: '1.1.1',
//         },
//         url: {
//             fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
//             nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
//         },
//     },
//     {
//         name: {
//             fr: 'Ortho2016',
//             nl: 'Ortho2016',
//         },
//         srs: 'EPSG:31370',
//         params: {
//             LAYERS: {
//                 fr: 'Urbis:Ortho2016',
//                 nl: 'Urbis:Ortho2016',
//             },
//             VERSION: '1.1.1',
//         },
//         url: {
//             fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
//             nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
//         },
//     },
// ];

const baseLayers = [
    'urbis.irisnet.be/urbis_gray',
    'urbis.irisnet.be/ortho_2016',
]

const render = () => {
    const current = queries.getCurrentBaseLayerName();
    if (current) {
        let className: string;
        let other: string;

        // if (hashMapBaseLayer(current) === hashMapBaseLayer(baseLayers[0])) {
        if (current === baseLayers[0]) {
            className = 'switch-background-ortho';
            other = baseLayers[1];
        }
        else {
            className = 'switch-background-bn';
            other = baseLayers[0];
        }

        return (
            DIV({ className: 'switcher', title: tr('changeBackgroundMap') },
                DIV({ className, onClick: () => events.setMapBaseLayer(other) }))
        );
    }

    return DIV({}, 'baseless');
};

export default render;

logger('loaded');
