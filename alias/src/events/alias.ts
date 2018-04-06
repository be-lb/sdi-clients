
import { getApiUrl } from 'sdi/app';
import { dispatchK, observe } from 'sdi/shape';
import { tableEvents } from 'sdi/components/table';
import { IAlias, makeRecord } from 'sdi/source';

import { fetchAllAlias, putAlias, postAlias, delAlias } from '../remote';
import { FormAliasStatus, defaultFormAlias, FormAlias } from '../components/alias';
import { getAliasData, getForm } from '../queries/alias';
import { fromPredicate } from 'fp-ts/lib/Either';

const aliasData = dispatchK('data/alias');
const aliasForm = dispatchK('component/form');

export const loadAllAlias =
    () =>
        fetchAllAlias(getApiUrl('alias'))
            .then(als => aliasData(() => als));

export const tableAliasEvents =
    tableEvents(dispatchK('component/table/alias'));


const statusUpdate: FormAliasStatus = 'update';

const formFromData =
    (select: string) =>
        getAliasData(select).fold(
            defaultFormAlias(),
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

export const formIsUpdate = fromPredicate(
    (a: FormAlias) => a.status === 'update',
    a => a);

const formToAlias =
    (f: FormAlias): IAlias => ({
        id: f.id !== null ? f.id : -1,
        select: f.select,
        replace: makeRecord(f.fr, f.nl),
    });

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

const remove =
    (id: number | null) => aliasData(als => als.filter(a => a.id !== id));

export const deleteAlias =
    () => formIsUpdate(getForm())
        .map(f => ({
            pr: delAlias(getApiUrl(`alias/${f.id}`)),
            id: f.id,
        }))
        .map(({ pr, id }) => pr.then(() => {
            buildForm('');
            remove(id);
        }));

