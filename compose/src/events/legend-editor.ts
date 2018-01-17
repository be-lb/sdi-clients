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
import { getLang } from 'sdi/app';
import {
    addDefaultGroupStyle,
    addDefaultIntervalStyle,
    ContinuousInterval,
    defaultStyle,
    DiscreteGroup,
    getGroup,
    getInterval,
    ILayerInfo,
    IMapInfo,
    isContinuous,
    isDiscrete,
    isLabeled,
    isLineStyle,
    isMarkered,
    isPointStyle,
    isPolygonStyle,
    isSimple,
    LineDiscreteGroup,
    LineInterval,
    MessageRecord,
    PointDiscreteGroup,
    PointLabel,
    PointMarker,
    PointStyleConfig,
    PolygonDiscreteGroup,
    PolygonInterval,
    StyleConfig,
    PatternAngle,
} from 'sdi/source';

import appQueries from '../queries/app';
import queries from '../queries/legend-editor';
import { saveStyle, syncMap } from '../util/app';


const logger = debug('sdi:events/legend-editor');

const saveMap = saveStyle(dispatch);


export const getMap = (maps: IMapInfo[] | undefined | null, mid: string | null) => {
    if (maps && mid) {
        const idx = maps.findIndex(m => m.id === mid);
        if (idx !== -1) {
            return maps[idx];
        }
    }

    return null;
};

export const getLayer = (map: IMapInfo | null, lid: string | null) => {
    if (map && lid) {
        const layer = map.layers.find(l => l.id === lid);

        if (layer) {
            return layer;
        }
    }

    return null;
};


type GroupEditFn = (g: DiscreteGroup | ContinuousInterval) => void;
// type IntervalEditFn = (g: ContinuousInterval) => void;
type StyleEditFn = <T extends StyleConfig>(g: T, l: string) => void;
type PointStyleEditFn = <T extends PointStyleConfig>(g: T, l: string) => void;


const defaultPointLabel = (): PointLabel => ({
    propName: { fr: '', nl: '' },
    align: 'center',
    baseline: 'alphabetic',
    resLimit: 3,
    color: '#000000',
    size: 12,
});


const defaultPointMarker = (): PointMarker => ({
    codePoint: 0xf111,
    color: '#000000',
    size: 10,
});

const updateGroupStyle =
    (idx: number, f: GroupEditFn) => {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/maps', (maps) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                if (layer) {
                    const style = { ...layer.style };
                    if (isDiscrete(style)) {
                        const group = getGroup(style, idx);
                        if (group) {
                            f(<DiscreteGroup>group);
                        }
                        saveMap(lid, style);
                    }
                    else if (isContinuous(style)) {
                        const interval = getInterval(style, idx);
                        if (interval) {
                            f(<ContinuousInterval>interval);
                        }
                        saveMap(lid, style);
                    }
                }
                return maps;
            });
        }
    };

// const updateIntervalStyle =
//     (idx: number, f: IntervalEditFn) => {
//         const lid = appQueries.getCurrentLayerId();
//         if (lid) {
//             dispatch('data/maps', (maps) => {
//                 const layer = getLayer(getCurrentMap(maps), lid);
//                 if (layer) {
//                     const style = { ...layer.style };
//                     if (isContinuous(style)) {
//                         const interval = getInterval(style, idx);
//                         if (interval) {
//                             f(<ContinuousInterval>interval);
//                         }
//                         saveMap(lid, style);
//                     }
//                 }
//                 return maps;
//             });
//         }
//     };



const updateStyle = (f: StyleEditFn) => {
    const lid = appQueries.getCurrentLayerId();
    if (lid) {
        dispatch('data/maps', (maps) => {
            const layer = getLayer(getCurrentMap(maps), lid);
            if (layer) {
                const style = { ...layer.style };
                if (isDiscrete(style)) {
                    f(style, lid);
                }
                else if (isContinuous(style)) {
                    f(style, lid);
                }
                else {
                    f(style, lid);
                }
                saveMap(lid, style);
            }
            return maps;
        });
    }
};

