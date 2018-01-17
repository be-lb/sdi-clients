
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

import { query } from 'sdi/shape';
import appQueries from './app';
import {
    GeometryType,
    getGroup,
    getInterval,
    getSubtype,
    isContinuous,
    isDiscrete,
    isLabeled,
    isMarkered,
    isSimple,
    LineDiscreteGroup,
    LineInterval,
    LineStyleConfig,
    PointDiscreteGroup,
    PointStyleConfig,
    PolygonDiscreteGroup,
    PolygonInterval,
    PolygonStyleConfig,
    StyleConfig,
    StyleGroupType,
} from 'sdi/source';
import { getLang } from 'sdi/app';

type ValueType = string | boolean | number;


interface GroupGetFn<T extends StyleGroupType, RT> {
    (g: T): RT;
}

interface StyleGetFn<T extends StyleConfig, RT> {
    (g: T): RT;
}

const getStyleForGroup =
    <T extends StyleGroupType, RT>(idx: number, defVal: RT, f: GroupGetFn<T, RT>) => {
        const { info } = appQueries.getCurrentLayerInfo();
        if (info) {
            const style = info.style;
            if (isDiscrete(style)) {
                const group = getGroup(style, idx);
                if (group) {
                    return f(<T>group);
                }
            }
            else if (isContinuous(style)) {
                const interval = getInterval(style, idx);
                if (interval) {
                    return f(<T>interval);
                }
            }
        }
        return defVal;
    };

const getFromStyle =
    <T extends StyleConfig, RT>(defVal: RT, f: StyleGetFn<T, RT>) => {
        const { info } = appQueries.getCurrentLayerInfo();
        if (info) {
            const style = <T>(info.style);
            return f(style);
        }
        return defVal;
    };

