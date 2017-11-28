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

// import * as uuid from 'uuid';
import * as debug from 'debug';
import {
    Map,
    Feature,
    style as olStyle,
    interaction,
    Collection,
    layer,
    // source,
    // events,
    // extent,
    // geom,
} from 'openlayers';
// import { Feature as GeoJSONFeature } from '../source';

import {
    //  Feature as IOFeature,
    // GeometryType,
} from '../source';
import { fontSizeExtractRegexp, fontSizeReplaceRegexp } from '../style';
import {
    // formatGeoJSON,
    EditOptions,
    Interaction,
    fromInteraction,
    SelectOptions,
} from '../index';



const logger = debug('sdi:map/actions');


// const castOLTypeToGeoJSON =
//     (gt: geom.GeometryType): GeometryType => {
//         switch (gt) {
//             case 'Circle':
//             case 'LinearRing':
//             case 'GeometryCollection': throw (new Error('NotSupprotedGeometryType'));
//             default: return gt;
//         }
//     };

// const getCoordinates =
//     (g: geom.Geometry) => {
//         const gt = castOLTypeToGeoJSON(g.getType());
//         switch (gt) {
//             case 'Point': return (<geom.Point>g).getCoordinates();
//             case 'MultiPoint': return (<geom.MultiPoint>g).getCoordinates();
//             case 'LineString': return (<geom.LineString>g).getCoordinates();
//             case 'MultiLineString': return (<geom.MultiLineString>g).getCoordinates();
//             case 'Polygon': return (<geom.Polygon>g).getCoordinates();
//             case 'MultiPolygon': return (<geom.MultiPolygon>g).getCoordinates();
//         }
//     };



// const editStyle =
//     (color = '#ffcc33') => (
//         new olStyle.Style({
//             fill: new olStyle.Fill({
//                 color: 'rgba(255, 255, 255, 0.2)',
//             }),
//             stroke: new olStyle.Stroke({
//                 color,
//                 width: 2,
//             }),
//             image: new olStyle.Circle({
//                 radius: 7,
//                 fill: new olStyle.Fill({
//                     color,
//                 }),
//             }),
//         })
//     );

// type AddHandlerFn = (g: IOFeature, f: Feature) => void;
// interface EditInfra {
//     addDraw: (gt: GeometryType) => void;
//     removeDraw: () => void;
//     addModify: (f: Feature) => void;
//     removeModify: () => void;
//     setAddHandler: (h: AddHandlerFn) => void;
//     drawing: () => boolean;
//     modifying: () => boolean;
// }

// const editInfra =
//     (map: Map): EditInfra => {
//         const features = new Collection<Feature>();
//         const modFeatures = new Collection<Feature>();
//         let draw: interaction.Draw | null = null;
//         let drawing = false;
//         let modifying = false;

//         const overlay = new layer.Vector({
//             source: new source.Vector({ features }),
//             style: editStyle(),
//         });

//         const oid = uuid();
//         overlay.set('id', oid);

//         const addDraw =
//             (gt: GeometryType) => {
//                 logger('addDraw');
//                 drawing = true;
//                 draw = new interaction.Draw({
//                     features,
//                     type: gt,
//                 });
//                 draw.set('id', 'draw');
//                 if (!map.getInteractions().getArray().find(i => i.get('id') === 'draw')) {
//                     map.addInteraction(draw);
//                 }
//                 if (!map.getLayers().getArray().find(l => l.get('id') === oid)) {
//                     map.addLayer(overlay);
//                 }
//             };

//         const removeDraw =
//             () => {
//                 if (!drawing) {
//                     return;
//                 }
//                 logger('removeDraw');
//                 drawing = false;
//                 const ints = map.getInteractions();
//                 ints.getArray()
//                     .forEach((i) => {
//                         if (i.get('id') === 'draw') {
//                             ints.remove(i);
//                         }
//                     });
//                 draw = null;
//                 map.removeLayer(overlay);
//                 features.clear();
//                 if (!map.getLayers().getArray().find(l => l.get('id') === moid)) {
//                     map.addLayer(modOverlay);
//                 }
//             };

//         const modOverlay = new layer.Vector({
//             source: new source.Vector({ features: modFeatures }),
//             style: editStyle('#FF5900'),
//         });
//         const moid = uuid();
//         modOverlay.set('id', moid);

//         const modify = new interaction.Modify({
//             features: modFeatures,
//             deleteCondition: (event) => {
//                 return events.condition.shiftKeyOnly(event) &&
//                     events.condition.singleClick(event);
//             },
//         });
//         modify.set('id', 'modify');