const updatePointStyleLabel = (f: PointStyleEditFn) => {
    updateStyle((s, lid) => {
        if (isPointStyle(s)) {
            if (!s.label) {
                s.label = defaultPointLabel();
            }
            f(s, lid);
        }
    });
};

const updatePointStyleMarker = (f: PointStyleEditFn) => {
    updateStyle((s, lid) => {
        if (isPointStyle(s) && isSimple(s)) {
            if (!isMarkered(s)) {
                s.marker = defaultPointMarker();
            }
            f(s, lid);
        }
    });
};

export const getCurrentMap = (maps: IMapInfo[]) => {
    return getMap(maps, appQueries.getCurrentMap());
};

export const getDiscreteStyleGroup = (layer: ILayerInfo | null, idx: number | null) => {
    if (layer && idx !== null && isDiscrete(layer.style)
        && idx < layer.style.groups.length) {
        return layer.style.groups[idx];
    }

    return null;
};

export const getContinuousStyleInterval = (layer: ILayerInfo | null, idx: number | null) => {
    if (layer && idx !== null && isContinuous(layer.style)
        && idx < layer.style.intervals.length) {
        return layer.style.intervals[idx];
    }

    return null;
};


const events = {

    setMainName(propName: string) {
        if (propName !== queries.getSelectedMainName()) {
            updateStyle((s) => {
                if (isContinuous(s) || isDiscrete(s)) {
                    s.propName = propName;
                }
            });
        }
    },


    resetLegend() {
        const lid = appQueries.getCurrentLayerId();
        const gt = queries.getGeometryType();
        if (lid && gt) {
            saveMap(lid, defaultStyle(gt));
        }
    },


    setZoomRange(lid: string, min: number | undefined, max: number | undefined) {
        const mid = appQueries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const map = maps.find(m => m.id === mid);
            if (map) {
                const info = map.layers.find(l => l.id === lid);
                if (info) {
                    info.maxZoom = max;
                    info.minZoom = min;
                    syncMap(map);
                }
            }
            return maps;
        });
    },


    moveLayerUp(lid: string) {
        const mid = appQueries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const map = maps.find(m => m.id === mid);
            if (map) {
                const currentIndex = map.layers.findIndex(l => l.id === lid);
                const info = map.layers[currentIndex];
                if (currentIndex >= 0
                    && currentIndex < (map.layers.length - 1)) {
                    map.layers[currentIndex] = map.layers[currentIndex + 1];
                    map.layers[currentIndex + 1] = info;
                    syncMap(map);
                }
            }
            return maps;
        });
    },


    moveLayerDown(lid: string) {
        const mid = appQueries.getCurrentMap();
        dispatch('data/maps', (maps) => {
            const map = maps.find(m => m.id === mid);
            if (map) {
                const currentIndex = map.layers.findIndex(l => l.id === lid);
                const info = map.layers[currentIndex];
                if (currentIndex > 0
                    && currentIndex < map.layers.length) {
                    map.layers[currentIndex] = map.layers[currentIndex - 1];
                    map.layers[currentIndex - 1] = info;
                    syncMap(map);
                }
            }
            return maps;
        });
    },

    removeLayer(info: ILayerInfo) {
        const mid = appQueries.getCurrentMap();
        const lid = info.id;
        dispatch('data/maps', (maps) => {
            const map = maps.find(m => m.id === mid);
            if (map) {
                const currentIndex = map.layers.findIndex(l => l.id === lid);
                if (currentIndex >= 0
                    && currentIndex < map.layers.length) {
                    map.layers.splice(currentIndex, 1);
                    syncMap(map);
                }
            }
            return maps;
        });
    },

    // Simple Style
    setStrokeWidth(w: number) {
        updateStyle((s) => {
            if (isSimple(s) && (isPolygonStyle(s) || isLineStyle(s))) {
                s.strokeWidth = w;
            }
        });
    },

    setStrokeColor(c: string) {
        updateStyle((s) => {
            if (isSimple(s) && (isPolygonStyle(s) || isLineStyle(s))) {
                s.strokeColor = c;
            }
        });
    },

    setFillColor(c: string) {
        updateStyle((s) => {
            if (isSimple(s) && isPolygonStyle(s)) {
                s.fillColor = c;
            }
        });
    },

    setPattern(p: boolean) {
        updateStyle((s) => {
            if (isSimple(s) && isPolygonStyle(s)) {
                s.pattern = p;
            }
        });
    },

    setPatternAngle(a: PatternAngle) {
        updateStyle((s) => {
            if (isSimple(s) && isPolygonStyle(s)) {
                s.patternAngle = a;
            }
        });
    },



    // Group Style

    setLabelForStyleGroup(idx: number, r: MessageRecord) {
        updateGroupStyle(idx, (g) => {
            g.label = r;
        });
    },

    setLabelForStyleInterval(idx: number, r: MessageRecord) {
        updateGroupStyle(idx, (i) => {
            i.label = r;
        });
    },

    setInterval(idx: number, low: number, high: number) {
        updateGroupStyle(idx, (g: ContinuousInterval) => {
            g.low = low;
            g.high = high;
        });
    },

    setStrokeWidthForGroup(idx: number, w: number) {
        updateStyle((s, lid) => {
            if ((isLineStyle(s) || isPolygonStyle(s))) {
                if (isDiscrete(s)) {
                    const group = getGroup(s, idx);
                    if (group) {
                        (<LineDiscreteGroup | PolygonDiscreteGroup>group).strokeWidth = w;
                    }
                    saveMap(lid, s);
                }
                else if (isContinuous(s)) {
                    const group = getInterval(s, idx);
                    if (group) {
                        (<PolygonInterval | LineInterval>group).strokeWidth = w;
                    }
                    saveMap(lid, s);
                }
            }
        });
    },

    setStrokeColorForGroup(idx: number, c: string) {
        logger(`setStrokeColorForGroup ${idx} ${c}`);
        updateStyle((s, lid) => {
            if ((isLineStyle(s) || isPolygonStyle(s))) {
                if (isDiscrete(s)) {
                    const group = getGroup(s, idx);
                    if (group) {
                        (<LineDiscreteGroup | PolygonDiscreteGroup>group).strokeColor = c;
                    }
                    saveMap(lid, s);
                }
                else if (isContinuous(s)) {
                    const group = getInterval(s, idx);
                    if (group) {
                        (<PolygonInterval | LineInterval>group).strokeColor = c;
                    }
                    saveMap(lid, s);
                }
            }
        });
    },

    setFillColorForGroup(idx: number, c: string) {
        logger(`setFillColorForGroup ${idx} ${c}`);
        updateStyle((s, lid) => {
            if ((isPolygonStyle(s))) {
                if (isDiscrete(s)) {
                    const group = getGroup(s, idx);
                    if (group) {
                        (<PolygonDiscreteGroup>group).fillColor = c;
                    }
                    saveMap(lid, s);
                }
                else if (isContinuous(s)) {
                    const group = getInterval(s, idx);
                    if (group) {
                        (<PolygonInterval>group).fillColor = c;
                    }
                    saveMap(lid, s);
                }
            }
        });
    },

    setPatternForGroup(idx: number, p: boolean) {
        updateStyle((s, lid) => {
            if ((isPolygonStyle(s))) {
                if (isDiscrete(s)) {
                    const group = getGroup(s, idx);
                    if (group) {
                        (<PolygonDiscreteGroup>group).pattern = p;
                    }
                    saveMap(lid, s);
                }
                else if (isContinuous(s)) {
                    const group = getInterval(s, idx);
                    if (group) {
                        (<PolygonInterval>group).pattern = p;
                    }
                    saveMap(lid, s);
                }
            }
        });
    },

    setPatternAngleForGroup(idx: number, a: PatternAngle) {
        updateStyle((s, lid) => {
            if ((isPolygonStyle(s))) {
                if (isDiscrete(s)) {
                    const group = getGroup(s, idx);
                    if (group) {
                        (<PolygonDiscreteGroup>group).patternAngle = a;
                    }
                    saveMap(lid, s);
                }
                else if (isContinuous(s)) {
                    const group = getInterval(s, idx);
                    if (group) {
                        (<PolygonInterval>group).patternAngle = a;
                    }
                    saveMap(lid, s);
                }
            }
        });
    },

    // Point 

    setPointConfig(a: 'label' | 'marker') {
        dispatch('component/legend-editor', (state) => {
            state.pointConfig = a;
            return state;
        });
    },

    setMarkerColor(c: string) {
        updatePointStyleMarker((s) => {
            if (isMarkered(s)) {
                s.marker.color = c;
            }
        });
    },

    setMarkerSize(sz: number) {
        updatePointStyleMarker((s: PointStyleConfig) => {
            if (isMarkered(s)) {
                s.marker.size = sz;
            }
        });
    },

    setMarkerCodepoint(c: number) {
        updatePointStyleMarker((s: PointStyleConfig) => {
            if (isMarkered(s)) {
                s.marker.codePoint = c;
            }
        });
    },

    setFontColor(c: string) {
        updatePointStyleLabel((s: PointStyleConfig) => {
            if (isLabeled(s)) {
                s.label.color = c;
            }
        });
    },

    setFontSize(fs: number) {
        updatePointStyleLabel((s: PointStyleConfig) => {
            if (isLabeled(s)) {
                s.label.size = fs;
            }
        });
    },

    setPropNameForLabel(pn: string) {
        updatePointStyleLabel((s: PointStyleConfig) => {
            // logger(`setPropNameForLabel ${pn} ${isLabeled(s)}`);
            if (isLabeled(s)) {
                s.label.propName[getLang()] = pn;
            }
        });
    },

    setPositionForLabel(pos: 'above' | 'under' | 'left' | 'right') {
        updatePointStyleLabel((s: PointStyleConfig) => {
            if (isLabeled(s)) {
                switch (pos) {
                    case 'above':
                        s.label.align = 'center';
                        s.label.baseline = 'bottom';
                        s.label.yOffset = s.label.size * -1;
                        break;
                    case 'under':
                        s.label.align = 'center';
                        s.label.baseline = 'top';
                        s.label.yOffset = s.label.size;
                        break;
                    case 'left':
                        s.label.align = 'end';
                        s.label.baseline = 'middle';
                        break;
                    case 'right':
                        s.label.align = 'start';
                        s.label.baseline = 'middle';
                        break;
                }
            }
        });
    },

    setOffsetXForLabel(x: number) {
        updatePointStyleLabel((s: PointStyleConfig) => {
            if (isLabeled(s)) {
                s.label.xOffset = x;
            }
        });
    },

    setOffsetYForLabel(y: number) {
        updatePointStyleLabel((s: PointStyleConfig) => {
            if (isLabeled(s)) {
                s.label.yOffset = y;
            }
        });
    },

    // Marker
    setMarkerColorForGroup(idx: number, c: string) {
        updateGroupStyle(idx, (g: PointDiscreteGroup) => g.marker.color = c);
    },

    setMarkerSizeForGroup(idx: number, sz: number) {
        updateGroupStyle(idx, (g: PointDiscreteGroup) => {
            g.marker.size = sz;
        });
    },

    setMarkerCodepointForGroup(idx: number, c: number) {
        updateGroupStyle(idx, (g: PointDiscreteGroup) => {
            g.marker.codePoint = c;
        });
    },

    addItem() {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/maps', (maps) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                if (layer) {
                    const gt = queries.getGeometryType();
                    if (gt) {
                        const style = { ...layer.style };
                        if (isDiscrete(style)) {
                            addDefaultGroupStyle(style);
                            saveMap(lid, style);
                        }
                        else if (isContinuous(style)) {
                            addDefaultIntervalStyle(style);
                            saveMap(lid, style);
                        }
                    }

                }
                return maps;
            });
        }
    },

    removeItem(k: number) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/maps', (maps: IMapInfo[]) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                if (layer) {
                    const gt = queries.getGeometryType();
                    if (gt) {
                        if (isDiscrete(layer.style)) {
                            layer.style.groups.splice(k, 1);
                            saveMap(lid, layer.style);
                        }
                        else if (isContinuous(layer.style)) {
                            layer.style.intervals.splice(k, 1);
                            saveMap(lid, layer.style);
                        }
                    }
                }

                return maps;
            });
        }
    },

    selectStyleGroup(k: number) {
        dispatch('component/legend-editor', (state) => {
            state.styleGroupSelected = k;
            return state;
        });
    },

    setStyleGroupEditedValue(v: string) {
        dispatch('component/legend-editor', (state) => {
            state.styleGroupEditedValue = v;
            return state;
        });
    },

    resetStyleGroupEditedValue() {
        dispatch('component/legend-editor', (state) => {
            state.styleGroupEditedValue = null;
            return state;
        });
    },

    removeDiscreteStyleGroupValue(k: number) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/maps', (maps: IMapInfo[]) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                const gt = queries.getGeometryType();
                if (layer && gt) {
                    const gidx = queries.getSelectedStyleGroup();
                    const group = getDiscreteStyleGroup(layer, gidx);

                    if (group) {
                        group.values.splice(k, 1);
                    }
                    saveMap(lid, layer.style);
                }
                return maps;
            });
        }
    },

    addDiscreteStyleGroupValue(value: string) {
        const lid = appQueries.getCurrentLayerId();
        if (lid) {
            dispatch('data/maps', (maps: IMapInfo[]) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                const gt = queries.getGeometryType();
                if (layer && gt && isDiscrete(layer.style)) {
                    const gidx = queries.getSelectedStyleGroup();
                    const group = getDiscreteStyleGroup(layer, gidx);

                    if (group) {
                        group.values.push(value);
                    }
                    saveMap(lid, layer.style);
                }
                return maps;
            });
        }
        dispatch('component/legend-editor', (state) => {
            state.styleGroupEditedValue = null;
            return state;
        });
    },

    selectDiscrete() {
        const lid = appQueries.getCurrentLayerId();

        if (lid) {
            const gt = queries.getGeometryType();
            if (gt) {
                saveMap(lid, defaultStyle(gt, 'discrete'));
            }
        }
    },

    selectContinuous() {
        const lid = appQueries.getCurrentLayerId();

        if (lid) {
            const gt = queries.getGeometryType();
            if (gt) {
                saveMap(lid, defaultStyle(gt, 'continuous'));
            }
        }
    },

    selectSimple(style?: StyleConfig) {
        const lid = appQueries.getCurrentLayerId();

        if (lid) {
            const gt = queries.getGeometryType();

            if (gt) {
                if (!style) {
                    style = defaultStyle(gt, 'simple');
                }

                saveMap(lid, style);
            }
        }
    },

    setAutoClassValue(n: number) {
        dispatch('component/legend-editor', (state) => {
            state.autoClassValue = Math.max(Math.min(7, n), 2);
            return state;
        });
    },

    makeContinuousClasses(pn: string) {
        const lid = appQueries.getCurrentLayerId();
        const n = queries.getAutoClassValue();
        if (lid && n > 1) {
            dispatch('data/maps', (maps) => {
                const layer = getLayer(getCurrentMap(maps), lid);
                if (layer) {
                    const { metadata } = appQueries.getCurrentLayerInfo();
                    const data = metadata ?
                        appQueries.getLayerData(metadata.uniqueResourceIdentifier) :
                        null;

                    if (data) {
                        const style = { ...layer.style };
                        if (isContinuous(style)) {
                            style.intervals = [];
                            const features = data.features;
                            const values = features.reduce<number[]>((acc, f) => {
                                if (f.properties && (pn in f.properties)) {
                                    const v: number = f.properties[pn];
                                    acc.push(v);
                                }
                                return acc;
                            }, []);
                            const max = values.reduce((acc, v) => Math.max(acc, v), Number.NEGATIVE_INFINITY);
                            const min = values.reduce((acc, v) => Math.min(acc, v), Number.POSITIVE_INFINITY);
                            const step = (max - min) / n;
                            for (let i = 0; i < n; i += 1) {
                                addDefaultIntervalStyle(style);
                                const interval = style.intervals[i];
                                interval.low = min + (i * step);
                                interval.high = interval.low + step;
                                const label = `${interval.low} - ${interval.high}`;
                                interval.label = {
                                    fr: label,
                                    nl: label,
                                };
                            }
                            saveMap(lid, style);
                        }

                    }
                }
                return maps;
            });
        }
    },
};


export default events;

logger('loaded');
