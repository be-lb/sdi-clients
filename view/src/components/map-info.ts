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

import tr, { fromRecord, formatDate } from 'sdi/locale';
import { IMapInfo, Attachment } from 'sdi/source';
import { DIV, H2, P, A, IMG, NODISPLAY, SPAN } from 'sdi/components/elements';
import { filterNotNull } from 'sdi/util';

import queries from '../queries/app';
import { getAttachment } from '../queries/attachments';
import { navigateMap } from '../events/route';

const logger = debug('sdi:map-info');


// const internalRe = new RegExp('.*\/client\/view\/([\\w-]+)\/?.+$');
const internalRe = new RegExp('.*\/client\/view\/(.+)');



const renderInternal =
    (a: Attachment) => {
        const rs = internalRe.exec(fromRecord(a.url));
        if (rs === null) { return NODISPLAY(); }
        return DIV({ className: 'internal-nav', key: a.id },
            SPAN({
                onClick: () => navigateMap(rs[1]),
            }, fromRecord(a.name)));
    };

const renderExternal =
    (a: Attachment) =>
        DIV({ className: 'map-file', key: a.id },
            A({ href: fromRecord(a.url), target: '_blank' },
                fromRecord(a.name)));

const isInternal =
    (a: Attachment) => internalRe.exec(fromRecord(a.url)) !== null;

const isExternal =
    (a: Attachment) => !isInternal(a);



const renderAttachments =
    (info: IMapInfo) => {
        const ats = filterNotNull(
            info.attachments.map(
                id => getAttachment(id).fold(null, a => a)));

        if (ats.length > 0) {
            const ints = ats.filter(isInternal);
            const exts = ats.filter(isExternal);
            if (ints.length == 0) {
                return (
                    DIV({ className: 'map-attached-files' },
                        H2({}, tr('links')),
                        exts.map(renderExternal))
                );
            }

            const sectionTitle = exts.length > 0 ? H2({}, tr('links')) : NODISPLAY();
            return (
                DIV({ className: 'map-attached-files' },
                    sectionTitle,
                    exts.map(renderExternal),
                    DIV({ className: 'related-maps' },
                        H2({}, tr('relatedMapsLabel')),
                        ints.map(renderInternal)))
            );

        }

        return NODISPLAY();
    };

export default () => {
    const mapInfo = queries.getMapInfo();
    if (mapInfo) {
        const pars =
            fromRecord(mapInfo.description)
                .split('\n')
                .filter(p => p.trim().length > 0);
        const description = pars.map((paragraph, i) => P({ key: `map - desc - par - ${i} ` }, paragraph));
        const mapDescription =
            pars.length > 0 ?
                DIV({ className: 'map-description' }, ...description) :
                NODISPLAY();
        const mapImage =
            mapInfo.imageUrl ?
                DIV({ className: 'map-illustration' }, IMG({ src: mapInfo.imageUrl })) :
                NODISPLAY();

        return (
            DIV({ className: 'map-infos' },
                DIV({ className: 'map-date' },
                    DIV({ className: 'map-date-label' }, tr('lastModified')),
                    DIV({ className: 'map-date-value' },
                        formatDate(new Date(mapInfo.lastModified)))),
                mapImage,
                mapDescription,
                renderAttachments(mapInfo)));
    }
    return NODISPLAY();
};

logger('loaded');
