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

import { i, u, l, p, a, MessageRecordIO, TypeOf } from './io';
import { GeometryType } from './geojson';
import * as io from 'io-ts';



export const PatternAngleIO = u([l(0), l(45), l(90), l(135)], 'PatterAngleIO');
export type PatternAngle = TypeOf<typeof PatternAngleIO>;

export const PolygonStyleConfigSimpleIO = io.intersection([
    i({
        kind: l('polygon-simple'),
        strokeColor: io.string,
        fillColor: io.string,
        strokeWidth: io.number,
        pattern: io.boolean,
        patternAngle: PatternAngleIO,
    }),
    p({ patternColor: io.string })], 'PolygonStyleConfigSimpleIO');
export type PolygonStyleConfigSimple = TypeOf<typeof PolygonStyleConfigSimpleIO>;

export const PolygonIntervalIO = io.intersection([
    i({
        label: MessageRecordIO,
        low: io.number,
        high: io.number,
        fillColor: io.string,
        strokeColor: io.string,
        strokeWidth: io.number,
        pattern: io.boolean,
        patternAngle: PatternAngleIO,
    }),
    p({ patternColor: io.string })], 'PolygonIntervalIO');
export type PolygonInterval = TypeOf<typeof PolygonIntervalIO>;

export const PolygonStyleConfigContinuousIO = i({
    kind: l('polygon-continuous'),
    propName: io.string,
    intervals: a(PolygonIntervalIO),
}, 'PolygonStyleConfigContinuousIO');
export type PolygonStyleConfigContinuous = TypeOf<typeof PolygonStyleConfigContinuousIO>;

export const PolygonDiscreteGroupIO = io.intersection([
    i({
        values: a(io.string),
        fillColor: io.string,
        strokeColor: io.string,
        strokeWidth: io.number,
        pattern: io.boolean,
        patternAngle: PatternAngleIO,
        label: MessageRecordIO,
    }),
    p({ patternColor: io.string })], 'PolygonDiscreteGroupIO');
export type PolygonDiscreteGroup = TypeOf<typeof PolygonDiscreteGroupIO>;

export const PolygonStyleConfigDiscreteIO = i({
    kind: l('polygon-discrete'),
    propName: io.string,
    groups: a(PolygonDiscreteGroupIO),
}, 'PolygonStyleConfigDiscreteIO');
export type PolygonStyleConfigDiscrete = TypeOf<typeof PolygonStyleConfigDiscreteIO>;

export const PolygonStyleConfigIO = u([
    PolygonStyleConfigSimpleIO,
    PolygonStyleConfigContinuousIO,
    PolygonStyleConfigDiscreteIO,
], 'PolygonStyleConfigIO');
export type PolygonStyleConfig = TypeOf<typeof PolygonStyleConfigIO>;


export const PointLabelIO = io.intersection([
    i({
        propName: MessageRecordIO,
        align: u([l('left'), l('right'), l('center'), l('end'), l('start')]),
        baseline: u([l('alphabetic'), l('bottom'), l('top'), l('middle')]),
        resLimit: io.number,
        color: io.string,
        size: io.number,
    }),
    p({
        xOffset: io.number,
        yOffset: io.number,
    }),
], 'PointLabelIO');

export type PointLabel = TypeOf<typeof PointLabelIO>;

export const MarkerIO = i({
    codePoint: io.number,
    color: io.string,
    size: io.number,
}, 'MarkerIO');

export type PointMarker = TypeOf<typeof MarkerIO>;

export const PointStyleConfigSimpleIO = io.intersection([
    i({
        kind: l('point-simple'),
    }),
    p({
        label: PointLabelIO,
        marker: MarkerIO,
    }),
], 'PointStyleConfigSimpleIO');
export type PointStyleConfigSimple = TypeOf<typeof PointStyleConfigSimpleIO>;

export const PointDiscreteGroupIO = i({
    values: a(io.string),
    marker: MarkerIO,
    label: MessageRecordIO,
}, 'PointDiscreteGroupIO');
export type PointDiscreteGroup = TypeOf<typeof PointDiscreteGroupIO>;

