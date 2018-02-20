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

import { PointStyleConfigSimple, PointStyleConfigDiscrete, PointStyleConfig, PointStyleConfigContinuous, MessageRecord } from '../../source';
import { style, Feature } from 'openlayers';
import { StyleFn, labelFont, markerFont } from './index';
import { fromRecord } from '../../locale';

const backgroundFill = new style.Fill({
    color: 'rgba(255,255,255,0.1)',
});

const pointStyleSimple = (config: PointStyleConfigSimple) => {
    let labelStyle: style.Text;
    let markerStyle: style.Text;
    let propName: MessageRecord;
    let resLimit: number;

    if (config.label) {
        const label = config.label;
        propName = label.propName;
        resLimit = label.resLimit;
        labelStyle = new style.Text({
            font: labelFont(label.size),
            textAlign: label.align,
            textBaseline: label.baseline,
            offsetX: label.xOffset,
            offsetY: label.yOffset,
            fill: new style.Fill({
                color: label.color,
            }),
            stroke: new style.Stroke({
                width: 1,
                color: 'white',
            }),
        });
    }

    if (config.marker) {
        const marker = config.marker;
        markerStyle = new style.Text({
            font: markerFont(marker.size),
            text: String.fromCodePoint(marker.codePoint),
            fill: new style.Fill({
                color: marker.color,
            }),
            backgroundFill,
        });
    }

    return (feature: Feature, resolution: number) => {
        const styles: style.Style[] = [];
        if (markerStyle) {
            styles.push(new style.Style({ text: markerStyle }));
        }
        if (resLimit && (resolution < resLimit) && labelStyle && propName) {
            const props = feature.getProperties();
            const baseText: string = props[fromRecord(propName)];
            if (baseText) {
                const text = baseText.split(' ').reduce((acc, w, idx) => {
                    if ((idx % 2) > 0) {
                        return `${acc} ${w}`;
                    }
                    return `${acc}\n${w}`;
                }, '');
                labelStyle.setText(text);
                styles.push(new style.Style({ text: labelStyle }));
            }
        }
        return styles;
    };
};


const getLabelStyleFn =
    (config: PointStyleConfigDiscrete | PointStyleConfigContinuous) => {
        let labelStyle: style.Text;
        let propName: MessageRecord;
        let resLimit: number;

        if (config.label) {
            const label = config.label;
            propName = label.propName;
            resLimit = label.resLimit;
            labelStyle = new style.Text({
                font: labelFont(label.size),
                textAlign: label.align,
                textBaseline: label.baseline,
                offsetX: label.xOffset,
                offsetY: label.yOffset,
                fill: new style.Fill({
                    color: label.color,
                }),
                stroke: new style.Stroke({
                    width: 1,
                    color: 'white',
                }),
            });
        }

        return (
            (feature: Feature, resolution: number, styles: style.Style[]) => {
                if (resLimit && (resolution < resLimit) && labelStyle && propName) {
                    const props = feature.getProperties();
                    const baseText: string = props[fromRecord(propName)];
                    if (baseText) {
                        const text = baseText.split(' ').reduce((acc, w, idx) => {
                            if ((idx % 2) > 0) {
                                return `${acc} ${w}`;
                            }
                            return `${acc}\n${w}`;
                        }, '');
                        labelStyle.setText(text);
                        styles.push(new style.Style({ text: labelStyle }));
                    }
                }
            });

    };


const pointStyleDiscrete = (config: PointStyleConfigDiscrete) => {
    const labelStyle = getLabelStyleFn(config);
    const groups = config.groups;
    const groupStyles = groups.reduce<style.Style[]>((acc, group) => {
        const { marker } = group;
        acc.push(new style.Style({
            text: new style.Text({
                font: markerFont(marker.size),
                text: String.fromCodePoint(marker.codePoint),
                fill: new style.Fill({
                    color: marker.color,
                }),
                backgroundFill,
            }),
        }));
        return acc;
    }, []);

    const findIndex = (v: string) => {
        for (let i = 0; i < groups.length; i += 1) {
            const group = groups[i];
            const idx = group.values.indexOf(v);
            if (idx >= 0) {
                return i;
            }
        }
        return -1;
    };

    return (feature: Feature, resolution: number) => {
        const styles: style.Style[] = [];
        const props = feature.getProperties();
        const value = props[config.propName];

        labelStyle(feature, resolution, styles);

        if (value !== null) {
            const idx = findIndex(value.toString());
            if (idx >= 0) {
                styles.push(groupStyles[idx]);
            }
        }

        return styles;
    };
};

type StyleReg = { [k: number]: style.Style };

const pointStyleContinuous = (config: PointStyleConfigContinuous) => {
    const labelStyle = getLabelStyleFn(config);
    const intervals = config.intervals;
    const intervalStyles = intervals.reduce<StyleReg>((acc, itv) => {
        const { marker } = itv;
        acc[itv.low] = new style.Style({
            text: new style.Text({
                font: markerFont(marker.size),
                text: String.fromCodePoint(marker.codePoint),
                fill: new style.Fill({
                    color: marker.color,
                }),
                backgroundFill,
            }),
        });
        return acc;
    }, {});

    const findLow = (n: number) => {
        for (let i = 0; i < intervals.length; i += 1) {
            if (n >= intervals[i].low
                && n < intervals[i].high) {
                return intervals[i].low;
            }
        }
        return null;
    };

    return (feature: Feature, resolution: number) => {
        const styles: style.Style[] = [];
        const props = feature.getProperties();
        const value = (
            typeof props[config.propName] === 'number' ?
                props[config.propName] :
                parseFloat(props[config.propName])
        );

        labelStyle(feature, resolution, styles);

        if (!isNaN(value)) {
            const low = findLow(value);
            if (low !== null) {
                styles.push(intervalStyles[low]);
            }
        }
        return styles;
    };
};

const pointStyle = (config: PointStyleConfig): StyleFn => {
    switch (config.kind) {
        case 'point-simple':
            return pointStyleSimple(config);
        case 'point-continuous':
            return pointStyleContinuous(config);
        case 'point-discrete':
            return pointStyleDiscrete(config);
    }
};

export default pointStyle;
