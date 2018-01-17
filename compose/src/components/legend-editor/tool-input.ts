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
import * as Color from 'color';
import { fromPredicate } from 'fp-ts/lib/Option';

import tr from 'sdi/locale';
import { DIV, SPAN } from 'sdi/components/elements';
import { inputNumber, inputText } from 'sdi/components/input';
import { PatternAngle } from 'sdi/source';

import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';
// import slider from '../slider';
// import { ReactNode } from 'react';

const logger = debug(`sdi:legend-editor/tool-input`);

const notNan = fromPredicate<number>(n => !Number.isNaN(n));

type Getter<T> = () => T;
type Setter<T> = (v: T) => void;

type NumberGetter = () => number;
type NumberSetter = (a: number) => void;

// type ColorGetter = () => string;
// type ColorSetter = (a: string) => void;

type AlphaColorGetter = () => Color.Color;
type AlphaColorSetter = (a: Color.Color) => void;

type TextGetter = () => string;
type TextSetter = (a: string) => void;


const makeColor = (i: string | number, a?: number) => {
    try {
        if (a) {
            return Color(i).alpha(a);
        }
        return Color(i);
    }
    catch (e) {
        return Color('rgb(0,0,0)');
    }
};


interface Selection<T> {
    [k: string]: T;
}

const renderSelection =
    <T>(series: Selection<T>[]) =>
        (className: string, get: Getter<T>, set: Setter<T>) => {
            const selected = get();

            const renderItem = (k: string, val: T) => (
                DIV({
                    className: (val === selected) ? 'selected' : '',
                    onClick: () => set(val),
                }, k));

            const renderSerie = (serie: Selection<T>) => (
                DIV({
                    className: 'serie',
                }, Object.keys(serie).map(k => renderItem(k, serie[k]))));

            return (
                DIV({ className },
                    DIV({ className: 'library' }, series.map(renderSerie)))
            );
        };

const renderInputIcon = renderSelection([{
    [String.fromCodePoint(0xf111)]: 0xf111,
    [String.fromCodePoint(0xf1db)]: 0xf1db,
    [String.fromCodePoint(0xf10c)]: 0xf10c,
    [String.fromCodePoint(0xf192)]: 0xf192,
}]);


const renderInputPatternAngle = renderSelection<PatternAngle>([{
    '|': 0,
    '/': 45,
    '--': 90,
    '\\': 135,
}]);


const renderInputNumber =
    (className: string, label: string, get: NumberGetter, set: NumberSetter) => {
        const update = (newVal: number) => {
            if (!isNaN(newVal)) {
                set(newVal);
            }
        };

        return (
            DIV({ className: `style-tool ${className}` },
                SPAN({ className: 'input-label' }, label),
                inputNumber(get, update))
        );
    };


const updateColor =
    (f: (n: number) => void) => (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const r = target.getBoundingClientRect();
        const val = Math.round((e.clientX - r.left) / r.width * 10000) / 10000;
        f(val);
    };


const renderRGB =
    (get: AlphaColorGetter, set: AlphaColorSetter) => {
        const color = get();
        const r = SPAN({ className: 'red' },
            inputNumber(
                () => Math.round(get().red()),
                i => notNan(i).fold(
                    () => set(get().red(0)),
                    n => set(get().red(n))),
                { min: 0, max: 255 }));

        const g = SPAN({ className: 'green' },
            inputNumber(
                () => Math.round(get().green()),
                i => notNan(i).fold(
                    () => set(get().green(0)),
                    n => set(get().green(n))),
                { min: 0, max: 255 }));

        const b = SPAN({ className: 'blue' },
            inputNumber(
                () => Math.round(get().blue()),
                i => notNan(i).fold(
                    () => set(get().blue(0)),
                    n => set(get().blue(n))),
                { min: 0, max: 255 }));

        const preview = SPAN({ className: 'color-preview' },
            SPAN({
                className: 'color-color',
                style: {
                    backgroundColor: color.toString(),
                },
            }));

        return DIV({ className: 'color-rgb' }, r, g, b, preview);
    };

export const renderInputAlphaColor =
    (className: string, label: string, get: AlphaColorGetter, set: AlphaColorSetter) => {
        const color = get();

        const updateHue = updateColor((val: number) => {
            set(color.hue(val * 360));
        });
        const updateSaturation = updateColor((val: number) => {
            set(color.saturationl(val * 100));
        });
        const updateLightness = updateColor((val: number) => {
            set(color.lightness(val * 100));
        });
        const updateAlpha = updateColor((val: number) => {
            set(color.alpha(val));
        });



        const wrap =
            (v: number, e: React.ReactNode) => (
                DIV({ className: 'color-component' },
                    e,
                    DIV({
                        className: 'marker',
                        style: {
                            left: `${v}%`,
                        },
                    })));

        const hue = wrap(color.hue() / 360 * 100,
            DIV({
                className: 'picker color-hue',
                onClick: updateHue,
            }));

        const saturation = wrap(color.saturationl(),
            DIV({ className: 'saturation-preview' }, DIV({
                className: 'picker',
                style: {
                    background: `linear-gradient(to right, ${color.saturationl(0)}, ${color.saturationl(50)}, ${color.saturationl(100)})`,
                },
                onClick: updateSaturation,
            })));

        const lightness = wrap(color.lightness(),
            DIV({ className: 'lightness-preview' }, DIV({
                className: 'picker ',
                style: {
                    background: `linear-gradient(to right, ${color.lightness(0)}, ${color.lightness(50)}, ${color.lightness(100)})`,
                },
                onClick: updateLightness,
            })));

        const alpha = wrap(color.alpha() * 100,
            DIV({ className: 'alpha-preview' }, DIV({
                className: 'picker',
                style: {
                    background: `linear-gradient(to right, ${color.alpha(0)}, ${color.alpha(1)})`,
                },
                onClick: updateAlpha,
            })));

        return (
            DIV({ className: `style-tool alpha-color ${className}` },
                SPAN({ className: 'input-label' }, label),
                renderRGB(get, set),
                hue, saturation, lightness, alpha)
        );
    };

