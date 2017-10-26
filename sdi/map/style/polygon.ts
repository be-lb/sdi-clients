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
 
import { style, Feature } from 'openlayers';
import { PolygonStyleConfigSimple, PolygonStyleConfigContinuous, PolygonStyleConfigDiscrete, PolygonStyleConfig } from 'sdi/source';
import { StyleFn } from './index';

const polygonStyleSimple = (config: PolygonStyleConfigSimple) => {
    const fill = new style.Fill({
        color: config.fillColor,
    });
    const stroke = new style.Stroke({
        color: config.strokeColor,
        width: config.strokeWidth,
    });
    const styles = [new style.Style({ fill, stroke })];

    return (/* feature, resolution */) => styles;
};






type StyleReg = { [k: number]: style.Style };

const polygonStyleContinuous = (config: PolygonStyleConfigContinuous) => {
    const intervals = config.intervals;
    const styles = intervals.reduce<StyleReg>((acc, itv) => {
        // const [r, g, b] = itv.rgb;
        acc[itv.low] = new style.Style({
            fill: new style.Fill({
                color: itv.fillColor,
            }),
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
        const value = props[config.propName];
        if (typeof value === 'number') {
            const low = findLow(value);
            if (low !== null) {
                return [styles[low]];
            }
        }
        return [];
    };
};


const polygonStyleDiscrete = (config: PolygonStyleConfigDiscrete) => {
    const groups = config.groups;
    const styles = groups.reduce<style.Style[]>((acc, itv) => {
        // const [r, g, b] = itv.rgb;
        acc.push(new style.Style({
            fill: new style.Fill({
                color: itv.fillColor,
            }),
            stroke: new style.Stroke({
                color: itv.strokeColor,
                width: itv.strokeWidth,
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

    return (feature: Feature) => {
        const props = feature.getProperties();
        const value = props[config.propName];
        if (typeof value === 'string') {
            const idx = findIndex(value);
            if (idx >= 0) {
                return [styles[idx]];
            }
        }
        return [];
    };
};


const polygonStyle = (config: PolygonStyleConfig): StyleFn => {
    switch (config.kind) {
        case 'polygon-simple':
            return polygonStyleSimple(config);
        case 'polygon-continuous':
            return polygonStyleContinuous(config);
        case 'polygon-discrete':
            return polygonStyleDiscrete(config);
    }
};

export default polygonStyle;