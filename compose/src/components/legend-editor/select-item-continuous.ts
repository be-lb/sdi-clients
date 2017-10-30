

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

import { DIV, INPUT } from 'sdi/components/elements';
import { MessageRecord, isContinuous, ContinuousInterval } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';

import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';
import editable from '../editable';
import { button, remove } from '../button';


const addGroupButton = button('add', 'addInterval');

const renderAdd = (groups: ContinuousInterval[]) => {
    return (
        DIV({ className: 'group-add' },
            addGroupButton(() => {
                events.addItem();
                events.selectStyleGroup(groups.length - 1);
            }))
    );
};

const formatTitle = (props: React.ClassAttributes<Element>, title: string) => {
    const isEmpty = title.trim().length === 0;
    const text = isEmpty ? tr('styleGroupDefaultName') : title;
    return DIV({ className: 'group-title', ...props }, text);
};

const renderIntervalActive = (i: ContinuousInterval, idx: number) => {
    const getLabel = () => i.label;
    const setLabel = (r: MessageRecord) => {
        events.setLabelForStyleInterval(idx, r);
    };
    const removeGroupButton = remove(`continuous-renderStyleGroup-${idx}`, 'remove');

    const setLow = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.currentTarget.value);
        if (!isNaN(val)) {
            events.setInterval(idx, val, i.high);
        }
    };
    const setHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.currentTarget.value);
        if (!isNaN(val)) {
            events.setInterval(idx, i.low, val);
        }
    };

    return (
        DIV({ className: 'group unfolded active' },
            editable(`interval_${idx}`, getLabel, setLabel, formatTitle)(),
            DIV({ className: 'interval' },
                DIV({ className: 'low' },
                    DIV({ className: 'interval-label' }, tr('lowValue')),
                    INPUT({ type: 'number', value: i.low, onChange: setLow })),
                DIV({ className: 'high' },
                    DIV({ className: 'interval-label' }, tr('highValue')),
                    INPUT({ type: 'number', value: i.high, onChange: setHigh }))),
            removeGroupButton(() => events.removeItem(idx)))
    );
};

const renderIntervalFolded = (i: ContinuousInterval, key: number) => {
    let title = fromRecord(i.label);
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


const renderInterval =
    (current: number) =>
        (i: ContinuousInterval, key: number) => {
            if (key === current) {
                return renderIntervalActive(i, key);
            }
            return renderIntervalFolded(i, key);
        };

const renderGroups = () => {
    const style = queries.getStyle();
    const current = queries.getSelectedStyleGroup();
    if (style && isContinuous(style)) {
        const intervals: ContinuousInterval[] = style.intervals;
        return (
            DIV({ className: 'app-col-main value-picker-groups' },
                ...intervals.map(renderInterval(current)),
                renderAdd(style.intervals)));
    }


    return (
        DIV({ className: 'app-col-main value-picker-groups' })
    );
};

const render = () => {
    return (
        renderGroups()
    );
};

export default render;
