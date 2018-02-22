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
import { Feature, geom } from 'openlayers';

import { getContext, IOLContext, polygonStyle } from 'sdi/map/style';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, PolygonStyleConfig, PolygonStyleConfigSimple, PolygonStyleConfigDiscrete, PolygonStyleConfigContinuous } from 'sdi/source';

import { getDatasetMetadata } from '../../queries/app';
import { Box } from '../print/context';
import { Spec } from '../print/template';
import { layout, item, atResolution } from './common';

const logger = debug('sdi:legend-polygon');


const polygonGeometry =
    (sz: number) => {
        return (
            new geom.Polygon([[
                [0, sz * 0.2],
                [sz, sz * 0.2],
                [sz, sz * 0.8],
                [0, sz * 0.8],
                [0, sz * 0.2],
            ]]));
    };

const renderSimple =
    (spec: Spec, config: PolygonStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, olContext } = ctx;
        const styles = polygonStyle(config)(new Feature(polygonGeometry(atResolution(spec.rect.height))));
        styles.forEach((style) => {
            olContext.setStyle(style);
            olContext.drawGeometry(polygonGeometry(atResolution(spec.rect.height)));
        });

        const label = getDatasetMetadata(layerInfo.metadataId).foldL(
            () => '',
            md => fromRecord(getMessageRecord(md.resourceTitle)));

        return item(spec, canvas.toDataURL(), label);
    };

const renderDiscrete =
    (spec: Spec, config: PolygonStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const { rect } = spec;
        const styleFn = polygonStyle(config);
        const items: Box[] = [];
        config.groups.forEach((group) => {
            if (group.values.length > 0) {
                canvasContext.clearRect(0, 0,
                    atResolution(rect.height), atResolution(rect.height));
                const f = new Feature(polygonGeometry(atResolution(rect.height)));
                f.set(config.propName, group.values[0]);
                const styles = styleFn(f);
                styles.forEach((style) => {
                    olContext.drawFeature(f, style);
                });

                items.push(item(spec, canvas.toDataURL(), fromRecord(group.label)));

            }
        });

        return layout('vertical', items);
    };

const renderContinuous =
    (spec: Spec, config: PolygonStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const { rect } = spec;
        const styleFn = polygonStyle(config);
        const items: Box[] = [];
        config.intervals.forEach((interval) => {
            canvasContext.clearRect(0, 0,
                atResolution(rect.height), atResolution(rect.height));
            const f = new Feature(polygonGeometry(atResolution(rect.height)));
            const v = interval.low + ((interval.high - interval.low) / 2);
            f.set(config.propName, v);
            const styles = styleFn(f);
            styles.forEach((style) => {
                olContext.drawFeature(f, style);
            });

            items.push(item(spec, canvas.toDataURL(), fromRecord(interval.label)));

        });

        return layout('vertical', items);
    };


const render =
    (spec: Spec, config: PolygonStyleConfig, layerInfo: ILayerInfo): Box => {
        const { height } = spec.rect;
        const ctx = getContext(atResolution(height), atResolution(height));
        if (ctx) {
            switch (config.kind) {
                case 'polygon-simple': return renderSimple(spec, config, layerInfo, ctx);
                case 'polygon-discrete': return renderDiscrete(spec, config, layerInfo, ctx);
                case 'polygon-continuous': return renderContinuous(spec, config, layerInfo, ctx);
            }
        }

        return { x: 0, y: 0, height: 0, width: 0, children: [] };
    };


export default render;

logger('loaded');
