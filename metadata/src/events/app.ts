
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
import { dispatch } from 'sdi/shape';
import {
    fetchAllDatasetMetadata,
    fetchDatasetMetadata,
    fetchUser,
    fetchAllTopic,
    fetchAllKeyword,
} from '../remote';
import { getApiUrl } from 'sdi/app';
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




    loadDatasetMetadata(id: string, url: string) {
        fetchDatasetMetadata(url)
            .then((datasetMetadata) => {
                dispatch('data/datasetMetadata', (state) => {
                    if (!(id in state)) {
                        state[id] = datasetMetadata;
                    }

                    return state;
                });
            });
    },

    loadAllDatasetMetadata() {
        fetchAllDatasetMetadata(getApiUrl('metadatas'))(
            mds =>
                dispatch('data/datasetMetadata', (state) => {
                    mds.forEach(md => state[md.id] = md);
                    return state;
                })
        );
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
