
import { dispatchK, dispatch } from './index';
import { getDatasetMetadata, getMdForm, getMetadataId } from '../queries/metadata';
import { getMessageRecord, Inspire } from 'sdi/source';
import { putMetadata } from '../remote';
import appQueries from '../queries/app';
import { fromNullable } from 'fp-ts/lib/Option';
import { IDatasetMetadataCollection } from '../shape';

const single = dispatchK('component/single');
const apiUrl = (s: string) => appQueries.getApiUrl(s);

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


const updatedMd =
    (md: Inspire): Inspire => {
        const { title, description } = getMdForm();
        return {
            ...md,
            resourceTitle: title,
            resourceAbstract: description,
        };
    };

const updateLocalSet =
    (collection: IDatasetMetadataCollection, md: Inspire): IDatasetMetadataCollection => ({
        ...collection,
        [md.id]: md,
    });

export const saveMdForm =
    () => {
        return fromNullable(getMetadataId())
            .map(id =>
                getDatasetMetadata(id)
                    .map(md => putMetadata(
                        apiUrl(`metadatas/${id}`), updatedMd(md))
                        .then(newMd =>
                            dispatch('data/datasetMetadata',
                                collection => updateLocalSet(collection, newMd)))
                        .catch()));
    };
