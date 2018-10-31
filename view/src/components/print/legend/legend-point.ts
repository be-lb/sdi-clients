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
import { geom, Feature } from 'openlayers';
import { fromNullable } from 'fp-ts/lib/Option';

import { pointStyle, getContext, IOLContext } from 'sdi/map/style';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, PointStyleConfig, PointStyleConfigDiscrete, PointStyleConfigSimple, PointStyleConfigContinuous } from 'sdi/source';
import { Box } from 'sdi/print/context';

import appQueries from '../../../queries/app';
import { Spec } from '../template';
import { atResolution, item, layout } from './common';

const logger = debug('sdi:legend-point');

const pointGeometry =
    (sz: number) => new geom.Point([sz / 2, sz / 2]);


const getDatasetMetadata =
    (id: string) => fromNullable(appQueries.getDatasetMetadata(id));

const renderSimple =
    (spec: Spec, config: PointStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, olContext } = ctx;
        const styleFn = pointStyle(config);
        const { height } = spec.rect;
        const styles = styleFn(new Feature(pointGeometry(atResolution(spec.resolution)(height))));

        styles.forEach((style) => {
            olContext.setStyle(style);
            olContext.drawGeometry(pointGeometry(atResolution(spec.resolution)(height)));
        });
        const label = getDatasetMetadata(layerInfo.metadataId).foldL(
            () => '',
            md => fromRecord(getMessageRecord(md.resourceTitle)));

        return item(spec, canvas.toDataURL(), label);
    };


const renderDiscrete =
    (spec: Spec, config: PointStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = pointStyle(config);
        const items: Box[] = [];
        const { height } = spec.rect;
        config.groups.forEach((group) => {
            if (group.values.length > 0) {
                canvasContext.clearRect(0, 0,
                    atResolution(spec.resolution)(height), atResolution(spec.resolution)(height));
                const f = new Feature(pointGeometry(atResolution(spec.resolution)(height)));
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
    (spec: Spec, config: PointStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = pointStyle(config);
        const items: Box[] = [];
        const { height } = spec.rect;
        config.intervals.forEach((interval) => {
            canvasContext.clearRect(0, 0,
                atResolution(spec.resolution)(height), atResolution(spec.resolution)(height));
            const f = new Feature(pointGeometry(atResolution(spec.resolution)(height)));
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
    (spec: Spec, config: PointStyleConfig, layerInfo: ILayerInfo) => {
        const { height } = spec.rect;
        const ctx = getContext(atResolution(spec.resolution)(height), atResolution(spec.resolution)(height));
        if (ctx) {
            switch (config.kind) {
                case 'point-simple': return renderSimple(spec, config, layerInfo, ctx);
                case 'point-discrete': return renderDiscrete(spec, config, layerInfo, ctx);
                case 'point-continuous': return renderContinuous(spec, config, layerInfo, ctx);
            }
        }

        return { x: 0, y: 0, height: 0, width: 0, children: [] };
    };


export default render;

logger('loaded');