export const PointStyleConfigDiscreteIO = io.intersection([
    i({
        kind: l('point-discrete'),
        propName: io.string,
        groups: a(PointDiscreteGroupIO),
    }),
    p({
        label: PointLabelIO,
    }),
], 'PointStyleConfigDiscreteIO');
export type PointStyleConfigDiscrete = TypeOf<typeof PointStyleConfigDiscreteIO>;

export const PointIntervalIO = i({
    label: MessageRecordIO,
    low: io.number,
    high: io.number,
    marker: MarkerIO,
}, 'PointIntervalIO');
export type PointInterval = TypeOf<typeof PointIntervalIO>;

export const PointStyleConfigContinuousIO = io.intersection([
    i({
        kind: l('point-continuous'),
        propName: io.string,
        intervals: a(PointIntervalIO),
    }),
    p({
        label: PointLabelIO,
    }),
], 'PointStyleConfigContinuousIO');
export type PointStyleConfigContinuous = TypeOf<typeof PointStyleConfigContinuousIO>;


export const PointStyleConfigIO = u([
    PointStyleConfigSimpleIO,
    PointStyleConfigDiscreteIO,
    PointStyleConfigContinuousIO,
], 'PointStyleConfigIO');
export type PointStyleConfig = TypeOf<typeof PointStyleConfigIO>;
export type PointStyleConfigWithLabel = PointStyleConfig & { label: PointLabel };
export type PointStyleConfigWithMarker = PointStyleConfig & { marker: PointMarker };

export const isMarkered = (a: PointStyleConfig): a is PointStyleConfigWithMarker => {
    return ('marker' in a);
};

export const isLabeled = (a: PointStyleConfig): a is PointStyleConfigWithLabel => {
    return ('label' in a);
};


export const LineStyleConfigSimpleIO = i({
    kind: l('line-simple'),
    strokeColor: io.string,
    dash: a(io.number),
    strokeWidth: io.number,
}, 'LineStyleConfigSimpleIO');
export type LineStyleConfigSimple = TypeOf<typeof LineStyleConfigSimpleIO>;


export const LineDiscreteGroupIO = i({
    values: a(io.string),
    label: MessageRecordIO,
    strokeColor: io.string,
    strokeWidth: io.number,
    dash: a(io.number),
}, 'LineDiscreteGroupIO');
export type LineDiscreteGroup = TypeOf<typeof LineDiscreteGroupIO>;

export const LineStyleConfigDiscreteIO = i({
    kind: l('line-discrete'),
    propName: io.string,
    groups: a(LineDiscreteGroupIO),
}, 'LineStyleConfigDiscreteIO');
export type LineStyleConfigDiscrete = TypeOf<typeof LineStyleConfigDiscreteIO>;

export const LineIntervalIO = i({
    label: MessageRecordIO,
    low: io.number,
    high: io.number,
    strokeColor: io.string,
    strokeWidth: io.number,
}, 'LineIntervalIO');
export type LineInterval = TypeOf<typeof LineIntervalIO>;

export const LineStyleConfigContinuousIO = i({
    kind: l('line-continuous'),
    propName: io.string,
    intervals: a(LineIntervalIO),
}, 'LineStyleConfigContinuousIO');
export type LineStyleConfigContinuous = TypeOf<typeof LineStyleConfigContinuousIO>;

export const LineStyleConfigIO = u([
    LineStyleConfigDiscreteIO,
    LineStyleConfigSimpleIO,
    LineStyleConfigContinuousIO,
], 'LineStyleConfigIO');
export type LineStyleConfig = TypeOf<typeof LineStyleConfigIO>;

export const StyleConfigIO = u([
    PolygonStyleConfigIO,
    LineStyleConfigIO,
    PointStyleConfigIO,
], 'StyleConfigIO');
// export type StyleConfig = TypeOf<typeof StyleConfigIO>;
export type StyleConfig = PolygonStyleConfig | LineStyleConfig | PointStyleConfig;
export type SimpleteStyle = PointStyleConfigSimple | LineStyleConfigSimple | PolygonStyleConfigSimple;
export type DiscreteStyle = PointStyleConfigDiscrete | LineStyleConfigDiscrete | PolygonStyleConfigDiscrete;
export type ContinuousStyle = PolygonStyleConfigContinuous | LineStyleConfigContinuous | PointStyleConfigContinuous;

