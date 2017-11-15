
import { getApiUrl } from 'sdi/app';
import { dispatchK, observe } from 'sdi/shape';
import { tableEvents } from 'sdi/components/table';

import { fetchAllAlias } from '../remote';
import { FormAliasStatus, defaultFormAlias, FormAlias } from '../components/alias';
import { getAliasData } from '../queries/alias';

const aliasData = dispatchK('data/alias');
const aliasForm = dispatchK('component/form');

export const loadAllAlias =
    () => {
        fetchAllAlias(getApiUrl('alias'))(
            als => aliasData(s => s.concat(als)),
            () => 1
        );
    };

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
