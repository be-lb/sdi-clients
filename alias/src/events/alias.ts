
import { getApiUrl } from 'sdi/app';
import { dispatchK, observe } from 'sdi/shape';
import { tableEvents } from 'sdi/components/table';

import { fetchAllAlias, putAlias, postAlias, delAlias } from '../remote';
import { FormAliasStatus, defaultFormAlias, FormAlias } from '../components/alias';
import { getAliasData, getForm } from '../queries/alias';
import { fromPredicate } from 'fp-ts/lib/Either';
import { IAlias } from '../sdi/source/index';

const aliasData = dispatchK('data/alias');
const aliasForm = dispatchK('component/form');

export const loadAllAlias =
    () =>
        fetchAllAlias(getApiUrl('alias'))
            .then(als => aliasData(s => s.concat(als)));

export const tableAliasEvents =
    tableEvents(dispatchK('component/table/alias'));


const statusUpdate: FormAliasStatus = 'update';

const formFromData =
    (select: string) =>
        getAliasData(select).fold(
            () => defaultFormAlias(),
            data => ({
                status: statusUpdate,
                id: data.id,
                select: data.select,
                fr: data.replace.fr,
                nl: data.replace.nl,
            })
        )

export const buildForm =
    (select: string) =>
        aliasForm((form) => {
            if (form.select === select) {
                return form;
            }
            return formFromData(select);
        });



export const setFormStatus =
    (status: FormAliasStatus) =>
        aliasForm(s => ({ ...s, status }));

export const setFormSelect =
    (select: string) =>
        aliasForm(s => ({ ...s, select }));

export const setFormReplace =
    (lc: 'fr' | 'nl') =>
        (r: string) =>
            aliasForm(s => ({ ...s, [lc]: r }));


export const formObserve =
    (f: (a: FormAlias) => void) => observe('component/form', f);

export const formIsCreate = fromPredicate(
    (a: FormAlias) => a.status === 'create',
    a => a);

const formToAlias =
    (f: FormAlias): IAlias => ({
        id: f.id !== null ? f.id : -1,
        select: f.select,
        replace: {
            fr: f.fr,
            nl: f.nl,
        }
    })

const updateAlias =
    (a: IAlias) => {
        aliasData(
            als => als.filter(
                fa => fa.id !== a.id)
                .concat([a]));

        aliasForm(() => formFromData(a.select));
    };


export const saveForm =
    () =>
        formIsCreate(getForm())
            .fold(
            f => putAlias(getApiUrl(`alias/${f.id}`), formToAlias(f)),
            f => postAlias(getApiUrl('alias'), formToAlias(f)),
        )
            .then(updateAlias);

export const deleteAlias =
    () => formIsCreate(getForm())
        .map(f => delAlias(`alias/${f.id}`))
        .map(p => p.then(() => buildForm('')));

