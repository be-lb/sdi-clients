
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

import { LineStyleConfigSimple, LineStyleConfigDiscrete, LineStyleConfig, LineStyleConfigContinuous } from '../../source';
import { style, Feature } from 'openlayers';
import { StyleFn } from './index';

const lineStyleSimple = (config: LineStyleConfigSimple) => {

    const stroke = new style.Stroke({
        color: config.strokeColor,
        width: config.strokeWidth,
        lineDash: config.dash,
    });
    const styles = [new style.Style({ stroke })];

    return (/* feature, resolution */) => styles;
};


const lineStyleDiscrete = (config: LineStyleConfigDiscrete) => {
    const groups = config.groups;
    const groupStyles = groups.reduce<style.Style[]>((acc, group) => {
        acc.push(new style.Style({
            stroke: new style.Stroke({
                color: group.strokeColor,
                width: group.strokeWidth,
                lineDash: group.dash,
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

    return (feature: Feature, _resolution: number) => {
        const styles: style.Style[] = [];

        const props = feature.getProperties();
        const value = props[config.propName];
        if (typeof value === 'string') {
            const idx = findIndex(value);
            if (idx >= 0) {
                styles.push(groupStyles[idx]);
            }
        }

        return styles;
    };
};


type StyleReg = { [k: number]: style.Style };

const lineStyleContinuous = (config: LineStyleConfigContinuous) => {
    const intervals = config.intervals;
    const styles = intervals.reduce<StyleReg>((acc, itv) => {
        acc[itv.low] = new style.Style({
            stroke: new style.Stroke({
                color: itv.strokeColor,
                width: itv.strokeWidth,
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

    return (feature: Feature) => {
        const props = feature.getProperties();
        const value = (
            typeof props[config.propName] === 'number' ?
                props[config.propName] :
                parseFloat(props[config.propName])
        );
        if (!isNaN(value)) {
            const low = findLow(value);
            if (low !== null) {
                return [styles[low]];
            }
        }
        return [];
    };
};

const lineStyle = (config: LineStyleConfig): StyleFn => {
    switch (config.kind) {
        case 'line-simple':
            return lineStyleSimple(config);
        case 'line-discrete':
            return lineStyleDiscrete(config);
        case 'line-continuous':
            return lineStyleContinuous(config);
    }
};

export default lineStyle;
