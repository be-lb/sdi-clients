
import { dispatchK, dispatch } from './index';
import { getDatasetMetadata } from '../queries/metadata';
import { getMessageRecord } from 'sdi/source';

const single = dispatchK('component/single');

export const setMdTitle =
    (l: 'fr' | 'nl') =>
        (t: string) => single(
            s => ({ ...s, title: { ...s.title, [l]: t } }));

export const setMdDescription =
    (l: 'fr' | 'nl') =>
        (t: string) => single(
            s => ({ ...s, description: { ...s.description, [l]: t } }));


export const selectMetadata =
    (id: string) => {
        dispatch('app/current-metadata', () => id);
        getDatasetMetadata(id)
            .map(md => dispatch('component/single', () => ({
                title: getMessageRecord(md.resourceTitle),
                description: getMessageRecord(md.resourceAbstract),
            })));
    };