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

import { createElement as s } from 'react';

import { DIV } from 'sdi/components/elements';
import { PiechartConfig, PiechartPiece } from 'sdi/source';
import { getAlias } from '../../app';

interface NotNullProperties {
    [key: string]: any;
}


const deg2rad = (d: number) => d * Math.PI / 180;

const polar2cartesian = (R: number, theta: number) => {
    const x = R * Math.cos(deg2rad(theta));
    const y = R * Math.sin(deg2rad(theta));
    return [x, y];
};


const arcString: (a: number, b: number, c: number, d: number, e: number) => string =
    (centerX, centerY, radius, start, stop) => {

        const large = (stop - start) > 180;
        const sweepFlag = 1;
        const largeArcFlag = large ? 1 : 0;
        const [sx, sy] = polar2cartesian(radius, start);
        const [ex, ey] = polar2cartesian(radius, stop);

        return `
    M ${centerX + sx} ${centerY + sy} 
    A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${centerX + ex} ${centerY + ey}
    L ${centerX} ${centerY} Z `;
    };


const normData = (d: number[]): number[] => {
    const sum = Math.max(d.reduce((acc, v) => acc + v, 0), 1);
    return d.map(v => v * 360 / sum);
};


const log = (n: number) => { return (n > 0 ? Math.log(n) : 0); };

const pie = (size: number, props: NotNullProperties, row: PiechartConfig) => {
    let offset = 0;
    const columns = row.options.columns;
    const maxRadius = size * 0.5;
    const minRadius = size * 0.2;
    const radiusInterval = maxRadius - minRadius;
    const c = size * 0.5;

    if (columns.length === 1) {
        return [
            s('circle', {
                cx: c,
                cy: c,
                r: maxRadius,
                fill: columns[0].color,
            }),
        ];
    }

    const rawData = columns.map((c) => {
        const prop = props[c.propName];
        const v = typeof prop === 'number' ? prop : parseFloat(prop);
        if (row.options.scale === 'log') {
            return log(v);
        }
        return v;
    });
    const radius = (v: number) => {
        if (row.options.radius === 'dynamic' && interval > 0) {
            return ((v - min) * radiusInterval / interval) + minRadius;
        }
        return maxRadius;
    };
    const data = normData(rawData);
    const [min, max] = data.reduce((acc, v) => {
        return [Math.min(acc[0], v), Math.max(acc[1], v)];
    }, [Number.MAX_VALUE, Number.MIN_VALUE]);
    const interval = max - min;
    return data.map((v, idx) => {
        const color = columns[idx].color;
        if (v >= 360) {
            return s('circle', {
                cx: c,
                cy: c,
                r: maxRadius,
                fill: color,
            });
        }
        const p = arcString(c, c,
            radius(v),
            offset, offset + v);
        offset += v;
        return s('path', { d: p, fill: color });
    });
};





const makeContinousLegendItem =
    (props: NotNullProperties) =>
        (c: PiechartPiece) => (
            DIV({ className: 'chart-legend-item' },
                DIV({
                    className: 'chart-item-color',
                    style: { backgroundColor: c.color },
                }),
                DIV({ className: 'chart-item-content' },
                    DIV({ className: 'chart-item-label' },
                        c.label ? c.label : getAlias(c.propName)),
                    DIV({ className: 'chart-item-value' },
                        props[c.propName].toString())
                ))
        );

const makeContinousLegend =
    (row: PiechartConfig, props: NotNullProperties) => {
        const items = row.options.columns.map(makeContinousLegendItem(props));
        return (
            DIV({ className: 'chart-legend' }, ...items)
        );
    };






const render =
    (props: NotNullProperties, row: PiechartConfig) => {

        const svg = s('svg', { viewBox: '0 0 100 100' },
            ...pie(100, props, row));
        const legend = makeContinousLegend(row, props);

        return (
            DIV({ className: 'chart-wrapper' },
                DIV({ className: 'chart-viz' }, svg, legend))
        );
    };

export default render;
