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
import tr from 'sdi/locale';
import { DIV, SPAN, INPUT } from 'sdi/components/elements';
import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';
// import slider from '../slider';
// import { ReactNode } from 'react';

const logger = debug(`sdi:legend-editor/tool-input`);

type NumberGetter = () => number;
type NumberSetter = (a: number) => void;

// type ColorGetter = () => string;
// type ColorSetter = (a: string) => void;

type AlphaColorGetter = () => Color.Color;
type AlphaColorSetter = (a: Color.Color) => void;

type IconGetter = () => number;
type IconSetter = (a: number) => void;

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


const renderInputIcon =
    (className: string, get: IconGetter, set: IconSetter) => {
        const series = [
            [
                0xf111,
                0xf1db,
                0xf10c,
                0xf192,
            ],
            [
                0xf075,
                0xf071,
                0xf06a,
                0xf059,
                0xf05a,
            ],
            [
                0xf193,
                0xf206,
                0xf1b9,
                0xf207,
                0xf0d1,
                0xf238,
                0xf21a,
            ],
            [
                0xf1b0,
                0xf06c,
                0xf1bb,
                0xf19c,
                0xf000,
                0xf015,
                0xf1f8,
                0xf153,
            ],
        ];

        const selected = get();

        const renderIcon = (icon: number) => (
            DIV({
                className: (icon === selected) ? 'picto selected' : 'picto',
                onClick: () => set(icon),
            }, String.fromCodePoint(icon)));

        const renderSerie = (serie: number[]) => (
            DIV({
                className: 'picto-serie',
            }, serie.map(renderIcon)));

        return (
            DIV({ className: `style-tool picto-collection ${className}` },
                DIV({ className: 'picto-library' }, series.map(renderSerie)))
        );
    };

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
            DIV({ className: `style-tool ${className}` },
                SPAN({ className: 'input-label' }, label),
                INPUT({ value, type: 'number', onChange: update }))
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
            INPUT({
                type: 'number',
                value: Math.round(color.red()),
                onChange: e => set(color.red(e.currentTarget.valueAsNumber)),
            }));
        const g = SPAN({ className: 'green' },
            INPUT({
                type: 'number',
                value: Math.round(color.green()),
                onChange: e => set(color.green(e.currentTarget.valueAsNumber)),
            }));
        const b = SPAN({ className: 'blue' },
            INPUT({
                type: 'number',
                value: Math.round(color.blue()),
                onChange: e => set(color.blue(e.currentTarget.valueAsNumber)),
            }));

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
                className: 'color-hue',
                onClick: updateHue,
            }));

        const saturation = wrap(color.saturationl(),
            DIV({
                className: 'picker',
                style: {
                    background: `linear-gradient(to right, ${color.saturationl(0)}, ${color.saturationl(50)}, ${color.saturationl(100)})`,
                },
                onClick: updateSaturation,
            }));

        const lightness = wrap(color.lightness(),
            DIV({
                className: 'picker',
                style: {
                    background: `linear-gradient(to right, ${color.lightness(0)}, ${color.lightness(50)}, ${color.lightness(100)})`,
                },
                onClick: updateLightness,
            }));

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
        const value = get();
        // logger(`renderInputText ${value}`);
        const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            // logger(`renderInputText update ${e.currentTarget.value}`);
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            DIV({ className: `style-tool ${className}` },
                SPAN({ className: 'input-label' }, label),
                INPUT({ value, type: 'text', onChange: update }))
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
        return renderInputIcon('code',
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
        return renderInputIcon('code',
            () => queries.getMarkerCodepoint(),
            (n: number) => events.setMarkerCodepoint(n));
    };

logger('loaded');
