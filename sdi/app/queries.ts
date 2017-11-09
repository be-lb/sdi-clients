import { query } from '../shape';
import { fromNullable } from 'fp-ts/lib/Option';
import { IAliasCollection } from '../source';
import { fromRecord } from '../locale';

export const getUserId = () => fromNullable(query('app/user'));

export const getApiUrl = (path: string) => `${query('app/api-root')}${path}`;

export const getLang = () => query('app/lang');

export const getCSRF = () => fromNullable(query('app/csrf'));

export const getRoot = () => query('app/root');


const getAliasInDict =
    (dict: IAliasCollection, k: string) =>
        fromNullable(dict.find(alias => alias.select === k))
            .fold(
            () => k,
            alias => fromRecord(alias.replace));

export const getAlias =
    (k: string) =>
        fromNullable(query('data/alias'))
            .fold(
            () => k,
            dict => getAliasInDict(dict, k));

