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
import { A, DIV, H2, INPUT, SPAN } from 'sdi/components/elements';
import tr, { fromRecord, FileRecord, fromFileRecord, updateFileRecord } from 'sdi/locale';
import { MessageRecord, IAttachment } from 'sdi/source';
import editable from '../editable';
import { FormEvent } from 'react';
import { button, remove } from '../button';

const logger = debug('sdi:map-info/attachments');

const selectedFiles: FileRecord[] = [];

const isTimestamp = (v: string) => v.match(/^\d+$/);

const uploadButton = button('upload', 'attachmentUpload');
const addButton = button('add');

const removeAttachment = (k: number) => {
    if (k > selectedFiles.length) {
        selectedFiles.splice(k, 1);
    }
    events.removeAttachment(k);
};


const updateSelectedFile = (k: number, i: HTMLInputElement) => {
    const record = (k < selectedFiles.length) ? selectedFiles[k] : { nl: null, fr: null };
    if (i.files && i.files.length > 0) {
        selectedFiles[k] = updateFileRecord(record, i.files[0]);
    }
    else {
        selectedFiles[k] = updateFileRecord(record, null);
    }
};


const uploadAttachment = (k: number) => {
    if (k < selectedFiles.length) {
        const record = selectedFiles[k];
        const selectedFile = fromFileRecord(record);
        if (selectedFile !== null) {
            events.uploadAttachmentFile(k, selectedFile);
            updateFileRecord(record, null);
        }
    }
};


const setAttachmentName = (k: number) => (r: MessageRecord) => events.setAttachmentName(k, r);


const renderAttachmentUploadField = (k: number) => {
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
    (k: number, props: React.ClassAttributes<Element>, name: string, a: IAttachment) => {

        // return SPAN(name);
        return DIV({ className: 'map-file' },
            SPAN({ className: 'file-label' },
                A({
                    href: fromRecord(a.url),
                    ...props,
                }, name)),
            remove(`renderAttachmentEditable-${k}`)(() => events.removeAttachment(k)));
    };

const renderAttachmentUploading = (name: string) => {
    return DIV({ className: 'map-file' },
        SPAN({ className: 'loader-spinner'}),
    SPAN({}, `${name} (${tr('attachmentUploadActive')})`));
};


const renderAttachment = (k: number, a: IAttachment) => (props: React.ClassAttributes<Element>) => {
    const name = fromRecord(a.name);

    if (name !== '') {
        const url = fromRecord(a.url);

        if (!isTimestamp(url)) {
            return renderAttachmentEditable(k, props, name, a);
        }
        else {
            return renderAttachmentUploading(name);
        }
    }
    else {
        return renderAttachmentUploadField(k);
    }

};


const renderAddButton = () => (
    addButton(() => events.addAttachment())
);


const render = () => {
    const mapInfo = queries.getMapInfo();
    if (mapInfo) {
        return (
            DIV({ className: 'map-attached-files' },
                H2({}, tr('attachedFiles')),
                mapInfo.attachments.map((a: IAttachment, k: number) => (
                    editable(`ata_${k}`, () => a.name, setAttachmentName(k), renderAttachment(k, a))()
                )),
                renderAddButton())
        );
    }

    return DIV();
};

export default render;

logger('loaded');
