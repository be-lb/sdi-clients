
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
import { dispatch } from './index';
import { AppLayout } from '../shape';
import {
    fetchAllDatasetMetadata,
    fetchDatasetMetadata,
    fetchUser,
} from '../remote';
import queries from '../queries/app';

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

    setLang(lc: 'fr' | 'nl') {
        document.body.setAttribute('lang', lc);
        dispatch('app/lang', () => lc);
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
        fetchAllDatasetMetadata(queries.getApiUrl('metadatas'))
            .then((mds) => {
                mds.forEach((md) => {
                    dispatch('data/datasetMetadata', (state) => {
                        const id = md.id;
                        if (!(id in state)) {
                            state[id] = md;
                        }
                        return state;
                    });
                });
            });
    },
};

export default events;

logger('loaded');
