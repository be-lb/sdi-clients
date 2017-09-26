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
import { IStoreInteractions, IReducer } from 'sdi/source';
import { IShape } from '../shape/index';


const logger = debug('sdi:events');


export interface IEventData { }

// export interface IDispatch {
//     (handler: IReducer): void;
// }

let storeRef: IStoreInteractions<IShape>;

export const configure = (store: IStoreInteractions<IShape>) => {
    logger('configure');
    if (storeRef) {
        throw (new Error('DispatchAlreadyConfigured'));
    }
    storeRef = store;
};

export const dispatch = <K extends keyof IShape>(key: K, handler: IReducer<IShape, IShape[K]>): void => {
    if (!storeRef) {
        throw (new Error('DispatchNotConfigured'));
    }

    storeRef.dispatch(key, handler);
};

export const observe = <K extends keyof IShape>(key: K, handler: (a: IShape[K]) => void): void => {
    if (!storeRef) {
        setTimeout(() => {
            observe(key, handler);
        }, 1);
    }
    else {
        storeRef.observe(key, handler);
    }
};


export const reset = (n: number): void => {
    if (!storeRef) {
        throw (new Error('DispatchNotConfigured'));
    }

    storeRef.reset(n);
};


logger('loaded');
