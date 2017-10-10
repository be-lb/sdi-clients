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

import { dispatch } from './index';
import { syncMap } from '../util/app';
import queries from '../queries/app';
import appEvents from '../events/app';
import { initialFeatureConfigState } from '../components/feature-config/index';
import {
    BooleanConfig,
    ConfigWithLabel,
    ConfigWithLevel,
    ConfigWithStyle,
    defaultBooleanOptions,
    defaultImageOptions,
    defaultNumberOptions,
    defaultPiechartOptions,
    defaultStringOptions,
    defaultTimeserieOptions,
    defaultURLOptions,
    FeatureViewConfig,
    FeatureViewDefault,
    FeatureViewOptions,
    ImageConfig,
    NumberConfig,
    PiechartConfig,
    PiechartPiece,
    PropType,
    RowConfig,
    StringConfig,
    StringOptionLevel,
    StringOptionStyle,
    TimeserieConfig,
    URLConfig,
} from 'sdi/source';

const defaultRowConfig =
    (pn: string): StringConfig => ({
        propName: pn,
        type: 'string',
        lang: queries.getLang(),
        options: {
            level: 'normal',
            withLabel: true,
            style: 'normal',
        },
    });

const configDefaultOptions =
    (): FeatureViewConfig => ({ type: 'config', rows: [] });

const defaultDefaultOptions =
    (): FeatureViewDefault => ({ type: 'default' });


type UpdateFn<T extends FeatureViewOptions> = (a: T) => T;
type DefaultFn<T extends FeatureViewOptions> = () => T;

type UpdateConfigRowFn = (a: RowConfig) => void;

export const validConfigRow = (r: RowConfig) => r.propName.length > 0;

const setOptions = <T extends FeatureViewOptions>(options: T) => {
    const mid = queries.getCurrentMap();
    const lid = queries.getCurrentLayerId();
    dispatch('data/maps', (maps) => {
        const idx = maps.findIndex(m => m.id === mid);
        if (idx !== -1) {
            const m = maps[idx];
            const layerIndex = m.layers.findIndex(l => l.id === lid);
            if (layerIndex >= 0) {
                const layer = m.layers[layerIndex];
                layer.featureViewOptions = options;
                syncMap(m);
            }
        }
        return maps;
    });
};

const updateOptions =
    <T extends FeatureViewOptions>(fn: UpdateFn<T>, def: DefaultFn<T>) => {
        const mid = queries.getCurrentMap();
        const lid = queries.getCurrentLayerId();
        dispatch('data/maps', (maps) => {
            const idx = maps.findIndex(m => m.id === mid);
            if (idx !== -1) {
                const m = maps[idx];
                const layerIndex = m.layers.findIndex(l => l.id === lid);
                if (layerIndex >= 0) {
                    const layer = m.layers[layerIndex];
                    if (layer.featureViewOptions === undefined) {
                        layer.featureViewOptions = def();
                    }
                    const opts = <T>layer.featureViewOptions;
                    layer.featureViewOptions = fn(opts);
                    syncMap(m);
                }
            }
            return maps;
        });
    };


const updateConfig =
    (fn: UpdateFn<FeatureViewConfig>) => updateOptions(fn, configDefaultOptions);

const updateConfigRow =
    (pn: string, fn: UpdateConfigRowFn) => {
        updateConfig((c) => {
            const lc = queries.getLang();
            const rows = c.rows;
            const row = rows.find(r => r.propName === pn && r.lang === lc);
            if (row) {
                fn(row);
            }
            return c;
        });
    };



