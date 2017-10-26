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

import * as uuid from 'uuid';
import * as debug from 'debug';
import { Map, Feature, style as olStyle, interaction, Collection, layer, source, events, extent, geom } from 'openlayers';

import { Feature as IOFeature, GeometryType } from '../source';
import { fontSizeExtractRegexp, fontSizeReplaceRegexp } from './style';
import { LayerRef, formatGeoJSON, EditOptions } from './index';


const logger = debug('sdi:ports/map-actions');


const castOLTypeToGeoJSON =
    (gt: geom.GeometryType): GeometryType => {
        switch (gt) {
            case 'Circle':
            case 'LinearRing':
            case 'GeometryCollection': throw (new Error('NotSupprotedGeometryType'));
            default: return gt;
        }
    };

const getCoordinates =
    (g: geom.Geometry) => {
        const gt = castOLTypeToGeoJSON(g.getType());
        switch (gt) {
            case 'Point': return (<geom.Point>g).getCoordinates();
            case 'MultiPoint': return (<geom.MultiPoint>g).getCoordinates();
            case 'LineString': return (<geom.LineString>g).getCoordinates();
            case 'MultiLineString': return (<geom.MultiLineString>g).getCoordinates();
            case 'Polygon': return (<geom.Polygon>g).getCoordinates();
            case 'MultiPolygon': return (<geom.MultiPolygon>g).getCoordinates();
        }
    };

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

