
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
import { Setoid } from 'fp-ts/lib/Setoid';

import { getApiUrl } from 'sdi/app';
import { dispatch } from 'sdi/shape';
import { Inspire } from 'sdi/source';
import { uniq } from 'sdi/util';

import {
    fetchAllDatasetMetadata,
    fetchDatasetMetadata,
    fetchUser,
    fetchAllTopic,
    fetchAllKeyword,
} from '../remote';
import { AppLayout } from '../app';

const logger = debug('sdi:events/app');


export const toDataURL = (f: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.onabort = reject;
        reader.readAsDataURL(f);
    });
};


const inspireS: Setoid<Inspire> = {
    equals(a, b) {
        return a.id === b.id;
    }
};

const uniqInspire = uniq(inspireS);



const events = {

    loadUser(url: string) {
        fetchUser(url)
            .then((user) => {
                dispatch('data/user', () => user);
            });
    },


    setLayout(l: AppLayout) {
        dispatch('app/layout', state => state.concat([l]));
    },




    loadDatasetMetadata(url: string) {
        fetchDatasetMetadata(url)
            .then(md =>
                dispatch('data/datasetMetadata',
                    state => state.filter(i => i.id !== md.id).concat([md])));
    },

    loadAllDatasetMetadata() {
        dispatch('component/table',
            ts => ({ ...ts, loaded: 'loading' }));

        fetchAllDatasetMetadata(getApiUrl('metadatas'))(
            (mds) => {
                dispatch('data/datasetMetadata',
                    state => uniqInspire(state.concat(mds)));
                dispatch('component/table',
                    ts => ({ ...ts, loaded: 'loading' }));
            },
            () =>
                dispatch('component/table',
                    ts => ({ ...ts, loaded: 'done' })));
    },

    loadAllTopic() {
        fetchAllTopic(getApiUrl('topics'))
            .then(topics => dispatch('data/topics', () => topics));
    },

    loadAllKeyword() {
        fetchAllKeyword(getApiUrl('keywords'))
            .then(keywords => dispatch('data/keywords', () => keywords));
    },
};

export default events;

logger('loaded');
