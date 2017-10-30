/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import { IStoreInteractions, IReducer, IAliasCollection, IReducerAsync } from '../source';
import { fromNullable } from 'fp-ts/lib/Option';

export interface IShape {
    'app/user': string | null;
    'app/api-root': string;
    'app/lang': 'fr' | 'nl';
    'app/csrf': string | null;
    'app/root': string;

    'data/alias': IAliasCollection | null;
}

interface Observer<K extends keyof IShape> {
    key: K;
    handler(a: IShape[K]): void;
}

let storeRef: IStoreInteractions<IShape> | null = null;
const getStore = () => fromNullable(storeRef);

const pendingObservers: Observer<keyof IShape>[] = [];


export const configure =
    (store: IStoreInteractions<IShape>) =>
        getStore()
            .fold(
            () => {
                pendingObservers.forEach(
                    o => store.observe(o.key, o.handler));

                storeRef = store;
            },
            () => { throw (new Error('StoreAlreadyConfigured')); });


export const query =
    <K extends keyof IShape>(key: K): IShape[K] =>
        getStore()
            .fold(
            () => { throw (new Error('DispatchNotConfigured')); },
            store => store.get(key));

export const queryK =
    <K extends keyof IShape>(key: K) =>
        () => query(key);

export const dispatch =
    <K extends keyof IShape>(key: K, handler: IReducer<IShape, IShape[K]>): void =>
        getStore()
            .fold(
            () => { throw (new Error('DispatchNotConfigured')); },
            store => store.dispatch(key, handler));


export const dispatchAsync =
    <K extends keyof IShape>(key: K, handler: IReducerAsync<IShape, IShape[K]>): void =>
        getStore()
            .fold(
            () => { throw (new Error('DispatchNotConfigured')); },
            store => store.dispatchAsync(key, handler));

export const dispatchK =
    <K extends keyof IShape>(key: K) =>
        (handler: IReducer<IShape, IShape[K]>) =>
            dispatch(key, handler);


export const observe =
    <K extends keyof IShape>(key: K, handler: (a: IShape[K]) => void): void =>
        getStore()
            .fold(
            () => {
                pendingObservers.push({ key, handler });
            },
            store => store.observe(key, handler));

