
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

import { DIV } from '../elements';
import { MessageKey } from '../../locale/message-db';
import tr from '../../locale';
import queries from '../../queries/button';
import events from '../../events/button';


export const MAX_DURATION = 5000;

export type ButtonType =
    | 'add'
    | 'arrow-right'
    | 'bar-chart'
    | 'cancel'
    | 'clear'
    | 'close'
    | 'confirm'
    | 'edit'
    | 'filter'
    | 'move-down'
    | 'move-up'
    | 'navigate'
    | 'next'
    | 'pie-chart'
    | 'prev'
    | 'remove'
    | 'search'
    | 'select'
    | 'settings'
    | 'switch'
    | 'table'
    | 'text'
    | 'translate'
    | 'upload'
    | 'validate'
    | 'view'
    ;

const render =
    (t: ButtonType, k?: MessageKey) => (action: () => void, runTimeClass?: string) => {
        const onClick = (e: React.MouseEvent<Element>) => {
            e.stopPropagation();
            action();
        };
        let className = (k !== undefined) ? `btn-${t}` : `btn-${t} icon-only`;
        if (runTimeClass) {
            className = `${className} ${runTimeClass}`;
        }
        if (k) {
            return (
                DIV({
                    className,
                    onClick,
                }, tr(k))
            );
        }
        return (
            DIV({
                className,
                onClick,
            })
        );
    };

export default render;

export type Step = 'initial' | 'active';

interface ButtonState {
    step: Step;
    since: number;
}

export interface ButtonComponent {
    [k: string]: ButtonState;
}

// const initialState = (): ButtonState => ({
//     step: 'initial',
//     since: 0,
// });

export const remove = (key: string, label?: MessageKey) => {
    if (!queries.hasKey(key)) {
        events.setStep(key, 'initial');
    }

    const initialButton = () => {
        return render('remove', label)(() => {
            events.setStep(key, 'active');
        });
    };

    const cancel = render('cancel', 'cancel');
    const confirm = render('confirm', 'confirm');

    const activeButton = (action: () => void) => {
        return DIV({ className: 'remove-confirm' },
            cancel(() => { events.setStep(key, 'initial'); }),
            DIV({ className: 'label' }, tr('confirmDelete')),
            confirm(() => {
                events.setStep(key, 'initial');
                action();
            }));
    };

    return ((action: () => void) => {
        if (queries.isActive(key)) {
            return activeButton(action);
        }
        return initialButton();
    });
};
