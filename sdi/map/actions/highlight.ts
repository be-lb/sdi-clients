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

import {
    Feature,
    style as olStyle,
    Collection,
    layer,
    source,
} from 'openlayers';

import { fontSizeExtractRegexp, fontSizeReplaceRegexp } from '../style';
import { FeaturePathGetter, FeaturePath } from '../index';
import { fromNullable, none } from 'fp-ts/lib/Option';
import { scopeOption } from '../../lib/scope';



const fontSizeIncrement = (s: string) => {
    const result = fontSizeExtractRegexp.exec(s);
    if (!result) {
        return s;
    }
    if (result.length !== 2) {
        return s;
    }
    const ret = parseFloat(result[1]) * 1.3;
    if (isNaN(ret)) {
        return s;
    }
    return s.replace(fontSizeReplaceRegexp,
        (_m: string, p1: string, p2: string) => (
            `${p1} ${ret.toFixed(1)}px ${p2}`
        ));
};

export const getSelectionStyleForPoint = (style: olStyle.Style) => {
    const text = style.getText();
    if (text && text.getText()) {
        return (new olStyle.Style({
            text: new olStyle.Text({
                font: fontSizeIncrement(text.getFont()),
                text: text.getText(),
                textAlign: text.getTextAlign(),
                textBaseline: text.getTextBaseline(),
                offsetX: text.getOffsetX(),
                offsetY: text.getOffsetY(),
                fill: new olStyle.Fill({
                    color: '#3FB2FF',
                }),
                stroke: new olStyle.Stroke({
                    width: 2,
                    color: 'white',
                }),
            }),
        }));
    }
    return (new olStyle.Style());
};


const ensureArray =
    <T>(a: T | T[]): T[] => {
        if (Array.isArray(a)) {
            return a;
        }
        return [a];
    };

export const getStylesForFeature =
    (layerRef: layer.Vector, f: Feature, res: number) => {
        const fn = f.getStyleFunction();
        if (fn) {
            return ensureArray<olStyle.Style>(fn.call(f, res));
        }
        const fs = f.getStyle();
        if (fs) {
            if (typeof fs === 'function') {
                return ensureArray<olStyle.Style>(fs.call(f, res));
            }
            return ensureArray(fs);
        }

        if (layerRef) {
            const fn = layerRef.getStyleFunction();
            if (fn) {
                return ensureArray(fn(f, res));
            }
            const fs = layerRef.getStyle();
            if (fs) {
                if (typeof fs === 'function') {
                    return ensureArray(fs(f, res));
                }
                return ensureArray(fs);
            }
        }
        return null;
    };


const selectionStyle =
    (_layer: layer.Vector) =>
        (f: Feature, _res: number) => {
            const geometryType = f.getGeometry().getType();
            if (geometryType === 'Point') {
                // const styles = getStylesForFeature(layer, f, res);
                // if (styles) {
                //     return styles.map(getSelectionStyleForPoint);
                // }
                return [
                    new olStyle.Style({
                        image: new olStyle.Circle({
                            radius: 12,
                            fill: new olStyle.Fill({
                                color: '#3FB2FF',
                            }),
                            stroke: new olStyle.Stroke({
                                width: 2,
                                color: 'white',
                            }),
                        })
                    })
                ]
            }
            else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
                return [
                    new olStyle.Style({
                        stroke: new olStyle.Stroke({
                            width: 4,
                            color: 'white',
                        }),
                    }),
                    new olStyle.Style({
                        stroke: new olStyle.Stroke({
                            width: 2,
                            color: '#3FB2FF',
                        }),
                    }),
                ];
            }

            return [new olStyle.Style({
                fill: new olStyle.Fill({
                    color: '#3FB2FF',
                }),
                stroke: new olStyle.Stroke({
                    width: 2,
                    color: 'white',
                }),
            })];
        };





const getFeature =
    (refLayers: Collection<layer.Vector> | null, fp: FeaturePath) => {
        const { featureId, layerId } = fp;
        if (refLayers && featureId !== null && layerId !== null) {
            return scopeOption()
                .let('layer', fromNullable(
                    refLayers
                        .getArray()
                        .find(l => l.get('id') === layerId)))
                .let('feature', ({ layer }) => fromNullable(
                    layer.getSource().getFeatureById(featureId)));
        }
        return none;
    };



export const highlight =
    (fpg: FeaturePathGetter) => {
        let refLayers: Collection<layer.Vector> | null = null;
        const hlSource = new source.Vector();
        const hlLayer = new layer.Vector({
            source: hlSource,
        });

        const update =
            () => getFeature(refLayers, fpg()).fold(
                hlSource.clear(),
                ({ layer, feature }) => {
                    const fc = feature.clone();
                    fc.setStyle(selectionStyle(layer));
                    hlSource.clear();
                    hlSource.addFeature(fc);
                });

        const init =
            (layers: Collection<layer.Vector>, tools: Collection<layer.Vector>) => {
                tools.push(hlLayer);
                refLayers = layers;
            };

        return { init, update };
    };
