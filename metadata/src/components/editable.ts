
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
 
import appQueries from '../queries/app';
import appEvents from '../events/app';
import { fromRecord } from '../locale/index';
import { MessageRecord } from 'sdi/source';
import { DIV } from './elements';
import queries from '../queries/editable';
import events from '../events/editable';
import button from './button';
import { ReactNode } from 'react';

export type EditableState = {
    [k: string]: {
        isFirstEditing: boolean;
    },
};

type HFn = (props: React.ClassAttributes<Element> | undefined, ...children: React.ReactNode[]) => React.DOMElement<{}, Element>;
type GetFn = () => MessageRecord;
type SetFn = (a: MessageRecord) => void;

const sl = (lc: 'fr' | 'nl') => () => {
    appEvents.setLang(lc);
};

const getText = (node: Element | Node): string => {
    const parts: string[] = [];

    node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent) {
                parts.push(child.textContent);
            }
        }
        else {
            parts.push(getText(child));
        }
    });

    return parts.join('\n');
};

const edit = (get: GetFn, set: SetFn) => (event: React.SyntheticEvent<Element>) => {
    const lc = appQueries.getLang();
    const rec = { ...get() };
    const text = getText(event.currentTarget);

    rec[lc] = text;
    set(rec);
};


const isTranslated = (rec: MessageRecord) => {
    if (rec.fr.length > 0 && rec.nl.length > 0) {
        return true;
    }

    return false;
};

const isEmpty = (rec: MessageRecord) => {
    const lc = appQueries.getLang();

    return (rec[lc].length === 0);
};


const langSwitch = () => {
    const lc = appQueries.getLang();
    switch (lc) {
        case 'fr': return sl('nl');
        case 'nl': return sl('fr');
    }
};

const trButton = button('translate');

const wrapEditable = (rec: MessageRecord, k: string, child: ReactNode) => {
    return (
        DIV({
            className: (
                (isEmpty(rec) && !queries.isFirstEditing(k)) ? 'editable-wrapper empty-content' : 'editable-wrapper'),
        },
            trButton(langSwitch(), isTranslated(rec) ? 'translated' : 'not-translated'),
            child)
    );
};

const editable: (k: string, a: GetFn, b: SetFn, c: HFn) => (() => ReactNode) =
    (key, get, set, h) => {
        let ref: Element | null = null;
        const rec = get();
        const setter = edit(get, set);

        const clickHandler = () => {
            if (isEmpty(rec)) {
                if (ref) {
                    ref.childNodes.forEach((n) => {
                        if (ref) {
                            ref.removeChild(n);
                        }
                    });
                }
                events.setFirstEditing(key);
            }
        };

        return (() => {
            const edProps = {
                key,
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: setter,
                onClick: clickHandler,
                ref: (elem: Element | null) => { ref = elem; },
            };
            return wrapEditable(rec, key, h(edProps, fromRecord(rec)));
        });
    };


export default editable;