const renderInputText =
    (className: string, label: string, get: TextGetter, set: TextSetter) => {
        return (
            DIV({ className: `style-tool ${className}` },
                SPAN({ className: 'input-label' }, label),
                inputText(get, set))
        );
    };



export const lineWidth =
    () => {
        return renderInputNumber('size', tr('lineWidth'),
            () => queries.getStrokeWidth(1),
            (n: number) => events.setStrokeWidth(n));
    };

export const lineColor =
    () => {
        return renderInputAlphaColor('color', tr('lineColor'),
            () => makeColor(queries.getStrokeColor('#FF00D0')),
            c => events.setStrokeColor(c.string()));
    };

export const fillColor =
    () => {
        return renderInputAlphaColor('color', tr('fillColor'),
            () => makeColor(queries.getFillColor('#FF00D0')),
            c => events.setFillColor(c.string()));
    };


export const pattern =
    () => {
        const p = queries.getPattern();
        if (!p) {
            return DIV({
                className: 'hatch-pattern inactive',
                onClick: () => events.setPattern(true),
            }, tr('usePattern'));
        }
        return DIV({},
            DIV({
                className: 'hatch-pattern active',
                onClick: () => events.setPattern(false),
            }, tr('usePattern')),
            renderInputPatternAngle('angle', queries.getPatternAngle, events.setPatternAngle));
    };

export const lineWidthForGroup =
    (idx: number) => {
        return renderInputNumber('size', tr('lineWidth'),
            () => queries.getStrokeWidthForGroup(idx, 1),
            (n: number) => events.setStrokeWidthForGroup(idx, n));
    };

export const lineColorForGroup =
    (idx: number) => {
        return renderInputAlphaColor('color', tr('lineColor'),
            () => makeColor(queries.getStrokeColorForGroup(idx, '#FF00D0')),
            c => events.setStrokeColorForGroup(idx, c.string()));
    };

export const fillColorForGroup =
    (idx: number) => {
        return renderInputAlphaColor('color', tr('fillColor'),
            () => makeColor(queries.getFillColorForGroup(idx, '#FF00D0')),
            c => events.setFillColorForGroup(idx, c.string()));
    };

export const patternForGroup =
    (idx: number) => {
        const p = queries.getPatternForGroup(idx);
        if (!p) {
            return DIV({
                className: 'hatch-pattern inactive',
                onClick: () => events.setPatternForGroup(idx, true),
            }, tr('usePattern'));
        }
        return DIV({},
            DIV({
                className: 'hatch-pattern active',
                onClick: () => events.setPatternForGroup(idx, false),
            }, tr('usePattern')),
            renderInputPatternAngle('angle',
                () => queries.getPatternAngleForGroup(idx),
                v => events.setPatternAngleForGroup(idx, v)));
    };

export const fontColor =
    () => {
        return renderInputAlphaColor('color', tr('fontColor'),
            () => makeColor(queries.getFontColor()),
            c => events.setFontColor(c.string()));
    };

export const fontSize =
    () => {
        return renderInputNumber('size', tr('fontSize'),
            () => queries.getFontSize(),
            (n: number) => events.setFontSize(n));
    };

export const offsetX =
    () => {
        return renderInputNumber('size', tr('offsetX'),
            () => queries.getOffsetXForLabel(),
            (n: number) => events.setOffsetXForLabel(n));
    };

export const offsetY =
    () => {
        return renderInputNumber('size', tr('offsetY'),
            () => queries.getOffsetYForLabel(),
            (n: number) => events.setOffsetYForLabel(n));
    };


export const propName =
    () => {
        return renderInputText('text', tr('propNameForLabel'),
            () => queries.getPropNameForLabel(),
            (n: string) => events.setPropNameForLabel(n));
    };


export const markerSizeForGroup =
    (idx: number) => {
        return renderInputNumber('size', tr('size'),
            () => queries.getMarkerSizeForGroup(idx),
            (n: number) => events.setMarkerSizeForGroup(idx, n));
    };

export const markerColorForGroup =
    (idx: number) => {
        return renderInputAlphaColor('color', tr('pointColor'),
            () => makeColor(queries.getMarkerColorForGroup(idx)),
            c => events.setMarkerColorForGroup(idx, c.string()));
    };

export const markerCodepointForGroup =
    (idx: number) => {
        return renderInputIcon('style-tool picto-collection code',
            () => queries.getMarkerCodepointForGroup(idx),
            (n: number) => events.setMarkerCodepointForGroup(idx, n));
    };

export const markerSize =
    () => {
        return renderInputNumber('size', tr('size'),
            () => queries.getMarkerSize(),
            (n: number) => events.setMarkerSize(n));
    };

export const markerColor =
    () => {
        return renderInputAlphaColor('color', tr('pointColor'),
            () => makeColor(queries.getMarkerColor()),
            c => events.setMarkerColor(c.string()));
    };

export const markerCodepoint =
    () => {
        return renderInputIcon('style-tool picto-collection code',
            () => queries.getMarkerCodepoint(),
            (n: number) => events.setMarkerCodepoint(n));
    };

logger('loaded');
