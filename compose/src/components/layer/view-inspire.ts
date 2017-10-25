
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
import { DIV, SPAN, H1, A } from 'sdi/components/elements';
import { Inspire, FreeText, isAnchor, ResponsibleOrganisation, isTemporalExtent, TemporalReference } from 'sdi/source';
import tr, { formatDate, fromRecord } from 'sdi/locale';

const logger = debug('sdi:layer/view-inspire');

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

const renderContact = (ro: ResponsibleOrganisation) => (
    DIV({ className: 'ro-block' },
        renderFreeText(ro.organisationName, 'ro-org-name'),
        SPAN({ className: 'ro-contact-name' }, ro.contactName),
        SPAN({ className: 'ro-role-code' }, ro.roleCode))
);


const renderInspireMD = (i: Inspire) => {
    return (
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
                        i.responsibleOrganisation.map(renderContact))),
                // DIV({ className: 'inspire-other-items' }, 'TODO')
            ))
    );
};

const render = () => {
    const lid = appQueries.getCurrentLayerId();
    if (lid) {
        const md = appQueries.getDatasetMetadata(lid);
        if (md) {
            return renderInspireMD(md);
        }
    }
    return DIV({ className: 'inspire-wrapper' });
};

export default render;

logger('loaded');

