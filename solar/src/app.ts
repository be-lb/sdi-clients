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
import loader from './components/loader';
import preview from './components/preview';
import detail from './components/detail';
import { loadMaps } from './events/map';
import { loadAllBaseLayers } from './events/app';

const logger = debug('sdi:app');

export type AppLayout = 'Locate:Geocoder' | 'Locate:Map' | 'Loader' | 'Preview' | 'Detail';


const wrappedMain = (name: string, ...elements: React.DOMElement<{}, Element>[]) => (
    DIV({},
        header('solar')(() => DIV())(),
        DIV({ className: `main ${name}` }, ...elements),
        footer())
);

const renderLocateGeocoder = () => wrappedMain('locate-geocoder', locate(true));
const renderLocateMap = () => wrappedMain('locate-map', locate(false));
const renderLoader = () => wrappedMain('loader', loader());
const renderPreview = () => wrappedMain('preview', preview());
const renderDetail = () => wrappedMain('detail', detail());


const renderMain =
    () => {
        const layout = getLayout();
        switch (layout) {
            case 'Locate:Geocoder': return renderLocateGeocoder();
            case 'Locate:Map': return renderLocateMap();
            case 'Loader': return renderLoader();
            case 'Preview': return renderPreview();
            case 'Detail': return renderDetail();
        }
    };


const effects =
    () => {
        loadAllBaseLayers(getApiUrl(`wmsconfig/`));
        loadMaps();
        navigate();
    };




const app = loop(renderMain, effects);
export default app;

logger('loaded');
