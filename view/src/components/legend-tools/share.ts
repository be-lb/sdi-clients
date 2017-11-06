

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

import tr from 'sdi/locale';
import { DIV, H2, SPAN } from 'sdi/components/elements';

import { getView } from '../../queries/map';

const logger = debug('sdi:tool-share');
const hasClipboard = !!document.execCommand;
const location = document.location;
const origin = location.origin;
const path = location.pathname;

const queryString = (o: { [k: string]: any }) => {
    return Object.keys(o).reduce((a, k) => {
        return `${a}&${k}=${o[k].toString()}`;
    }, '');
};


const copyToClipBoard = (s: string) => {
    if (!hasClipboard) {
        return SPAN({});
    }

    return (
        SPAN({
            className: 'copy',
            onClick: () => {
                const ta = document.createElement('textarea');
                ta.style.position = 'absolute';
                ta.style.width = '10px';
                ta.style.left = '-10px';
                document.body.appendChild(ta);
                ta.value = s;
                ta.setAttribute('readonly', '');
                ta.select();
                ta.setSelectionRange(0, s.length);
                const copied = document.execCommand('Copy');
                document.body.removeChild(ta);
                logger(`text copied: ${copied}`);
            },
        }, tr('copy'))
    );
};


const makeCopyable = (value: string) => {
    return (
        DIV({ className: 'text-copy' },
            copyToClipBoard(value),
            SPAN({ className: 'text' }, value)));
};

const render = () => {
    const view = getView();
    const qs = queryString({
        srs: view.srs,
        zoom: view.zoom,
        lat: view.center[1],
        lon: view.center[0],
        rotation: view.rotation,
    });

    // FIXME
    const iframeExampleWithView = `<iframe src="${origin}/embed.html?${qs}" width="880" height="600" frameborder="0"></iframe>`;
    const iframeExampleWithoutView = `<iframe src="${origin}/embed.html" width="880" height="600" frameborder="0"></iframe>`;


    return (
        DIV({ className: 'tool-group share-embed' },
            DIV({ className: 'tool share' },
                H2({}, tr('share')),
                DIV({ className: 'tool-body' },
                    DIV({ className: 'input-label' }, tr('mapLink')),
                    makeCopyable(`${origin}${path}`),
                    DIV({ className: 'input-label' }, tr('mapLinkWithView')),
                    makeCopyable(`${origin}${path}?${qs}`))),
            DIV({ className: 'tool embed' },
                H2({}, tr('embed')),
                DIV({ className: 'tool-body' },
                    DIV({ className: 'input-label' }, tr('mapEmbed')),
                    makeCopyable(iframeExampleWithoutView),
                    DIV({ className: 'input-label' }, tr('mapEmbedWithView')),
                    makeCopyable(iframeExampleWithView))))
    );
};


export default render;

logger('loaded');
