
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
import splash from 'sdi/components/splash';
import tr from 'sdi/locale';

import events from './events/app';
import queries from './queries/app';
import list from './components/list';
import single from './components/single';
import mdSplash from './components/splash';


const logger = debug('sdi:app');


export type AppLayout =
    | 'List'
    | 'Single'
    | 'SingleAndKeywords'
    | 'Splash'
    ;



const renderAppListingButton =
    () => {
        const l = queries.getLayout();
        if (l !== 'List' && l !== 'Splash') {
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
    DIV({ className: 'metadata-inner' },
        renderHeader(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderSplash = () => wrappedMain('splash', splash(mdSplash()));
const renderList = () => wrappedMain('list', list());
const renderSingle = () => wrappedMain('single', single());


const renderMain = () => {
    const layout = queries.getLayout();
    switch (layout) {
        case 'Splash': return renderSplash();
        case 'List': return renderList();
        case 'SingleAndKeywords':
        case 'Single': return renderSingle();
    }
};


const effects = () => {
    getUserId()
        .map(userId =>
            events.loadUser(getApiUrl(`users/${userId}`)));
    events.loadAllTopic();
    events.loadAllKeyword();
    events.loadAllDatasetMetadata(() => events.setLayout('List'));
};

const app = loop('metadata-app', renderMain, effects);
export default app;

logger('loaded');
