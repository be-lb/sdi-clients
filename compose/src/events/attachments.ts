
import { fromNullable } from 'fp-ts/lib/Option';

import { Attachment, MessageRecord, IMapInfo } from 'sdi/source';
import { getLang, getApiUrl } from 'sdi/app';
import { dispatch, dispatchK, observe, dispatchAsync } from 'sdi/shape';
import { fromRecord } from 'sdi/locale';

import {
    fetchAttachment,
    postAttachment,
    putAttachment,
    putMap,
    upload,
    delAttachment,
} from '../remote';
import queries from '../queries/app';
import { getAttachment, getAttachments } from '../queries/attachments';
import { AttachmentForm } from '../shape/types';

const attachments = dispatchK('data/attachments');

const setAttachment =
    (attachment: Attachment) =>
        attachments(
            ats => ats.filter(
                a => a.id !== attachment.id)
                .concat([attachment]));

const updateName =
    (a: Attachment, m: MessageRecord): Attachment => ({ ...a, name: m });

const updateUrl =
    (a: Attachment, url: string, name: string): Attachment => ({
        ...a,
        name: {
            ...a.name,
            [getLang()]: name,
        },
        url: {
            ...a.url,
            [getLang()]: url,
        },
    });

const updateMapInfo =
    (f: (m: IMapInfo) => IMapInfo) => {
        const id = queries.getCurrentMap();
        dispatchAsync('data/maps', maps =>
            fromNullable(maps.find(m => m.id === id))
                .fold(
                () => Promise.resolve(maps),
                m => putMap(getApiUrl(`maps/${id}`), f(m))
                    .then(nm =>
                        maps.filter(m => m.id !== id).concat([nm]))));
    };



export const setAttachmentName =
    (k: string, name: MessageRecord) =>
        getAttachment(k)
            .map(a => putAttachment(
                getApiUrl(`attachments/${a.id}`), updateName(a, name))
                .then(setAttachment)
                .catch(() => void 0));// TODO


export const setAttachmentUrl =
    (k: string, url: string, name: string) =>
        getAttachment(k)
            .map(a => putAttachment(
                getApiUrl(`attachments/${a.id}`), updateUrl(a, url, name))
                .then(setAttachment)
                .catch(() => void 0));// TODO


export const removeAttachment =
    (k: string) =>
        delAttachment(getApiUrl(`attachments/${k}`))
            .then(() => updateMapInfo(m => ({
                ...m,
                attachments: m.attachments.filter(a => a !== k),
            })));



export const addAttachment =
    () =>
        fromNullable(queries.getCurrentMap())
            .map(
            mid => postAttachment(getApiUrl(`attachments`), {
                mapId: mid,
                url: { nl: '', fr: '' },
                name: { nl: '', fr: '' },
            }).then((a) => {
                setAttachment(a);
                updateMapInfo(m => ({
                    ...m,
                    attachments: m.attachments.concat([a.id]),
                }));
            }));



export const uploadAttachmentFile =
    (k: string, f: File) => {
        dispatch('component/attachments', ats => fromNullable(ats.find(a => a.id === k)).fold(
            () => ats,
            sa => ats.filter(a => a.id !== sa.id).concat([{
                ...sa,
                name: f.name,
                uploading: true,
            }])));

        upload('/documents/documents/', f)
            .then(({ url }) => setAttachmentUrl(k, url, f.name));
    };


observe('app/current-map',
    () => fromNullable(queries.getMapInfo())
        .map(
        info => info.attachments.forEach(
            aid => fetchAttachment(getApiUrl(`attachments/${aid}`))
                .then(a => dispatch('data/attachments', s => s.concat([a]))))));


const updateForms =
    (ats: Attachment[]): AttachmentForm[] =>
        ats.map(a => ({
            id: a.id,
            mapId: a.mapId,
            name: fromRecord(a.name),
            url: fromRecord(a.url),
            uploading: false,
        }));

observe('data/attachments',
    ats => dispatch('component/attachments',
        () => updateForms(ats)));

observe('app/lang', () =>
    dispatch('component/attachments',
        () => updateForms(getAttachments())));