//         const addModify =
//             (f: Feature) => {
//                 logger('addModify');
//                 modifying = true;
//                 modFeatures.clear();
//                 modFeatures.push(f);
//                 if (!map.getInteractions().getArray().find(i => i.get('id') === 'modify')) {
//                     map.addInteraction(modify);
//                 }
//                 if (!map.getLayers().getArray().find(l => l.get('id') === moid)) {
//                     map.addLayer(modOverlay);
//                 }
//             };

//         const removeModify =
//             () => {
//                 if (!modifying) {
//                     return;
//                 }
//                 logger('removeModify');
//                 modifying = false;
//                 const ints = map.getInteractions();
//                 ints.getArray()
//                     .forEach((i) => {
//                         if (i.get('id') === 'modify') {
//                             ints.remove(i);
//                         }
//                     });
//                 map.removeLayer(modOverlay);
//                 modFeatures.clear();
//             };

//         let addHandler: AddHandlerFn | null = null;
//         const onAdd = () => {
//             const f = features.pop();
//             f.setId(uuid());
//             const g: IOFeature = JSON.parse(formatGeoJSON.writeFeature(f));
//             if (addHandler) {
//                 addHandler(g, f);
//             }
//         };
//         features.on('add', onAdd);
//         const setAddHandler = (h: AddHandlerFn) => addHandler = h;

//         return {
//             addDraw,
//             removeDraw,
//             addModify,
//             removeModify,
//             setAddHandler,
//             drawing: () => drawing,
//             modifying: () => modifying,
//         };

//     };




export const edit =
    (_options: EditOptions) => {
        // FIXME : all of it
        // let infra: EditInfra | null = null;
        // let curLayerRec: string | null = null;
        // let currentFeature: string | number | null = null;
        // let mapRef: Map | null = null;


        const init =
            (_map: Map, _layers: Collection<layer.Vector>) => {
                // mapRef = map;
                // infra = editInfra(mapRef);
                // infra.setAddHandler((g, f) => {
                //     options.addFeature(g);
                //     layers.forEach((l) => {
                //         if (l.get('id') === options.getCurrentLayerId()) {
                //             (<layer.Vector>l).getSource().addFeature(f);
                //         }
                //     });
                // });
            };

        // const centerOn =
        //     (f: Feature) => {
        //         const g = f.getGeometry();
        //         const e = extent.buffer(g.getExtent(), 32);
        //         const v = mapRef.getView();
        //         v.fit(e, {
        //             size: mapRef.getSize(),
        //         });
        //     };

        const update =
            (_i: Interaction) => {
                // const mode = state.mode;
                // const selected = state.selected;
                // const lid = options.getCurrentLayerId();
                // const lyr = mapRef.getLayers().getArray().find(l => l.get('id') === lid);

                // if (mode !== 'create') {
                //     infra.removeDraw();
                // }
                // if (mode !== 'modify') {
                //     infra.removeModify();
                // }

                // // MODIFY
                // if (mode === 'modify' && selected) {
                //     if (currentFeature !== selected) {
                //         infra.removeModify();
                //         currentFeature = null;
                //     }

                //     if (!infra.modifying()) {
                //         if (lid && lyr) {
                //             currentFeature = selected;
                //             const sourceFeature = (<layer.Vector>lyr).getSource().getFeatureById(selected);
                //             if (sourceFeature) {
                //                 const cf = new Feature(
                //                     sourceFeature.clone().getGeometry());
                //                 infra.addModify(cf);
                //                 centerOn(cf);
                //                 cf.getGeometry().on('change', (a: any) => {
                //                     logger(a);
                //                     const g = cf.getGeometry();
                //                     const gt = castOLTypeToGeoJSON(g.getType());
                //                     options.setGeometry({
                //                         type: gt,
                //                         coordinates: getCoordinates(g),
                //                     });
                //                     sourceFeature.setGeometry(g);
                //                 });
                //             }
                //         }
                //     }
                // }

                // // CREATE
                // if (mode === 'create') {
                //     if (curLayerRec !== lid) {
                //         infra.removeDraw();
                //     }

                //     if (lid && lyr) {
                //         const md = options.getMetadata(lid);
                //         if (md) {
                //             infra.addDraw(md.geometryType);
                //         }
                //         curLayerRec = lid;
                //     }
                // }
            };

        return { init, update };
    };

// export const addActions =
//     (options: EditOptions, map: Map, localLayersRef: LayerRef[]) => {
//         const updateSelect = addSelection(options, map, localLayersRef);
//         const updateModify = addEdit(options, map);

//         return (
//             () => {
//                 updateSelect();
//                 updateModify();
//             });
//     };

logger('loaded');
