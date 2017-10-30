
import { i, MessageRecordIO, TypeOf } from './io';
import { uuidIO } from './uuid';

export const AttachmentIO = i({
    name: MessageRecordIO,
    url: MessageRecordIO,
    id: uuidIO,
    mapId: uuidIO,
}, 'AttachmentIO');

export type Attachment = TypeOf<typeof AttachmentIO>;
