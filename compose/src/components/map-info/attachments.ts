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

import { A, DIV, H2, SPAN } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { Attachment, IMapInfo } from 'sdi/source';
import { addAttachment, setAttachmentName, removeAttachment, setAttachmentUrl } from '../../events/attachments';


import editable from '../editable';
import { button, remove } from '../button';
import { getAttachment, getAttachmentForm } from '../../queries/attachments';
import { fromPredicate } from 'fp-ts/lib/Option';


const logger = debug('sdi:map-info/attachments');
const nonEmptyString = fromPredicate<string>(s => s.length > 0);
const addButton = button('add');



const renderAttachmentEditableName =
    (props: React.ClassAttributes<Element>, name: string, a: Attachment) => {
        return DIV({ className: 'map-file-label' },
            SPAN({ className: 'file-label' },
                A({
                    href: fromRecord(a.url),
                    ...props,
                }, nonEmptyString(name).fold(
                    () => tr('attachmentName'),
                    n => n
                ))));
    };

const renderAttachmentEditableUrl =
    (props: React.ClassAttributes<Element>, url: string, _a: Attachment) => {
        return DIV({ className: 'map-file-url' },
            SPAN({ ...props, className: 'file-url' },
                nonEmptyString(url).fold(
                    () => tr('attachmentUrl'),
                    u => u
                )));
    };



const renderAttachmentName =
    (a: Attachment) =>
        (props: React.ClassAttributes<Element>) =>
            getAttachmentForm(a.id)
                .fold(
                () => DIV(),
                f => renderAttachmentEditableName(props, f.name, a));

const renderAttachmentUrl =
    (a: Attachment) =>
        (props: React.ClassAttributes<Element>) =>
            getAttachmentForm(a.id)
                .fold(
                () => DIV(),
                f => renderAttachmentEditableUrl(props, f.url, a));


const renderAddButton = () => (
    addButton(() => addAttachment())
);


const attachments =
    (mapInfo: IMapInfo) =>
        mapInfo.attachments.map(
            k => getAttachment(k)
                .fold(
                () => DIV(),
                a => DIV({ className: 'map-file' },
                    editable(`ata_name_${k}`,
                        () => a.name,
                        n => setAttachmentName(a.id, n),
                        renderAttachmentName(a))(),
                    editable(`ata_url_${k}`,
                        () => a.url,
                        n => setAttachmentUrl(a.id, n),
                        renderAttachmentUrl(a))(),
                    remove(`renderAttachmentEditable-${a.id}`)
                        (() => removeAttachment(a.id))
                )));

const render =
    (mapInfo: IMapInfo) => (
        DIV({ className: 'map-attached-files' },
            H2({}, tr('attachedFiles')),
            ...attachments(mapInfo),
            renderAddButton())
    );


export default render;

logger('loaded');
