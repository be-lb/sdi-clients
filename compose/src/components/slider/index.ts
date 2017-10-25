

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
import * as uuid from 'uuid';
import { DIV } from 'sdi/components/elements';

const logger = debug('sdi:slider');

type Point = [number, number];

const px = (n: number) => `${n}px`;
const percent = (n: number) => `${n}%`;
const x = (p: Point) => p[0];
// const y = (p: Point) => p[1];
const identity = (a: number) => a;
const clamper =
    (min: number, max: number) =>
        (v: number) => Math.max(Math.min(max, v), min);


const projection =
    (source: Point, target: Point) => {

        const forward =
            (value: number) => {
                const [sMin, sMax] = source;
                const [tMin, tMax] = target;
                const sourceInterval = sMax - sMin;
                const targetInterval = tMax - tMin;
                const sourceValue = value - sMin;
                const result = tMin + ((sourceValue / sourceInterval) * targetInterval);

                return result;
            };

        const inverse =
            (value: number) => {
                const [sMin, sMax] = source;
                const [tMin, tMax] = target;
                const sourceInterval = sMin + (sMax - sMin);
                const targetInterval = tMin + (tMax - tMin);
                const targetValue = value - tMin;
                const result = sMin + ((targetValue / targetInterval) * sourceInterval);

                return result;
            };

        return { forward, inverse };
    };



const mouseEventPos =
    (e: React.MouseEvent<Element>, ref: Element): [number, number] => {
        const rect = ref.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };



export interface SliderOptions {
    min: number;
    max: number;
    unit?: string;
    parser?: (n: number) => number;
}

interface RefReg {
    [k: string]: Element | null;
}

const references: RefReg = {};

/**
 * [slider description]
 * @method slider
 * @param  SliderOptions options
 */
const slider =
    (options: SliderOptions) => {
        const { parser, min, max } = options;
        const clamp = clamper(min, max);
        const sureParser = parser !== undefined ? parser : identity;
        const id = uuid();

        const clampedParser = (v: number) => clamp(sureParser(v));

        let started = false;
        // let refLine: Element | null = null;
        const setRefLine =
            (e: Element | null) => references[id] = e;

        const withLine =
            (f: (l: Element) => void) => {
                if (id in references) {
                    const e = references[id];
                    if (e !== null) {
                        f(e);
                    }
                }
            };


        const component =
            (value: number, set: (n: number) => void) => {
                const offset = (100 * (value - min)) / (max - min);
                // withLine((refLine) => {
                //     const { forward } = projection(
                //         [min, max], [0, refLine.getBoundingClientRect().width]);
                //     offset = forward(value);
                // });
                logger(`${id} => ${value} => ${offset}`);

                const startHandler =
                    () => {
                        started = true;
                    };

                const stopHandler =
                    (e: React.MouseEvent<Element>) => {
                        if (started) {
                            withLine((line) => {
                                const { forward } = projection(
                                    [0, line.getBoundingClientRect().width],
                                    [min, max]);
                                const pos = mouseEventPos(e, line);
                                const newValue = clampedParser(forward(x(pos)));
                                started = false;
                                set(newValue);
                            });
                        }
                    };

                const moveHandler =
                    (e: React.MouseEvent<Element>) => {
                        if (started) {
                            withLine((line) => {
                                const pos = mouseEventPos(e, line);
                                const cursor = line.querySelector('.slider-square');
                                if (cursor) {
                                    (<HTMLElement>cursor).style.left = px(x(pos));
                                }
                            });
                        }
                    };

                const cancelHandler =
                    () => {
                        if (started) {
                            started = false;
                            // set(value);
                        }
                    };


                return (
                    DIV({
                        className: 'slider',
                    },
                        DIV({
                            className: 'slider-wrapper',
                            ref: setRefLine,
                            onMouseDown: startHandler,
                            onMouseUp: stopHandler,
                            onMouseMove: moveHandler,
                            onMouseLeave: cancelHandler,
                        },
                            DIV({
                                className: 'slider-line',
                            }),
                            DIV({
                                className: 'slider-square',
                                style: {
                                    position: 'absolute',
                                    left: percent(offset),
                                },
                            }))));
            };

        return component;
    };


export default slider;

logger('loaded');
