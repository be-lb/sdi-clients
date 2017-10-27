
import { i, p, MessageRecordIO, TypeOf } from './io';
import * as io from 'io-ts';
import { uuid } from './uuid';

export const AttachmentIO = io.intersection([
    i({
        name: MessageRecordIO,
        url: MessageRecordIO,
    }),
    p({
        id: uuid,
    }),
], 'AttachmentIO');

export type Attachment = TypeOf<typeof AttachmentIO>;