const events = {
    ensureSelectedFeature() {
        if (queries.getCurrentFeature === null) {
            const lid = queries.getCurrentLayerId();

            if (lid) {
                const layer = queries.getLayerData(lid);
                if (layer) {
                    appEvents.setCurrentFeatureData(layer.features[0]);
                }
            }
        }
    },

    setCurrentPropName(pn: string) {
        dispatch('component/feature-config', (state) => {
            state.currentPropName = pn;
            return state;
        });
    },

    addPropToConfig(pn: string) {
        updateConfig((c) => {
            if (c.type !== 'config') {
                const conf = configDefaultOptions();
                conf.rows.push(defaultRowConfig(pn));
                return conf;
            }
            const rows = c.rows;
            const rowConfig = defaultRowConfig(pn);
            rows.push(rowConfig);
            return c;
        });
    },

    removePropFromConfig(pn: string) {
        updateConfig((c) => {
            const lc = queries.getLang();
            c.rows = c.rows.filter(r => !(r.propName === pn && r.lang === lc));
            return c;
        });
    },

    resetEditor() {
        dispatch('component/feature-config', () => initialFeatureConfigState());
    },

    movePropUp(pn: string) {
        updateConfig((conf) => {
            const lc = queries.getLang();
            const rows = conf.rows.filter(r => r.lang === lc);
            const rest = conf.rows.filter(r => r.lang !== lc);
            const idx = rows.findIndex(r => r.propName === pn);
            if (idx >= 0) {
                const next = idx - 1;
                const row = rows[idx];
                rows[idx] = rows[next];
                rows[next] = row;
            }
            conf.rows = rows.concat(rest);

            return conf;
        });
    },

    movePropDown(pn: string) {
        updateConfig((conf) => {
            const lc = queries.getLang();
            const rows = conf.rows.filter(r => r.lang === lc);
            const rest = conf.rows.filter(r => r.lang !== lc);
            const idx = rows.findIndex(r => r.propName === pn);
            if (idx >= 0 && idx + 1 < rows.length) {
                const next = idx + 1;
                const row = rows[idx];
                rows[idx] = rows[next];
                rows[next] = row;
            }
            conf.rows = rows.concat(rest);

            return conf;
        });
    },

    setPropTypeForConfig(pn: string, pt: PropType) {
        updateConfigRow(pn, (row) => {
            row.type = pt;
            switch (pt) {
                case 'string':
                    (<StringConfig>row).options = defaultStringOptions();
                    break;
                case 'number':
                    (<NumberConfig>row).options = defaultNumberOptions();
                    break;
                case 'boolean':
                    (<BooleanConfig>row).options = defaultBooleanOptions();
                    break;
                case 'url':
                    (<URLConfig>row).options = defaultURLOptions();
                    break;
                case 'image':
                    (<ImageConfig>row).options = defaultImageOptions();
                    break;
                case 'piechart':
                    (<PiechartConfig>row).options = defaultPiechartOptions();
                    break;
                case 'timeserie':
                    (<TimeserieConfig>row).options = defaultTimeserieOptions();
                    break;
            }
        });
    },

    setPropLevelForConfig(pn: string, l: StringOptionLevel) {
        updateConfigRow(pn, (row: ConfigWithLevel) => row.options.level = l);
    },

    setPropStyleForConfig(pn: string, s: StringOptionStyle) {
        updateConfigRow(pn, (row: ConfigWithStyle) => row.options.style = s);
    },

    setPropWithLabelForConfig(pn: string, l: boolean) {
        updateConfigRow(pn, (row: ConfigWithLabel) => row.options.withLabel = l);
    },

    setTimeserieUrl(pn: string, urlTemplate: string) {
        updateConfigRow(pn, (row: TimeserieConfig) => {
            row.options.urlTemplate = urlTemplate;
            return row;
        });
    },

    removePieChartPiece(pn: string, pieceName: string) {
        updateConfigRow(pn, (row: PiechartConfig) => {
            const pieces = row.options.columns.filter(
                p => p.propName !== pieceName);
            row.options.columns = pieces;
            return row;
        });
    },

    addPieChartPiece(pn: string, pieceName: string) {
        updateConfigRow(pn, (row: PiechartConfig) => {
            const p = row.options.columns.find(
                p => p.propName === pieceName);
            if (!p) {
                const np: PiechartPiece = {
                    propName: pieceName,
                    color: '#aaaaaa',
                };
                row.options.columns.push(np);
            }
            return row;
        });
    },

    setPiechartPieceColor(pn: string, pieceName: string, c: string) {
        updateConfigRow(pn, (row: PiechartConfig) => {
            const p = row.options.columns.find(
                p => p.propName === pieceName);
            if (p) {
                p.color = c;
            }
            return row;
        });
    },

    setPiechartPieceLabel(pn: string, pieceName: string, l: string) {
        updateConfigRow(pn, (row: PiechartConfig) => {
            const p = row.options.columns.find(
                p => p.propName === pieceName);
            if (p) {
                p.label = l;
            }
            return row;
        });
    },

    setPiechartScale(pn: string, scale: 'normal' | 'log') {
        updateConfigRow(pn, (row: PiechartConfig) => {
            row.options.scale = scale;
            return row;
        });
    },

    setPiechartRadius(pn: string, radius: 'normal' | 'dynamic') {
        updateConfigRow(pn, (row: PiechartConfig) => {
            row.options.radius = radius;
            return row;
        });
    },

    setEditedValue(v: string) {
        dispatch('component/feature-config', (state) => {
            state.editedValue = v;
            return state;
        });
    },

    resetEditedValue() {
        dispatch('component/feature-config', (state) => {
            state.editedValue = null;
            return state;
        });
    },

    toDefault() {
        setOptions<FeatureViewDefault>(defaultDefaultOptions());
    },

    toConfig() {
        setOptions<FeatureViewConfig>(configDefaultOptions());
    },
};

export default events;
