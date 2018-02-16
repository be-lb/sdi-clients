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
import { IMapInfo } from 'sdi/source';
import { DIV, H2, P, A, IMG } from 'sdi/components/elements';

import queries from '../queries/app';
import { getAttachment } from '../queries/attachments';

const logger = debug('sdi:map-info');


const makeAttachment =
    (aid: string) =>
        getAttachment(aid).fold(
            DIV({}, 'NOT LOADED YET'),
            a => DIV({ className: 'map-file', key: aid },
                A({ href: fromRecord(a.url), target: '_blank' }, fromRecord(a.name))));


const renderAttachments =
    (info: IMapInfo) => {
        const aLen = info.attachments.length;
        if (aLen > 0) {
            return (
                DIV({ className: 'map-attached-files' },
                    H2({}, tr('links')),
                    info.attachments.map(makeAttachment))
            );
        }

        return DIV();
    };

export default () => {
    const mapInfo = queries.getMapInfo();
    if (mapInfo) {
        const description = fromRecord(mapInfo.description)
            .split('\n')
            .map(paragraph => P({}, paragraph));

        return (
            DIV({ className: 'map-infos' },
                DIV({ className: 'map-date' },
                    DIV({ className: 'map-date-label' }, tr('lastModified')),
                    DIV({ className: 'map-date-value' },
                        formatDate(new Date(mapInfo.lastModified)))),
                DIV({ className: 'map-illustration' }, IMG({
                    src: mapInfo.imageUrl ? mapInfo.imageUrl : '',
                })),
                DIV({ className: 'map-description' }, ...description),
                renderAttachments(mapInfo)));
    }
    return DIV();
};

logger('loaded');
