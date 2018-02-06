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

import { getRoot } from 'sdi/app';
import tr from 'sdi/locale';
import { DIV, H2, A } from 'sdi/components/elements';

import queries from '../../queries/app';
import { getView } from '../../queries/map';

const logger = debug('sdi:tool-print');
const location = document.location;
const origin = location.origin;
// const path = location.pathname;


const render = () => {
    const { zoom, center } = getView();

    const mapId = queries.getCurrentMap();
    const url = `${origin}${getRoot()}print/${mapId}`;
    const viewUrl = `${url}/${center[0]}/${center[1]}/${zoom}`;

    return (
        DIV({ className: 'tool-group share-embed' },
            DIV({ className: 'tool print' },
                H2({}, tr('printMap')),
                DIV({ className: 'tool-body' },
                    A({
                        className: 'print-link link',
                        href: viewUrl,
                        target: '_blank',
                    }, viewUrl))))
    );
};


export default render;

logger('loaded');
