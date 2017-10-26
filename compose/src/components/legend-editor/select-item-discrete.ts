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
import { ClassAttributes, KeyboardEvent, ChangeEvent, ReactNode } from 'react';

import { DIV, SPAN, INPUT } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { isENTER } from 'sdi/components/keycodes';
import { isDiscrete, MessageRecord, DiscreteGroup } from 'sdi/source';

import events from '../../events/legend-editor';
import editable from '../editable';
import queries from '../../queries/legend-editor';
import { button, remove } from '../button';


const logger = debug('sdi:legend-editor/select-type');

const addGroupButton = button('add', 'styleGroupAdd');
const addTermButton = button('add');

const setStyleGroupTitle = (k: number) => (title: MessageRecord) => events.setLabelForStyleGroup(k, title);

// const renderHeader = () => {
//     const propName = queries.getPropName();
//     return (
//         DIV({ className: 'value-picker-header' },
//             DIV({ className: 'column-name' }, propName))
//     );
// };

const renderAdd = (groups: DiscreteGroup[]) => {
    return (
        DIV({ className: 'group-add' },
            addGroupButton(() => {
                events.addItem();
                events.selectStyleGroup(groups.length - 1);
            }))
    );
};

const renderGroupTitle = (props: ClassAttributes<Element>, title: string) => {
    if (title === '') {
        title = tr('styleGroupDefaultName');
    }
    return DIV({ ...props, className: 'group-title' }, title);
};

const renderStyleGroupValue = (value: string | number, k: number) => {
    const removeGroupValueButton = remove(`renderStyleGroupValue-${value}-${k}`);
    return (
        DIV({ className: 'value-name' },
            removeGroupValueButton(() => events.removeDiscreteStyleGroupValue(k)),
            SPAN({}, value.toString())));
};


const styleGroupValueAdd =
    () => {
        const value = queries.getStyleGroupEditedValue();
        const style = queries.getStyle();
        if (value && style && isDiscrete(style)) {
            const groups: DiscreteGroup[] = style.groups;
            if (groups.every(group => group.values.indexOf(value) === -1)) {
                events.addDiscreteStyleGroupValue(value);
            }
        }
    };

const styleGroupValueKeyHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isENTER(e)) {
        styleGroupValueAdd();
    }
};

const styleGroupValueChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    events.setStyleGroupEditedValue(v);
};

const renderStyleGroupUnfolded = (group: DiscreteGroup, key: number) => {
    const removeGroupButton = remove(`discrete-renderStyleGroup-${key}`, 'remove');
    const editTitle = editable(
        `StyleGroupUnfolded_${key}`,
        () => group.label, setStyleGroupTitle(key),
        renderGroupTitle);

    const inputElements: ReactNode[] = [];
    const curVal = queries.getStyleGroupEditedValue();
    if (null === curVal) {
        inputElements.push(INPUT({
            key: `renderStyleGroupUnfolded.input-${key}`,
            type: 'text',
            placeholder: tr('addTerm'),
            value: '',
            onChange: styleGroupValueChangeHandler,
        }));
    }
    else {
        inputElements.push(
            INPUT({
                key: `renderStyleGroupUnfolded.input-${key}`,
                type: 'text',
                value: curVal,
                onChange: styleGroupValueChangeHandler,
                onKeyDown: styleGroupValueKeyHandler,
            }), addTermButton(styleGroupValueAdd));
    }

    return (
        DIV({ key, className: 'group unfolded active' },
            editTitle(),
            DIV({ className: 'selected-items' },
                ...group.values.map(renderStyleGroupValue)),
            DIV({ className: 'add-term' }, ...inputElements),
            removeGroupButton(() => events.removeItem(key))));
};


const renderStyleGroupFolded = (group: DiscreteGroup, key: number) => {
    let title = fromRecord(group.label);
    if (title === '') {
        title = tr('styleGroupDefaultName');
    }
    return (
        DIV({
            key,
            className: 'group folded interactive',
            onClick: () => events.selectStyleGroup(key),
        }, DIV({ className: 'group-title' }, title)));
};


const renderStyleGroup = (group: DiscreteGroup, k: number) => {
    if (k === queries.getSelectedStyleGroup()) {
        return renderStyleGroupUnfolded(group, k);
    }
    else {
        return renderStyleGroupFolded(group, k);
    }
};

const renderGroups = (groups: DiscreteGroup[]) => {
    return (
        DIV({ className: 'app-col-main value-picker-groups' },
            ...groups.map(renderStyleGroup),
            renderAdd(groups))
    );
};


export const render = () => {
    const style = queries.getStyle();
    if (style && isDiscrete(style)) {
        const groups: DiscreteGroup[] = style.groups;

        return (
            renderGroups(groups)
        );
    }

    return DIV();
};

export default render;

logger('loaded');
