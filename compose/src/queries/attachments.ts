import { fromNullable } from 'fp-ts/lib/Option';

import { queryK } from 'sdi/shape';
import { uuid } from 'sdi/source';

const attachmenForms = queryK('component/attachments');
const attachments = queryK('data/attachments');


export const getAttachments =
    () => attachments();

export const getAttachment =
    (id: uuid) => fromNullable(attachments().find(a => a.id === id));

export const getAttachmentForm =
    (id: uuid) => fromNullable(attachmenForms().find(a => a.id === id));


