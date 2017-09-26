
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
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import config from './config';
import { DIV, SPAN } from '../elements';
import { ReactNode } from 'react';
import { getFeatureProperties } from '../../util/app';
import button from '../button';
import { AppLayout } from '../../shape';
import { MessageRecord } from 'sdi/source';
import { fromRecord } from '../../locale';

interface NotNullProperties {
    [key: string]: any;
}

const logger = debug('sdi:feature-view');

const renderRow =
    (props: NotNullProperties) =>
        (k: string) => {
            const className = 'feature-field';
            const val = `${props[k]}`;
            return (
                DIV({ className },
                    DIV({ className: 'feature-field-label' },
                        appQueries.getAlias(k)),
                    DIV({ className: 'feature-field-value' }, val)));
        };

export const renderDefault =
    () => {
        const feature = appQueries.getCurrentFeature();
        const lines: ReactNode[] = [];
        if (feature) {
            const props = getFeatureProperties(feature);
            if (props) {
                return Object.keys(props).map(renderRow(props));
            }
        }
        return lines;
    };

const closeButton = button('close');

const wrap =
    (name: MessageRecord, ...children: ReactNode[]) => {

        return (
            DIV({ className: 'feature-view config' },
                DIV({ className: 'feature-view-header' },
                    SPAN({ className: 'layer-name' }, fromRecord(name)),
                    closeButton(() => {
                        appEvents.setCurrentFeature(null);
                        appEvents.setLayout(AppLayout.MapAndInfo);
                    })),
                ...children)
        );
    };

const render =
    () => {
        const { name, info } = appQueries.getCurrentLayerInfo();
        if (name && info) {
            switch (info.featureViewOptions.type) {
                case 'default': return wrap(name, renderDefault());
                case 'config': return wrap(name, config());
            }
        }
        return DIV({ className: 'feature-view' });
    };
export default render;

logger('loaded');
