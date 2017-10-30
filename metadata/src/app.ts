
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
import { loop, getUserId, getApiUrl } from 'sdi/app';
import { DIV, SPAN } from 'sdi/components/elements';
import header from 'sdi/components/header';
import footer from 'sdi/components/footer';
import tr from 'sdi/locale';
import { Inspire } from 'sdi/source';

import list from './components/list';
import single from './components/single';
import events from './events/app';
import queries from './queries/app';


const logger = debug('sdi:app');


export type AppLayout =
    | 'List'
    | 'Single';

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}


const renderAppListingButton =
    () => {
        if (queries.getLayout() !== 'List') {
            return (
                DIV({
                    className: 'navigate app-listview',
                    onClick: () => events.setLayout('List'),
                }, SPAN({ className: 'label' }, tr('sheetList'))));
        }
        return DIV();
    };


const renderHeader = header('metadata')(renderAppListingButton);


const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        renderHeader(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderList = () => wrappedMain('list', list());
const renderSingle = () => wrappedMain('single', single());


const renderMain = () => {
    const layout = queries.getLayout();
    switch (layout) {
        case 'List': return renderList();
        case 'Single': return renderSingle();
    }
};


const effects = () => {
    getUserId()
        .map(userId =>
            events.loadUser(getApiUrl(`users/${userId}`)));
    events.loadAllDatasetMetadata();
    events.loadAllTopic();
    events.loadAllKeyword();
};

const app = loop(renderMain, effects);
export default app;

logger('loaded');
