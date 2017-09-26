

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
 
import config from './config';
// import template from './template';
// import timeserie from './timeserie';
// import queries from '../../queries/feature-config';
// import events from '../../events/feature-config';
// import appQueries from '../../queries/app';
import { AppLayout } from '../../shape';
import { DIV } from '../elements';
import button from '../button';
import tr from '../../locale';
// import { MessageKey } from '../../locale/message-db';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import tableQueries from '../../queries/table';
import tableEvents from '../../events/table';
import * as debug from 'debug';


const logger = debug('sdi:feature-config');

const ensureTableSelection = () => {
    if (tableQueries.getSelected() < 0) {
        const row = tableQueries.getRow(0);
        if (row) {
            const lid = appQueries.getCurrentLayerId();
            if (lid) {
                const layer = appQueries.getLayerData(lid);
                if (layer) {
                    tableEvents.select(0);
                    const feature = layer.features[row.from];
                    appEvents.setCurrentFeatureData(feature);
                }
            }

        }
    }
};

export interface FeatureConfig {
    currentRow: number;
    currentPropName: string;
    editedValue: string | null;
}

export const initialFeatureConfigState =
    (): FeatureConfig => ({
        currentRow: -1,
        currentPropName: '',
        editedValue: null,
    });

const closeButton = button('close');



const renderHeader =
    () => (
        DIV({ className: 'app-split-header' },
            DIV({ className: 'app-split-title' },
                DIV({ className: 'editor-title' }, tr('featureTemplateEditor'))),
            DIV({ className: 'app-header-close' },
                closeButton(() => { appEvents.setLayout(AppLayout.LegendEditor); })))
    );

const render = () => {
    ensureTableSelection();
    return DIV({ className: 'app-split-wrapper feature-config' },
        renderHeader(),
        config());
};

export default render;

logger('loaded');
