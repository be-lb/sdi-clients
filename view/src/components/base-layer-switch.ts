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
import { selectBaseLayer } from '../events/map';
import queries from '../queries/app';
import { DIV } from 'sdi/components/elements';
// import { fromRecord } from '../../locale';
import { IMapBaseLayer } from 'sdi/source';
import { hashMapBaseLayer } from 'sdi/util';

const logger = debug('sdi:map-info/base-layer-switch');

const baseLayers: IMapBaseLayer[] = [
    {
        name: {
            fr: 'urbisFRGray',
            nl: 'urbisNLGray', // ?
        },
        srs: 'EPSG:31370',
        params: {
            LAYERS: {
                fr: 'urbisFRGray',
                nl: 'urbisNLGray', // ?
            },
            VERSION: '1.1.1',
        },
        url: {
            fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
        },
    },
    {
        name: {
            fr: 'Ortho2016',
            nl: 'Ortho2016',
        },
        srs: 'EPSG:31370',
        params: {
            LAYERS: {
                fr: 'Urbis:Ortho2016',
                nl: 'Urbis:Ortho2016',
            },
            VERSION: '1.1.1',
        },
        url: {
            fr: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
            nl: 'https://geoservices-urbis.irisnet.be/geoserver/ows',
        },
    },
];

const render = () => {
    const current = queries.getCurrentBaseLayer();
    if (current) {
        let className: string;
        let other: string;

        if (hashMapBaseLayer(current) === hashMapBaseLayer(baseLayers[0])) {
            className = 'switch-background-ortho';
            other = hashMapBaseLayer(baseLayers[1]);
        }
        else {
            className = 'switch-background-bn';
            other = hashMapBaseLayer(baseLayers[0]);
        }

        return (
            DIV({
                className: 'switcher',
                onClick: () => selectBaseLayer(other),
            }, DIV({ className }))
        );
    }

    return DIV({}, 'baseless');
};

export default render;

logger('loaded');