export type DiscreteGroup = LineDiscreteGroup | PointDiscreteGroup | PolygonDiscreteGroup;

export type ContinuousInterval = PolygonInterval | PointInterval | LineInterval;

export type StyleGroupType = ContinuousInterval | DiscreteGroup;

export interface Kind {
    'point-simple': PointStyleConfigSimple;
    'point-discrete': PointStyleConfigDiscrete;
    'point-continuous': PointStyleConfigContinuous;
    'line-simple': LineStyleConfigSimple;
    'line-discrete': LineStyleConfigDiscrete;
    'line-continuous': LineStyleConfigContinuous;
    'polygon-simple': PolygonStyleConfigSimple;
    'polygon-discrete': PolygonStyleConfigDiscrete;
    'polygon-continuous': PolygonStyleConfigContinuous;
}

export const isKind =
    <K extends keyof Kind>(k: K) => (s: StyleConfig): s is Kind[K] => {
        if (s.kind === k) {
            return true;
        }
        return false;
    };

export const isPointSimple = isKind('point-simple');
export const isPointDiscrete = isKind('point-discrete');
export const isPointContinuous = isKind('point-continuous');
export const isLineSimple = isKind('line-simple');
export const isLineDiscrete = isKind('line-discrete');
export const isLineContinuous = isKind('line-continuous');
export const isPolygonSimple = isKind('polygon-simple');
export const isPolygonDiscrete = isKind('polygon-discrete');
export const isPolygonContinuous = isKind('polygon-continuous');


export const isSimple = (s: StyleConfig): s is SimpleteStyle => {
    switch (s.kind) {
        case 'point-simple':
        case 'line-simple':
        case 'polygon-simple': return true;
    }
    return false;
};
export const isDiscrete = (s: StyleConfig): s is DiscreteStyle => {
    switch (s.kind) {
        case 'point-discrete':
        case 'line-discrete':
        case 'polygon-discrete': return true;
    }
    return false;
};
export const isContinuous = (s: StyleConfig): s is ContinuousStyle => {
    switch (s.kind) {
        case 'point-continuous':
        case 'line-continuous':
        case 'polygon-continuous': return true;
    }
    return false;
};


export const isPointStyle = (s: StyleConfig): s is PointStyleConfig => {
    switch (s.kind) {
        case 'point-simple':
        case 'point-discrete':
        case 'point-continuous': return true;
    }
    return false;
};

export const isLineStyle = (s: StyleConfig): s is LineStyleConfig => {
    switch (s.kind) {
        case 'line-simple':
        case 'line-discrete':
        case 'line-continuous': return true;
    }
    return false;
};

export const isPolygonStyle = (s: StyleConfig): s is PolygonStyleConfig => {
    switch (s.kind) {
        case 'polygon-simple':
        case 'polygon-discrete':
        case 'polygon-continuous': return true;
    }
    return false;
};


export const getGroup =
    <S extends DiscreteStyle>(s: S, idx: number): DiscreteGroup | null => {
        switch (s.kind) {
            case 'point-discrete': return s.groups[idx];
            case 'line-discrete': return s.groups[idx];
            case 'polygon-discrete': return s.groups[idx];
        }
        return null;
    };

export const getInterval = (s: ContinuousStyle, idx: number) => {
    let i: PolygonInterval | LineInterval | PointInterval | null = null;
    switch (s.kind) {
        case 'point-continuous':
        case 'line-continuous':
        case 'polygon-continuous': i = s.intervals[idx];
    }
    if (i) {
        return i;
    }
    return null;
};

export type SubType = 'simple' | 'discrete' | 'continuous';

export const getSubtype =
    (s: StyleConfig): SubType => {
        switch (s.kind) {
            case 'line-simple':
            case 'polygon-simple':
            case 'point-simple': return 'simple';
            case 'point-discrete':
            case 'line-discrete':
            case 'polygon-discrete': return 'discrete';
            case 'line-continuous':
            case 'point-continuous':
            case 'polygon-continuous': return 'continuous';
        }
    };

