
import tr from 'sdi/locale';
import { IAlias } from 'sdi/source';
import { tableQueries, TableSource } from 'sdi/components/table';
import { subscribe, queryK } from 'sdi/shape';
import { fromNullable } from 'fp-ts/lib/Option';

const dataAlias = queryK('data/alias');
const tableAlias = queryK('component/table/alias');
const formAlias = queryK('component/form');

const getKeys =
    () => [
        tr('select'),
        tr('replaceFR'),
        tr('replaceNL'),
    ];

const getTypes =
    () => ['string', 'string', 'string'];

const getData =
    (als: IAlias[]) =>
        als.map(a => ({
            from: a.select,
            cells: [
                a.select,
                a.replace.fr,
                a.replace.nl,
            ],
        }));

const getSource =
    subscribe('data/alias', state => ({
        data: getData(state),
        keys: getKeys(),
        types: getTypes(),
    } as TableSource), 'app/lang');


export const tableAliasQueries = tableQueries(tableAlias, getSource);


export const getFormStatus =
    () => formAlias().status;

export const getFormSelect =
    () => formAlias().select;

export const getFormReplace =
    (lc: 'fr' | 'nl') =>
        () => formAlias()[lc];




export const getAliasData =
    (k: string) =>
        fromNullable(
            dataAlias()
                .find(alias => alias.select === k));

