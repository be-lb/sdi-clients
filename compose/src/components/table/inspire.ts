
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

import tr, { fromRecord, formatDate } from 'sdi/locale';
import { DIV, SPAN, H1, A, NODISPLAY } from 'sdi/components/elements';
import { Inspire, FreeText, isAnchor, ResponsibleOrganisation, isTemporalExtent, TemporalReference, MdPointOfContact } from 'sdi/source';
import { scopeOption } from 'sdi/lib';

import { getSelectedMetadataRow, getDatasetMetadata, getPersonOfContact, getResponsibleOrg } from '../../queries/metadata';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape/types';
import { button } from '../button';
import { fromNullable } from 'fp-ts/lib/Option';

const logger = debug('sdi:table/inspire');

const okButton = button('add', 'addToLegend');

const renderFreeText = (ft: FreeText, className?: string) => {
    if (isAnchor(ft)) {
        return A({ href: ft.href, className }, fromRecord(ft.text));
    }

    return SPAN({ className }, fromRecord(ft));
};

const renderTemporalReference = (t: TemporalReference) => {

    if (isTemporalExtent(t)) {
        return SPAN({},
            tr('extentBegin'), SPAN({}, formatDate(new Date(t.begin))),
            tr('extentEnd'), SPAN({}, formatDate(new Date(t.end))));
    }
    return SPAN({}, tr('lastModified')), formatDate(new Date(t.revision));
};

const renderContact =
    (id: number) =>
        getPersonOfContact(id).fold(
            NODISPLAY(),
            (ro: MdPointOfContact) =>
                DIV({ className: 'ro-block' },
                    renderFreeText(ro.organisationName, 'ro-org-name'),
                    SPAN({ className: 'ro-contact-name' }, ro.contactName)));

const renderOrg =
    (id: number) =>
        getResponsibleOrg(id).fold(
            NODISPLAY(),
            (ro: ResponsibleOrganisation) =>
                DIV({ className: 'ro-block' },
                    renderFreeText(ro.organisationName, 'ro-org-name'),
                    SPAN({ className: 'ro-contact-name' }, ro.contactName),
                    SPAN({ className: 'ro-role-code' }, ro.roleCode)));


const renderInspireMD = (i: Inspire) => (
    DIV({ className: 'inspire-wrapper' },
        DIV({ className: 'inspire-content' },
            DIV({ className: 'inspire-selected-items' },
                H1({}, renderFreeText(i.resourceTitle)),
                DIV({}, i.topicCategory.map(a => SPAN({}, a))),
                DIV({}, i.geometryType),
                DIV({},
                    SPAN({}, tr('lastModified')), renderTemporalReference(i.temporalReference)),
                DIV({ className: 'abstract' }, renderFreeText(i.resourceAbstract)),
                DIV({},
                    SPAN({ className: 'label' }, tr('responsibleAndContact')),
                    i.metadataPointOfContact.map(renderContact),
                    i.responsibleOrganisation.map(renderOrg))),
            // DIV({ className: 'inspire-other-items' }, 'TODO')
        ),
        // goButton(() => {
        //     layerEvents.view(i);
        // }),
        okButton(() => {
            appEvents.addMapLayer(i);
            appEvents.resetLegendEditor();
            appEvents.setLayout(AppLayout.LegendEditor);
        }))
);

const render =
    () => scopeOption()
        .let('row', fromNullable(getSelectedMetadataRow()))
        .let('md', ({ row }) => getDatasetMetadata(row.from as string))
        .fold(
            DIV({ className: 'inspire-wrapper empty' }),
            ({ md }) => renderInspireMD(md));

export default render;

logger('loaded');
