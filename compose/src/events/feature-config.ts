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

import { dispatch } from 'sdi/shape';
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
    TextConfig,
    defaultTextOptions,
} from 'sdi/source';
import { getLang } from 'sdi/app';

import { syncMap } from '../util/app';
import queries from '../queries/app';
import { initialFeatureConfigState } from '../components/feature-config/index';
import { fromNullable } from 'fp-ts/lib/Option';
import { getSource } from '../queries/table';
import { selectFeature, selectFeatureRow } from './table';


const logger = debug('sdi:events/feature-config');

const defaultRowConfig =
    (pn: string): StringConfig => ({
        propName: pn,
        type: 'string',
        lang: getLang(),
        options: {
            level: 'normal',
            withLabel: true,
            style: 'normal',
        },
    });

const configDefaultOptions =
    (rows: RowConfig[]): FeatureViewConfig => ({ type: 'config', rows });

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

const getRowsLc =
    (config: FeatureViewConfig, invert = false) => {
        const lc = getLang();
        if (invert) {
            return config.rows.filter(r => r.lang !== lc);
        }
        return config.rows.filter(r => r.lang === lc);
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
    (fn: UpdateFn<FeatureViewConfig>) =>
        updateOptions(fn, () => configDefaultOptions([]));



const updateConfigRow =
    (index: number, fn: UpdateConfigRowFn) => {
        updateConfig((c) => {
            // const rows = getRowsLc(c);
            const row = getRowsLc(c)[index];
            if (row) {
                logger(`updateConfigRow ${index}`);
                fn(row);
            }
            return c;
        });
    };



export const ensureSelectedFeature =
    () => {
        if (queries.getCurrentFeature() === null) {
            fromNullable(getSource().data).map((data) => {
                if (data.length > 0) {
                    selectFeatureRow(0);
                    selectFeature(data[0]);
                }
            })
        }
    };

export const setCurrentRow =
    (index: number) =>
        dispatch('component/feature-config', (state) => {
            state.currentRow = index;
            return state;
        });


export const addPropToConfig =
    (pn: string, propType = 'string' as PropType) =>
        updateConfig((c) => {
            const conf = (c.type !== 'config') ?
                configDefaultOptions([]) :
                c;
            const rowConfig = defaultRowConfig(pn);
            resetRowType(propType, rowConfig);
            conf.rows.push(rowConfig);
            return conf;
        });


export const removePropFromConfig =
    (index: number) =>
        updateConfig((c) => {
            const rows = getRowsLc(c);
            const rest = getRowsLc(c, true);
            rows.splice(index, 1);
            c.rows = rows.concat(rest);
            return c;
        });


export const resetEditor =
    () => dispatch('component/feature-config', () => initialFeatureConfigState());


export const movePropUp =
    (index: number) =>
        updateConfig((conf) => {
            const rows = getRowsLc(conf);
            const rest = getRowsLc(conf, true);
            if (index >= 0) {
                const next = index - 1;
                const row = rows[index];
                rows[index] = rows[next];
                rows[next] = row;
            }
            conf.rows = rows.concat(rest);
            return conf;
        });


export const movePropDown =
    (index: number) =>
        updateConfig((conf) => {
            const rows = getRowsLc(conf);
            const rest = getRowsLc(conf, true);
            if (index >= 0 && index + 1 < rows.length) {
                const next = index + 1;
                const row = rows[index];
                rows[index] = rows[next];
                rows[next] = row;
            }
            conf.rows = rows.concat(rest);
            return conf;
        });

const resetRowType =
    (pt: PropType, row: RowConfig) => {
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
            case 'text':
                (<TextConfig>row).options = defaultTextOptions();
                break;
        }
    };


export const setPropTypeForConfig =
    (index: number, pt: PropType) =>
        updateConfigRow(index, row => resetRowType(pt, row));


export const setPropLevelForConfig =
    (index: number, l: StringOptionLevel) =>
        updateConfigRow(index, (row: ConfigWithLevel) => row.options.level = l);


export const setPropStyleForConfig =
    (index: number, s: StringOptionStyle) =>
        updateConfigRow(index, (row: ConfigWithStyle) => row.options.style = s);


export const setPropWithLabelForConfig =
    (index: number, l: boolean) =>
        updateConfigRow(index,
            (row: ConfigWithLabel) => row.options.withLabel = l);


export const setTimeserieUrl =
    (index: number, urlTemplate: string) =>
        updateConfigRow(index, (row: TimeserieConfig) => {
            row.options.urlTemplate = urlTemplate;
            return row;
        });


export const setTimeserieReference =
    (index: number, ref: number | null) =>
        updateConfigRow(index, (row: TimeserieConfig) => {
            row.options.referencePoint = ref;
            return row;
        });


export const setTextText =
    (index: number, text: string) =>
        updateConfigRow(index, (row: TextConfig) => {
            row.options.text = text;
            return row;
        });

export const removePieChartPiece =
    (index: number, pieceName: string) =>
        updateConfigRow(index, (row: PiechartConfig) => {
            const pieces = row.options.columns.filter(
                p => p.propName !== pieceName);
            row.options.columns = pieces;
            return row;
        });


export const addPieChartPiece =
    (index: number, pieceName: string) =>
        updateConfigRow(index, (row: PiechartConfig) => {
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


export const setPiechartPieceColor =
    (index: number, pieceName: string, c: string) =>
        updateConfigRow(index, (row: PiechartConfig) => {
            const p = row.options.columns.find(
                p => p.propName === pieceName);
            if (p) {
                p.color = c;
            }
            return row;
        });


export const setPiechartPieceLabel =
    (index: number, pieceName: string, l: string) =>
        updateConfigRow(index, (row: PiechartConfig) => {
            const p = row.options.columns.find(
                p => p.propName === pieceName);
            if (p) {
                p.label = l;
            }
            return row;
        });


export const setPiechartScale =
    (index: number, scale: 'normal' | 'log') =>
        updateConfigRow(index, (row: PiechartConfig) => {
            row.options.scale = scale;
            return row;
        });


export const setPiechartRadius =
    (index: number, radius: 'normal' | 'dynamic') =>
        updateConfigRow(index, (row: PiechartConfig) => {
            row.options.radius = radius;
            return row;
        });


export const setEditedValue =
    (v: string) => dispatch('component/feature-config', (state) => {
        state.editedValue = v;
        return state;
    });


export const resetEditedValue =
    () => dispatch('component/feature-config', (state) => {
        state.editedValue = null;
        return state;
    });


export const toDefault =
    () => setOptions<FeatureViewDefault>(defaultDefaultOptions());


export const toConfig =
    () => setOptions<FeatureViewConfig>(configDefaultOptions([]));



logger('loaded');
