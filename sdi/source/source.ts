
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



import * as debug from 'debug';
import { Lens } from 'monocle-ts';

const logger = debug('sdi:source/source');

export const isProxySupported = (typeof Proxy === 'function');// && false;


export type KeyOfIShape<IShape> = keyof IShape;
export type SubTypeOfIShape<IShape> = IShape[KeyOfIShape<IShape>];

export interface IReducer<IShape, S extends SubTypeOfIShape<IShape>> {
    (a: S): S;
}

export interface IReducerAsync<IShape, S extends SubTypeOfIShape<IShape>> {
    (a: S): Promise<S>;
}

export interface IObserver<IShape, K extends KeyOfIShape<IShape>> {
    key: K;
    handler(a: IShape[K]): void;
    immediate: boolean;
}

export interface IStoreInteractions<IShape> {
    dispatch<K extends KeyOfIShape<IShape>>(key: K, handler: IReducer<IShape, IShape[K]>): void;
    dispatchAsync<K extends KeyOfIShape<IShape>>(key: K, handler: IReducerAsync<IShape, IShape[K]>): void;
    observe<K extends KeyOfIShape<IShape>>(key: K, handler: (a: IShape[K]) => void, immediate?: boolean): void;
    get<K extends keyof IShape>(key: K): IShape[K];
    version(): number;
    reset(n: number): void;
}

const getLocaleStorage =
    () => {
        try {
            const storage = window.localStorage;
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return storage;
        }
        catch (e) {
            return false;
        }
    };

export const proxyfyObject =
    <T extends object>(a: T): T => {
        const set = <K extends keyof T>(_target: T, prop: K, value: T[K]) => {
            throw (new Error(`Immutable target: cannot set ${prop} to ${value}`));
        };

        const get = <K extends keyof T>(target: T, prop: K) => {
            const v = Reflect.get(target, prop);
            if ('constructor' === prop) {
                return v;
            }
            if (null === v) {
                return null;
            }
            if (v instanceof Object) {
                return proxyfy(v);
            }
            return v;
        };

        return (new Proxy(a, { get, set }));
    };

const poorManCopy =
    <T>(a: T): T => JSON.parse(JSON.stringify(a));

const proxyfy =
    <T extends object>(a: T): T => {
        if (isProxySupported) {
            return proxyfyObject(a);
        }
        // FIXME - maybe
        return poorManCopy(a);
    };


export const source =
    <IShape, KI extends keyof IShape>(localKeys: KI[]) => {

        const isObject = (o: Object): o is object => {
            if (o instanceof Object) {
                return true;
            }
            return false;
        };

        const toLocalStorage =
            (state: IShape) => {
                const storage = getLocaleStorage();
                if (storage) {
                    localKeys.forEach((key) => {
                        storage.setItem(key as string, JSON.stringify(state[key]));
                    });
                }
            };

        const getLocalStorageValue =
            <K extends keyof IShape>(storage: Storage, key: K): IShape[K] | null => {
                const jsonString = storage.getItem(key as string);
                if (jsonString) {
                    return JSON.parse(jsonString);
                }
                return null;
            };

        const importLocalStorage =
            (state: IShape) => {
                const storage = getLocaleStorage();
                if (storage) {
                    localKeys.forEach((key) => {
                        const localState = getLocalStorageValue(storage, key);
                        if (localState) {
                            state[key] = localState;
                        }
                    });
                }
                return state;
            };

        const getLens =
            <K extends keyof IShape>(k: K) => {
                const L = Lens.fromProp<IShape, K>(k);
                return L;
            };




        const start =
            (initialState: IShape, withLocalStorage = true): IStoreInteractions<IShape> => {

                const store = [initialState];
                const observers: IObserver<IShape, KeyOfIShape<IShape>>[] = [];

                // let logDev = (_handler: IReducer, _state: IShape): void => {
                //     // noop
                // };

                const head = () => store[store.length - 1];

                const get = <K extends keyof IShape>(key: K): IShape[K] => {
                    const state = head();
                    const value = state[key];

                    if (value instanceof Object && isObject(value)) {
                        return proxyfy(value);
                    }

                    return value;
                };





                const observe =
                    <K extends KeyOfIShape<IShape>>(
                        key: K,
                        handler: (a: IShape[K]) => void,
                        immediate = false,
                    ): void => {
                        logger(`observe ${key}`);
                        const alreadyRegistered = observers.find(o => o.handler === handler && o.key === key);
                        if (!alreadyRegistered) {
                            observers.push({ key, handler, immediate });
                        }
                    };

                const processObservers =
                    <K extends KeyOfIShape<IShape>>(a: K) => {
                        observers.filter(o => o.key === a)
                            .forEach((o) => {
                                const state = get(a);
                                if (o.immediate) {
                                    return o.handler(state);
                                }
                                setTimeout(() => {
                                    o.handler(state);
                                }, 1);
                            });
                    };

                const dispatch =
                    <K extends KeyOfIShape<IShape>>(key: K, handler: IReducer<IShape, IShape[K]>): void => {
                        logger(`dispatch ${key}`);
                        const lens = getLens(key);
                        const newState = lens.modify(handler)(head());
                        toLocalStorage(newState);
                        store.push(newState);
                        processObservers(key);

                    };

                const dispatchAsync =
                    <K extends KeyOfIShape<IShape>>(key: K, handler: IReducerAsync<IShape, IShape[K]>): void => {
                        const lens = getLens(key);
                        handler(lens.get(head()))
                            .then((nk) => {
                                const m = lens.modify(() => nk);
                                const newState = m(head());
                                toLocalStorage(newState);
                                store.push(newState);
                                processObservers(key);
                            });
                    };


                if (withLocalStorage) {
                    const ns = importLocalStorage(initialState);
                    store.push(ns);
                }

                const version = () => store.length;

                const reset =
                    (n: number) => {
                        const end = Math.max(1, store.length - n);
                        store.splice(end);
                    };

                return {
                    dispatch,
                    dispatchAsync,
                    get,
                    observe,
                    reset,
                    version,
                };
            };


        return start;
    };


