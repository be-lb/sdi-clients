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

import { A, DIV, H2, INPUT, SPAN } from 'sdi/components/elements';
import tr, { fromRecord, FileRecord, fromFileRecord, updateFileRecord } from 'sdi/locale';
import { Attachment, IMapInfo } from 'sdi/source';
import { uploadAttachmentFile, addAttachment, setAttachmentName, removeAttachment } from '../../events/attachments';


import editable from '../editable';
import { FormEvent } from 'react';
import { button, remove } from '../button';
import { getAttachment, getAttachmentForm } from '../../queries/attachments';
import { fromNullable } from 'fp-ts/lib/Option';

const logger = debug('sdi:map-info/attachments');


const uploadButton = button('upload', 'attachmentUpload');
const addButton = button('add');


// const selectedFiles: {[k:string]:FileRecord} = {};
const selectedFiles = new Map<string, FileRecord>();

const updateSelectedFile =
    (k: string, i: HTMLInputElement) => {
        const record = fromNullable(selectedFiles.get(k)).fold(
            () => ({ nl: null, fr: null }),
            r => r);

        if (i.files && i.files.length > 0) {
            selectedFiles.set(k, updateFileRecord(record, i.files[0]));
        }
        else {
            selectedFiles.set(k, updateFileRecord(record, null));
        }
    };


const uploadAttachment =
    (k: string) =>
        fromNullable(selectedFiles.get(k))
            .map((record) => {

                const selectedFile = fromFileRecord(record);
                if (selectedFile !== null) {
                    uploadAttachmentFile(k, selectedFile);
                }
            });




const renderAttachmentUploadField =
    (k: string) => {
        return DIV({ className: 'map-file' },
            INPUT({
                type: 'file',
                name: 'attachment-upload',
                onChange: (e: FormEvent<HTMLInputElement>) => updateSelectedFile(k, e.currentTarget),
            }),
            uploadButton(() => uploadAttachment(k)),
            remove(`renderAttachmentUploadField-${k}`)(() => removeAttachment(k)));
    };

const renderAttachmentEditable =
    (props: React.ClassAttributes<Element>, name: string, a: Attachment) => {

        // return SPAN(name);
        return DIV({ className: 'map-file' },
            SPAN({ className: 'file-label' },
                A({
                    href: fromRecord(a.url),
                    ...props,
                }, name)),
            remove(`renderAttachmentEditable-${a.id}`)
                (() => removeAttachment(a.id)));
    };

const renderAttachmentUploading = (name: string) => {
    return DIV({ className: 'map-file' },
        SPAN({ className: 'loader-spinner' }),
        SPAN({}, `${name} (${tr('attachmentUploadActive')})`));
};


const renderAttachment =
    (a: Attachment) =>
        (props: React.ClassAttributes<Element>) =>
            getAttachmentForm(a.id)
                .fold(
                () => DIV(),
                (f) => {
                    if (f.name.length > 0) {
                        return f.uploading ?
                            renderAttachmentUploading(f.name) :
                            renderAttachmentEditable(props, f.name, a);
                    }
                    return renderAttachmentUploadField(a.id);
                });


const renderAddButton = () => (
    addButton(() => addAttachment())
);


const attachments =
    (mapInfo: IMapInfo) =>
        mapInfo.attachments.map(
            k => getAttachment(k)
                .fold(
                () => DIV(),
                a => (
                    editable(`ata_${k}`,
                        () => a.name,
                        n => setAttachmentName(a.id, n),
                        renderAttachment(a))()
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
