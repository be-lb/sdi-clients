

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

import { DIV } from 'sdi/components/elements';
import appQueries from '../../queries/app';
import events from '../../events/legend-editor';
import { getLayerPropertiesKeys } from 'sdi/util';
import tr from 'sdi/locale';

const renderKeys = (keys: string[]) => {
    return (
        keys.map((key) => {
            return DIV({
                key,
                className: 'column-name',
                onClick: () => {
                    events.setMainName(key);
                },
            }, key);
        })
    );
};

const wrapRender =
    (...children: React.ReactNode[]) => {
        return DIV({ className: 'app-col-main column-picker' }, ...children);
    };



const render = (lid: string) => {
    const { metadata } = appQueries.getLayerInfo(lid);
    const children: React.ReactNode[] = [];
    if (metadata) {
        const layerData = appQueries.getLayerData(metadata.uniqueResourceIdentifier);
        if (layerData) {
            // const legendType = queries.getLegendType();
            // const keys = legendType !== 'continuous' ?
            //     getLayerPropertiesKeys(layerData) :
            //     getLayerPropertiesKeysFiltered(
            //         layerData, a => typeof a === 'number');
            const keys = getLayerPropertiesKeys(layerData);
            children.push(DIV({ className: 'column-picker-infos' },
                DIV({}, tr('columnPickerMessage')),
            ),
                DIV({ className: 'column-name' }, tr('all')),
                ...renderKeys(keys));
        }
    }

    return wrapRender(...children);
};

export default render;
