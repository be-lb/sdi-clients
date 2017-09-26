
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
 
import { DIV, SPAN, A } from '../elements';
import queries from '../../queries/app';
import events from '../../events/app';
import layerEvents from '../../events/layer-editor';
import tr, { fromRecord, formatDate } from '../../locale';
import { FreeText, TemporalReference, isAnchor, isTemporalExtent } from 'sdi/source';
import button from '../button';
import { AppLayout } from '../../shape/index';


const editButton = button('edit', 'editLayer');
const addButton = button('add', 'addLayer');

const renderFreeText = (ft: FreeText) => {
    if (isAnchor(ft)) {
        return A({ href: ft.href }, fromRecord(ft.text));
    }

    return SPAN({}, fromRecord(ft));
};

const renderTemporalReference =
    (t: TemporalReference) => {
        if (isTemporalExtent(t)) {
            return SPAN({},
                tr('extentBegin'), SPAN({}, formatDate(new Date(t.begin))),
                tr('extentEnd'), SPAN({}, formatDate(new Date(t.end))));
        }
        return SPAN({}, tr('lastModified')), formatDate(new Date(t.revision));
    };

const renderAdd = () => (
    DIV({ className: 'dashboard-layer-item add' },
        DIV({ className: 'dashboard-map-title' },
            SPAN({}, tr('newLayer'))),
        addButton(() => events.setLayout(AppLayout.Upload)))
);

const renderItems = (layers: string[]) => {

    return (
        layers.map((mid) => {
            const metadata = queries.getDatasetMetadata(mid);
            if (!metadata) {
                return DIV();
            }
            return (
                DIV({ className: 'dashboard-layer-item' },
                    DIV({ className: 'dashboard-table-name' }, renderFreeText(metadata.resourceTitle)),
                    // DIV({ className: 'dashboard-data-type' }, metadata.type),
                    DIV({ className: 'dashboard-description' }, renderFreeText(metadata.resourceAbstract)),
                    DIV({ className: 'dashboard-date-updated' },
                        renderTemporalReference(metadata.temporalReference)),
                    editButton(() => {
                        layerEvents.edit(metadata);
                    }))
            );
        }));
};

const render = () => {
    const user = queries.getUserData();
    if (null === user) {
        return DIV({}, 'Sorry, you\'re not logged in.');
    }
    const layers = user.layers;
    return (
        DIV({ className: 'dashboard-layers' },
            DIV({ className: 'category-title' }, tr('layer', { n: layers.length })),
            renderAdd(),
            ...renderItems(layers))
    );
};

export default render;