const defaultPointStyle = (s: SubType, propName?: string): PointStyleConfig => {
    switch (s) {
        case 'simple': return ({
            kind: 'point-simple',
            marker: {
                codePoint: 0xf111,
                color: '#00729A',
                size: 16,
            },
        });
        case 'continuous': return ({
            kind: 'point-continuous',
            propName: propName ? propName : '',
            intervals: [],
        });
        case 'discrete': return ({
            kind: 'point-discrete',
            propName: propName ? propName : '',
            groups: [],
        });
    }
};

const defaultLineStyle = (s: SubType, propName?: string): LineStyleConfig => {
    switch (s) {
        case 'simple': return ({
            kind: 'line-simple',
            strokeColor: '#00729A',
            dash: [],
            strokeWidth: 1,
        });
        case 'continuous': return ({
            kind: 'line-continuous',
            propName: propName ? propName : '',
            intervals: [],
        });
        case 'discrete': return ({
            kind: 'line-discrete',
            propName: propName ? propName : '',
            groups: [],
        });
    }
};

const defaultPolygonStyle = (s: SubType, propName?: string): PolygonStyleConfig => {
    switch (s) {
        case 'simple': return ({
            kind: 'polygon-simple',
            strokeColor: '#00729A',
            fillColor: '#00729A',
            strokeWidth: 1,
            pattern: false,
            patternAngle: 0,
        });
        case 'continuous': return ({
            kind: 'polygon-continuous',
            propName: propName ? propName : '',
            intervals: [],
        });
        case 'discrete': return ({
            kind: 'polygon-discrete',
            propName: propName ? propName : '',
            groups: [],
        });
    }
};

export const defaultStyle =
    (gt: GeometryType, subtype: SubType = 'simple', propName?: string): StyleConfig => {
        switch (gt) {
            case 'MultiPolygon':
            case 'Polygon': return defaultPolygonStyle(subtype, propName);
            case 'MultiLineString':
            case 'LineString': return defaultLineStyle(subtype, propName);
            case 'MultiPoint':
            case 'Point': return defaultPointStyle(subtype, propName);
        }
    };



export const addDefaultGroupStyle =
    (s: DiscreteStyle) => {
        switch (s.kind) {
            case 'point-discrete':
                s.groups.push({
                    label: { fr: '', nl: '' },
                    values: [],
                    marker: {
                        codePoint: 0xf111,
                        color: '#00729A',
                        size: 16,
                    },
                });
                return s;

            case 'line-discrete':
                s.groups.push({
                    values: [],
                    label: { fr: '', nl: '' },
                    strokeColor: '#00729A',
                    dash: [],
                    strokeWidth: 1,
                });
                return s;

            case 'polygon-discrete':
                s.groups.push({
                    values: [],
                    label: { fr: '', nl: '' },
                    strokeColor: '#00729A',
                    fillColor: '#00729A',
                    strokeWidth: 1,
                    pattern: false,
                    patternAngle: 0,
                });
                return s;
        }
    };

export const addDefaultIntervalStyle =
    (s: ContinuousStyle) => {
        switch (s.kind) {
            case 'point-continuous':
                s.intervals.push({
                    label: { fr: '', nl: '' },
                    low: 0,
                    high: 0,
                    marker: {
                        codePoint: 0xf111,
                        color: '#00729A',
                        size: 16,
                    },
                });
                return s;
            case 'line-continuous':
                s.intervals.push({
                    label: { fr: '', nl: '' },
                    low: 0,
                    high: 0,
                    strokeColor: '#00729A',
                    strokeWidth: 1,
                });
                return s;
            case 'polygon-continuous':
                s.intervals.push({
                    label: { fr: '', nl: '' },
                    low: 0,
                    high: 0,
                    strokeColor: '#00729A',
                    fillColor: '#00729A',
                    strokeWidth: 1,
                    pattern: false,
                    patternAngle: 0,
                });
                return s;
        }
    };
