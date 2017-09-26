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
import { IStoreInteractions } from 'sdi/source';
import { IShape } from '../shape';

const logger = debug('sdi:queries');
let storeRef: IStoreInteractions<IShape>;


export type IQuery<K extends keyof IShape> = (key: K) => IShape[K];
export interface IQueryOptions { }


export const configure = (store: IStoreInteractions<IShape>) => {
    logger('configure');
    if (storeRef) {
        throw (new Error('GetPAthAlreadyConfigured'));
    }
    storeRef = store;
};


export const query = <K extends keyof IShape>(key: K): IShape[K] => {
    if (!storeRef) {
        throw (new Error('GetPAthNotConfigured'));
    }

    return (storeRef.get(key));
};


logger('loaded');
