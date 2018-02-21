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
import {
    Map,
    Feature,
    // style as olStyle,
    interaction,
    Collection,
    layer,
    events,
} from 'openlayers';

import {
} from '../source';
// import { fontSizeExtractRegexp, fontSizeReplaceRegexp } from '../style';
import {
    Interaction,
    fromInteraction,
    SelectOptions,
} from '../index';



const logger = debug('sdi:map/select');


// const fontSizeIncrement = (s: string) => {
//     const result = fontSizeExtractRegexp.exec(s);
//     if (!result) {
//         return s;
//     }
//     if (result.length !== 2) {
//         return s;
//     }
//     const ret = parseFloat(result[1]) * 1.3;
//     if (isNaN(ret)) {
//         return s;
//     }
//     return s.replace(fontSizeReplaceRegexp,
//         (_m: string, p1: string, p2: string) => (
//             `${p1} ${ret.toFixed(1)}px ${p2}`
//         ));
// };

// const getSelectionStyleForPoint = (style: olStyle.Style) => {
//     const text = style.getText();
//     if (text && text.getText()) {
//         return (new olStyle.Style({
//             text: new olStyle.Text({
//                 font: fontSizeIncrement(text.getFont()),
//                 text: text.getText(),
//                 textAlign: text.getTextAlign(),
//                 textBaseline: text.getTextBaseline(),
//                 offsetX: text.getOffsetX(),
//                 offsetY: text.getOffsetY(),
//                 fill: new olStyle.Fill({
//                     color: '#3FB2FF',
//                 }),
//                 stroke: new olStyle.Stroke({
//                     width: 2,
//                     color: 'white',
//                 }),
//             }),
//         }));
//     }
//     return (new olStyle.Style());
// };


// const ensureArray = <T>(a: T | T[]): T[] => {
//     if (Array.isArray(a)) {
//         return a;
//     }
//     return [a];
// };

// const getStylesForFeature = (layers: Collection<layer.Vector>, f: Feature, res: number) => {
//     const fn = f.getStyleFunction();
//     if (fn) {
//         return ensureArray<olStyle.Style>(fn.call(f, res));
//     }
//     const fs = f.getStyle();
//     if (fs) {
//         if (typeof fs === 'function') {
//             return ensureArray<olStyle.Style>(fs.call(f, res));
//         }
//         return ensureArray(fs);
//     }


//     const layerRef = layers
//         .getArray()
//         .reduce<layer.Vector | null>((result, layer) => {
//             if (layer.getSource().getFeatureById(f.getId())) {
//                 return layer;
//             }
//             return result;
//         }, null);

//     if (layerRef) {
//         const fn = layerRef.getStyleFunction();
//         if (fn) {
//             return ensureArray(fn(f, res));
//         }
//         const fs = layerRef.getStyle();
//         if (fs) {
//             if (typeof fs === 'function') {
//                 return ensureArray(fs(f, res));
//             }
//             return ensureArray(fs);
//         }
//     }
//     return null;
// };

// const selectionStyle =
//     (layers: Collection<layer.Vector>) =>
//         (f: Feature, res: number) => {
//             const geometryType = f.getGeometry().getType();
//             if (geometryType === 'Point') {
//                 const styles = getStylesForFeature(layers, f, res);
//                 if (styles) {
//                     return styles.map(getSelectionStyleForPoint);
//                 }
//             }
//             else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
//                 return [
//                     new olStyle.Style({
//                         stroke: new olStyle.Stroke({
//                             width: 4,
//                             color: 'white',
//                         }),
//                     }),
//                     new olStyle.Style({
//                         stroke: new olStyle.Stroke({
//                             width: 2,
//                             color: '#3FB2FF',
//                         }),
//                     }),
//                 ];
//             }

//             return [new olStyle.Style({
//                 fill: new olStyle.Fill({
//                     color: '#3FB2FF',
//                 }),
//                 stroke: new olStyle.Stroke({
//                     width: 2,
//                     color: 'white',
//                 }),
//             })];
//         };

export const select =
    (options: SelectOptions, _layers: Collection<layer.Vector>) => {
        // selection
        const selectedFeature = new Collection<Feature>();
        const selectInteraction = new interaction.Select({
            style: [],
            features: selectedFeature,
            condition: events.condition.click,
            multi: false,
        });

        selectInteraction.on('change:active',
            () => logger(`select active ${selectInteraction.getActive()}`));

        selectInteraction.on('select', () => {
            logger('selectInteraction.on select')
            if (selectedFeature.getLength() > 0) {
                const f = selectedFeature.item(0);
                const lid = f.get('lid') as string;
                // const j: GeoJSONFeature = formatGeoJSON.writeFeatureObject(f) as any;
                options.selectFeature(lid, f.getId());
                selectedFeature.clear();
                selectedFeature.push(f);
            }
            else {
                options.clearSelection();
            }
        });

        const init =
            (map: Map) => {
                map.addInteraction(selectInteraction);
                map.on('click', () => logger('on click'));
            };

        const update =
            (state: Interaction) =>
                fromInteraction('select', state)
                    .foldL(
                        () => selectInteraction.setActive(false),
                        () => selectInteraction.setActive(true));


        return { init, update };
    };




logger('loaded');
