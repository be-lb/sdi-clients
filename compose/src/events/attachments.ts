
import { getLang, getApiUrl } from 'sdi/app';
import { dispatch, observe } from 'sdi/shape';

import { upload, fetchAttachment } from '../remote';
import queries from '../queries/app';
import { fromNullable } from 'fp-ts/lib/Option';

observe('app/current-map',
    () => fromNullable(queries.getMapInfo())
        .map(
        info => info.attachments.forEach(
            aid => fetchAttachment(getApiUrl(`attachments/${aid}`))
                .then(a => dispatch('data/attachments', s => s.concat([a]))))));




export const uploadAttachmentFile =
    (k: number, f: File) => {
        const mid = queries.getCurrentMap();
        const name = f.name;
        const lc = getLang();

        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);

            if (idx !== -1) {
                const m = maps[idx];
                const aid = m.attachments[k];

                upload('/documents/documents/', f)
                    .then((data) => {
                        const { url } = data;
                        dispatch('data/maps', (maps) => {
                            const idx = maps.findIndex(m => m.id === mid);

                            if (idx !== -1) {
                                const m = maps[idx];
                                const aidx = m.attachments.findIndex(a => a.url[lc] === ts);

                                if (aidx !== -1) {
                                    m.attachments[aidx].url[lc] = url;

                                    setTimeout(() => {
                                        putMap(getApiUrl(`maps/${mid}`), m);
                                    }, 1);
                                }
                            }

                            return maps;
                        });
                    }).catch(() => {
                        // dispatch('data/maps', (maps) => {
                        //     const idx = maps.findIndex(m => m.id === mid);

                        //     if (idx !== -1) {
                        //         const m = maps[idx];
                        //         const aidx = m.attachments.findIndex(a => a.url[lc] === ts);

                        //         if (aidx !== -1) {
                        //             m.attachments[aidx].name[lc] = '';
                        //             m.attachments[aidx].url[lc] = '';

                        //             setTimeout(() => {
                        //                 putMap(getApiUrl(`maps/${mid}`), m);
                        //             }, 1);
                        //         }
                        //     }

                        //     return maps;
                        // });
                    });
            }

            return maps;
        });

    },
