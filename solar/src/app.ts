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

import { DIV } from 'sdi/components/elements';
import header from 'sdi/components/header';
import footer from 'sdi/components/footer';
import { loop, getApiUrl } from 'sdi/app';


import { getLayout } from './queries/app';
import { navigate } from './events/route';
import locate from './components/locate';
import preview from './components/preview';
import detail from './components/detail';
import { loadLocateMap } from './events/map';
import { loadAllBaseLayers } from './events/app';

const logger = debug('sdi:app');

export type AppLayout = 'Locate' | 'Preview' | 'Detail';


const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header('solar')(() => DIV())(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderLocate = () => wrappedMain('locate', locate());
const renderPreview = () => wrappedMain('preview', preview());
const renderDetail = () => wrappedMain('detail', detail());


const renderMain =
    () => {
        const layout = getLayout();
        switch (layout) {
            case 'Locate': return renderLocate();
            case 'Preview': return renderPreview();
            case 'Detail': return renderDetail();
        }
    };


const effects =
    () => {
        loadAllBaseLayers(getApiUrl(`wmsconfig/`));
        loadLocateMap();
        navigate();
    };




const app = loop(renderMain, effects);
export default app;

logger('loaded');