const queries = {


    getGeometryType(): GeometryType | null {
        const { metadata } = appQueries.getCurrentLayerInfo();
        if (metadata) {
            return metadata.geometryType;
        }
        return null;
    },

    getSelectedMainName() {
        const style = queries.getStyle();

        if (style !== null && (isDiscrete(style) || isContinuous(style))) {
            return style.propName;
        }

        return '';
    },

    getValues(column: string): ValueType[] {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            const layer = appQueries.getLayerData(lid);
            if (layer) {
                return (
                    layer.features.map((f) => {
                        const props = f.properties;
                        if (props && column in props) {
                            return props[column];
                        }
                        return null;
                    }).filter(v => v !== null)
                );
            }
        }
        return [];
    },

    getStyle() {
        const lid = appQueries.getCurrentLayerId();
        const info = appQueries.getMapInfo();
        if (info) {
            const layer = info.layers.find(l => l.id === lid);
            if (layer) {
                return layer.style;
            }
        }
        return null;
    },

    getGroup(idx: number) {
        const style = queries.getStyle();
        if (style) {
            if (isDiscrete(style)) {
                return getGroup(style, idx);
            }
            else if (isContinuous(style)) {
                return getInterval(style, idx);
            }
        }
        return null;
    },

    getStrokeWidthForGroup(idx: number, defVal = 1) {
        return getStyleForGroup(idx, defVal,
            (g: LineDiscreteGroup | PolygonDiscreteGroup | PolygonInterval | LineInterval) => g.strokeWidth);
    },

    getStrokeColorForGroup(idx: number, defVal = '#000') {
        return getStyleForGroup(idx, defVal,
            (g: LineDiscreteGroup | PolygonDiscreteGroup | PolygonInterval | LineInterval) => g.strokeColor);
    },

    getFillColorForGroup(idx: number, defVal = '#000') {
        return getStyleForGroup(idx, defVal,
            (g: PolygonDiscreteGroup | PolygonInterval) => g.fillColor);
    },

    getPatternForGroup(idx: number, defVal = false) {
        return getStyleForGroup(idx, defVal,
            (g: PolygonDiscreteGroup | PolygonInterval) => g.pattern);
    },

    getPatternAngleForGroup(idx: number, defVal = 0) {
        return getStyleForGroup(idx, defVal,
            (g: PolygonDiscreteGroup | PolygonInterval) => g.patternAngle);
    },

    // Point Globals
    getPointConfig() {
        return query('component/legend-editor').pointConfig;
    },

    getStrokeWidth(defVal = 1) {
        const f: StyleGetFn<LineStyleConfig | PolygonStyleConfig, number> =
            s => isSimple(s) ? s.strokeWidth : defVal;
        return getFromStyle(defVal, f);
    },

    getStrokeColor(defVal = '#000000') {
        return getFromStyle(defVal,
            (s: LineStyleConfig | PolygonStyleConfig) => isSimple(s) ? s.strokeColor : defVal);
    },

    getFillColor(defVal = '#000000') {
        return getFromStyle(defVal,
            (s: PolygonStyleConfig) => isSimple(s) ? s.fillColor : defVal);
    },

    getPattern() {
        return getFromStyle(false,
            (s: PolygonStyleConfig) => isSimple(s) ? s.pattern : false);
    },

    getPatternAngle() {
        return getFromStyle(0,
            (s: PolygonStyleConfig) => isSimple(s) ? s.patternAngle : 0);
    },


    getMarkerColor(defVal = '#000000') {
        return getFromStyle(defVal,
            (s: PointStyleConfig) => isMarkered(s) ? s.marker.color : defVal);
    },

    getMarkerSize(defVal = 10) {
        return getFromStyle(defVal,
            (s: PointStyleConfig) => isMarkered(s) ? s.marker.size : defVal);
    },

    getMarkerCodepoint(defVal = 0xf111) {
        return getFromStyle(defVal,
            (s: PointStyleConfig) => isMarkered(s) ? s.marker.codePoint : defVal);
    },


    getFontColor(c = '#000000') {
        return getFromStyle(c, (s: PointStyleConfig) => isLabeled(s) ? s.label.color : c);
    },

    getFontSize(sz = 12) {
        return getFromStyle(sz, (s: PointStyleConfig) => isLabeled(s) ? s.label.size : sz);
    },

    getPropNameForLabel(l = '') {
        return getFromStyle(l, (s: PointStyleConfig) => {
            if (isLabeled(s)) {
                return s.label.propName[getLang()];
            }
            return l;
        });
    },

    getPositionForLabel(pos: 'above' | 'under' | 'left' | 'right' = 'under') {
        return getFromStyle(pos, (s: PointStyleConfig) => {
            if (isLabeled(s)) {
                const { baseline, align } = s.label;
                if ('center' === align) {
                    if ('bottom' === baseline) {
                        return 'above';
                    }
                    else if ('top' === baseline) {
                        return 'under';
                    }
                }
                else if ('middle' === baseline) {
                    if ('end' === align) {
                        return 'left';
                    }
                    else if ('start' === align) {
                        return 'right';
                    }
                }
            }
            return pos;
        });
    },

    getOffsetXForLabel(x = 0) {
        return getFromStyle(x, (s: PointStyleConfig) => {
            if (isLabeled(s)) {
                return s.label.xOffset || x;
            }
            return x;
        });
    },

    getOffsetYForLabel(y = 0) {
        return getFromStyle(y, (s: PointStyleConfig) => {
            if (isLabeled(s)) {
                return s.label.yOffset || y;
            }
            return y;
        });
    },

    // Marker For Group


    getMarkerColorForGroup(idx: number, defVal = '#000000') {
        return getStyleForGroup(idx, defVal,
            (g: PointDiscreteGroup) => g.marker.color);
    },

    getMarkerSizeForGroup(idx: number, defVal = 10) {
        return getStyleForGroup(idx, defVal,
            (g: PointDiscreteGroup) => g.marker.size);
    },

    getMarkerCodepointForGroup(idx: number, defVal = 0xf111) {
        return getStyleForGroup(idx, defVal,
            (g: PointDiscreteGroup) => g.marker.codePoint);
    },


    getLegendType() {
        const style = queries.getStyle();

        if (style !== null) {
            return getSubtype(style);
        }

        return 'simple';
    },

    getSelectedStyleGroup() {
        return query('component/legend-editor').styleGroupSelected;
    },

    getStyleGroupEditedValue() {
        return query('component/legend-editor').styleGroupEditedValue;
    },

    getAutoClassValue() {
        return query('component/legend-editor').autoClassValue;
    },
};

export default queries;
