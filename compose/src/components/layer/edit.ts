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
 
import { DIV, SPAN, INPUT } from '../elements';
import events from '../../events/layer-editor';
import queries from '../../queries/layer-editor';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
// import { Feature } from 'sdi/source';
import { ReactNode } from 'react';
import { getLayerPropertiesKeys } from '../../util/app';
import button, { remove } from '../button';
import { AppLayout } from '../../shape/index';

type NumberGetter = () => number;
type NumberSetter = (a: number) => void;

type TextGetter = () => string;
type TextSetter = (a: string) => void;

const cancelButton = button('cancel', 'cancel');
const saveButton = button('validate', 'validate');

const renderInputNumber =
    (className: string, label: string, get: NumberGetter, set: NumberSetter) => {
        const value = get();
        const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = e.currentTarget.valueAsNumber;
            if (!isNaN(newVal)) {
                set(newVal);
            }
        };
        return (
            DIV({ className },
                SPAN({ className: 'input-label' }, label),
                INPUT({ value, type: 'number', onChange: update }))
        );
    };


const renderInputText =
    (className: string, label: string, get: TextGetter, set: TextSetter) => {
        const value = get();
        const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            DIV({ className },
                SPAN({ className: 'input-label' }, label),
                INPUT({ value, type: 'text', onChange: update }))
        );
    };

const getValue =
    <T extends (string | number)>(k: string, def: T) =>
        (): T => {
            const v = queries.getFeatureProp(k);
            if (null !== v) {
                return v;
            }
            return def;
        };

const getKeys =
    (lid: string) => {
        if (lid) {
            const fc = appQueries.getLayerData(lid);
            if (fc) {
                return getLayerPropertiesKeys(fc);
            }
        }
        return null;
    };

const getTypes =
    (lid: string, keys: string[]) => {
        const layer = appQueries.getLayerData(lid);
        if (layer && layer.features.length > 0) {
            const row = layer.features[0].properties;
            if (row != null) {
                return keys.map((k) => {
                    const val = row[k];
                    switch (typeof val) {
                        case 'string': return 'string';
                        case 'number': return 'number';
                        case 'boolean': return 'boolean';

                    }
                    return null;
                });
            }
        }
        return null;
    };

const getKeysAndTypes =
    () => {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const keys = getKeys(lid);
            if (keys) {
                const types = getTypes(lid, keys);
                if (types) {
                    return { keys, types };
                }
            }
        }
        return null;
    };

const renderForm =
    () => {
        const rows: ReactNode[] = [];
        // const props = getFeatureProperties(feature);
        const kt = getKeysAndTypes();
        if (kt) {
            const { keys, types } = kt;
            keys.forEach((k, idx) => {
                if (types[idx] === 'number') {
                    rows.push(renderInputNumber('number', k,
                        getValue(k, 0),
                        (nv) => {
                            events.setFeatureProp(k, nv);
                        }));
                }
                if (types[idx] === 'string') {
                    rows.push(renderInputText('string', k,
                        getValue(k, ''),
                        (nv) => {
                            events.setFeatureProp(k, nv);
                        }));
                }
            });
        }
        return rows;
    };

const render =
    () => {
        const f = appQueries.getCurrentFeature();
        if (f) {
            const deleteButton = remove(`removeFeature-${f.id}`, 'remove');
            return DIV({ className: 'feature-form' },
                ...renderForm(),
                DIV({ className: 'buttons' },
                    cancelButton(() => {
                        events.cancelEdit();
                    }),
                    saveButton(() => {
                        events.saveEdit(f.id);
                    }),
                    deleteButton(() => {
                        events.deleteFeature(f.id);
                        appEvents.setLayout(AppLayout.LayerEditAndInfo);
                    })),
            );
        }
        return DIV();
    };

export default render;
