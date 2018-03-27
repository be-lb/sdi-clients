
import * as debug from 'debug';

import { getApiUrl } from 'sdi/app';
import { dispatch } from 'sdi/shape';

import { getDatasetMetadata } from '../queries/metadata';
import { fetchPointOfContact, fetchOrganisation } from '../remote';

const logger = debug('sdi:events/metadata');

export const selectMetadata =
    (id: string) =>
        getDatasetMetadata(id)
            .map(md => {
                md.metadataPointOfContact.forEach(loadPersonOfContact);
                md.responsibleOrganisation.forEach(loadResponsibleOrganisation);
                return md;
            });


const loadPersonOfContact =
    (id: number) =>
        fetchPointOfContact(getApiUrl(`md/poc/${id}`))
            .then(poc =>
                dispatch('data/md/poc', (state) => {
                    return state.filter(p => p.id !== id).concat(poc);
                }))
            .catch(err => logger(`loadPersonOfContact error ${err}`));


const loadResponsibleOrganisation =
    (id: number) =>
        fetchOrganisation(getApiUrl(`md/org/${id}`))
            .then(org =>
                dispatch('data/md/org', (state) => {
                    return state.filter(o => o.id !== id).concat(org);
                }))
            .catch(err => logger(`loadResponsible error ${err}`));


logger('loaded');