const getSelectionStyleForPoint = (style: olStyle.Style) => {
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


const ensureArray = <T>(a: T | T[]): T[] => {
    if (Array.isArray(a)) {
        return a;
    }
    return [a];
};

const getStylesForFeature = (localLayersRef: LayerRef[], f: Feature, res: number) => {
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


    const layerRef = localLayersRef.reduce<LayerRef | null>((result, ref) => {
        if (ref.layer.getSource().getFeatureById(f.getId())) {
            return ref;
        }
        return result;
    }, null);

    if (layerRef) {
        const fn = layerRef.layer.getStyleFunction();
        if (fn) {
            return ensureArray(fn(f, res));
        }
        const fs = layerRef.layer.getStyle();
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
    (localLayersRef: LayerRef[]) =>
        (f: Feature, res: number) => {
            const geometryType = f.getGeometry().getType();
            if (geometryType === 'Point') {
                const styles = getStylesForFeature(localLayersRef, f, res);
                if (styles) {
                    return styles.map(getSelectionStyleForPoint);
                }
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


const addSelection =
    (options: EditOptions, map: Map, localLayersRef: LayerRef[]) => {
        // selection
        const selectedFeature = new Collection<Feature>();
        const select = new interaction.Select({
            style: selectionStyle(localLayersRef),
            features: selectedFeature,
        });

        select.on('select', () => {
            if (selectedFeature.getLength() > 0) {
                const f = selectedFeature.pop();
                options.editFeature(f.getId());
            }
        });

        return (
            () => {
                const mode = options.getMode();
                if (mode === 'select') {
                    map.addInteraction(select);
                }
                else {
                    selectedFeature.clear();
                    map.removeInteraction(select);
                }
            });
    };

const editStyle =
    (color = '#ffcc33') => (
        new olStyle.Style({
            fill: new olStyle.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new olStyle.Stroke({
                color,
                width: 2,
            }),
            image: new olStyle.Circle({
                radius: 7,
                fill: new olStyle.Fill({
                    color,
                }),
            }),
        })
    );

const editInfra =
    (map: Map) => {
        const features = new Collection<Feature>();
        const modFeatures = new Collection<Feature>();
        let draw: interaction.Draw | null = null;
        let drawing = false;
        let modifying = false;

        const overlay = new layer.Vector({
            source: new source.Vector({ features }),
            style: editStyle(),
        });

        const oid = uuid();
        overlay.set('id', oid);

        const addDraw =
            (gt: GeometryType) => {
                logger('addDraw');
                drawing = true;
                draw = new interaction.Draw({
                    features,
                    type: gt,
                });
                draw.set('id', 'draw');
                if (!map.getInteractions().getArray().find(i => i.get('id') === 'draw')) {
                    map.addInteraction(draw);
                }
                if (!map.getLayers().getArray().find(l => l.get('id') === oid)) {
                    map.addLayer(overlay);
                }
            };

        const removeDraw =
            () => {
                if (!drawing) {
                    return;
                }
                logger('removeDraw');
                drawing = false;
                const ints = map.getInteractions();
                ints.getArray()
                    .forEach((i) => {
                        if (i.get('id') === 'draw') {
                            ints.remove(i);
                        }
                    });
                draw = null;
                map.removeLayer(overlay);
                features.clear();
                if (!map.getLayers().getArray().find(l => l.get('id') === moid)) {
                    map.addLayer(modOverlay);
                }
            };

        const modOverlay = new layer.Vector({
            source: new source.Vector({ features: modFeatures }),
            style: editStyle('#FF5900'),
        });
        const moid = uuid();
        modOverlay.set('id', moid);

        const modify = new interaction.Modify({
            features: modFeatures,
            deleteCondition: (event) => {
                return events.condition.shiftKeyOnly(event) &&
                    events.condition.singleClick(event);
            },
        });
        modify.set('id', 'modify');

        const addModify =
            (f: Feature) => {
                logger('addModify');
                modifying = true;
                modFeatures.clear();
                modFeatures.push(f);
                if (!map.getInteractions().getArray().find(i => i.get('id') === 'modify')) {
                    map.addInteraction(modify);
                }
                if (!map.getLayers().getArray().find(l => l.get('id') === moid)) {
                    map.addLayer(modOverlay);
                }
            };

        const removeModify =
            () => {
                if (!modifying) {
                    return;
                }
                logger('removeModify');
                modifying = false;
                const ints = map.getInteractions();
                ints.getArray()
                    .forEach((i) => {
                        if (i.get('id') === 'modify') {
                            ints.remove(i);
                        }
                    });
                map.removeLayer(modOverlay);
                modFeatures.clear();
            };

        type AddHandlerFn = (g: IOFeature, f: Feature) => void;
        let addHandler: AddHandlerFn | null = null;
        const onAdd = () => {
            const f = features.pop();
            f.setId(uuid());
            const g: IOFeature = JSON.parse(formatGeoJSON.writeFeature(f));
            if (addHandler) {
                addHandler(g, f);
            }
        };
        features.on('add', onAdd);
        const setAddHandler = (h: AddHandlerFn) => addHandler = h;

        return {
            addDraw, removeDraw, addModify, removeModify, setAddHandler,
            drawing: () => drawing,
            modifying: () => modifying,
        };

    };




const addEdit =
    (options: EditOptions, map: Map) => {
        const infra = editInfra(map);
        let curLayerRec: string | null = null;
        let currentFeature: string | number | null = null;

        infra.setAddHandler((g, f) => {
            options.addFeature(g);
            map.getLayers().forEach((l) => {
                if (l.get('id') === options.getCurrentLayerId()) {
                    (<layer.Vector>l).getSource().addFeature(f);
                }
            });
        });

        const centerOn =
            (f: Feature) => {
                const g = f.getGeometry();
                const e = extent.buffer(g.getExtent(), 32);
                const v = map.getView();
                v.fit(e, {
                    size: map.getSize(),
                });
            };

        const update = () => {
            const mode = options.getMode();
            const selected = options.getSelected();
            const lid = options.getCurrentLayerId();
            const lyr = map.getLayers().getArray().find(l => l.get('id') === lid);

            if (mode !== 'create') {
                infra.removeDraw();
            }
            if (mode !== 'modify') {
                infra.removeModify();
            }

            // MODIFY
            if (mode === 'modify' && selected) {
                if (currentFeature !== selected) {
                    infra.removeModify();
                    currentFeature = null;
                }

                if (!infra.modifying()) {
                    if (lid && lyr) {
                        currentFeature = selected;
                        const sourceFeature = (<layer.Vector>lyr).getSource().getFeatureById(selected);
                        if (sourceFeature) {
                            const cf = new Feature(
                                sourceFeature.clone().getGeometry());
                            infra.addModify(cf);
                            centerOn(cf);
                            cf.getGeometry().on('change', (a: any) => {
                                logger(a);
                                const g = cf.getGeometry();
                                const gt = castOLTypeToGeoJSON(g.getType());
                                options.setGeometry({
                                    type: gt,
                                    coordinates: getCoordinates(g),
                                });
                                sourceFeature.setGeometry(g);
                            });
                        }
                    }
                }
            }

            // CREATE
            if (mode === 'create') {
                if (curLayerRec !== lid) {
                    infra.removeDraw();
                }

                if (lid && lyr) {
                    const md = options.getMetadata(lid);
                    if (md) {
                        infra.addDraw(md.geometryType);
                    }
                    curLayerRec = lid;
                }
            }
        };

        return update;
    };

export const addActions =
    (options: EditOptions, map: Map, localLayersRef: LayerRef[]) => {
        const updateSelect = addSelection(options, map, localLayersRef);
        const updateModify = addEdit(options, map);

        return (
            () => {
                updateSelect();
                updateModify();
            });
    };

logger('loaded');
