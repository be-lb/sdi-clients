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
    immediate: boolean;
}

let storeRef: IStoreInteractions<IShape> | null = null;
const getStore = () => fromNullable(storeRef);

const pendingObservers: Observer<keyof IShape>[] = [];

export interface Getter<T> {
    (): T;
}
export interface Setter<T> {
    (h: (a: T) => T): void;
}


export const configure =
    (store: IStoreInteractions<IShape>) =>
        getStore()
            .fold(
            () => {
                pendingObservers.forEach(
                    o => store.observe(o.key, o.handler, o.immediate));

                storeRef = store;
            },
            () => { throw (new Error('StoreAlreadyConfigured')); });


/**********
 * Queries 
 **********/

export const query =
    <K extends keyof IShape>(key: K): IShape[K] =>
        getStore()
            .fold(
            () => { throw (new Error('DispatchNotConfigured')); },
            store => store.get(key));

export const queryK =
    <K extends keyof IShape>(key: K) =>
        () => query(key);

type SubFn<K extends keyof IShape, T> = (a: IShape[K]) => T;

type ShapeK = keyof IShape;

export const subscribe =
    <K extends ShapeK,
        T>(key: K, fn: SubFn<K, T>, ...others: ShapeK[]) => {
        let result: T;
        let stall = true;
        observe_(key, () => stall = true, true);
        others.forEach(k => observe_(k, () => stall = true, true));
        const q =
            () => {
                if (stall) {
                    result = fn(query(key));
                    stall = false;
                }
                return result;
            };

        return q;
    };


/**********
 * Events 
 **********/

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


// tslint:disable-next-line:variable-name
const observe_ =
    <K extends keyof IShape>(key: K, handler: (a: IShape[K]) => void, immediate = false): void =>
        getStore()
            .fold(
            () => {
                pendingObservers.push({ key, handler, immediate });
            },
            store => store.observe(key, handler, immediate));

export const observe =
    <K extends keyof IShape>(key: K, handler: (a: IShape[K]) => void) => observe_(key, handler);
