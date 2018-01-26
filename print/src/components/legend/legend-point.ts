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

import { pointStyle, getContext, IOLContext } from 'sdi/map/style';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, PointStyleConfig, PointStyleConfigDiscrete, PointStyleConfigSimple, PointStyleConfigContinuous } from 'sdi/source';

import { getDatasetMetadata } from '../../queries/app';
import { Box, makeImage, makeText } from '../print/context';
import { Spec } from '../print/template';

const logger = debug('sdi:legend-point');

const pointGeometry = new geom.Point([15, 15]);
const ctWidth = 320;
const ctHeight = 320;



const item = (spec: Spec, dataUrl: string, label: string): Box => {
    return {
        x: 0, y: 0, width: 100, height: 20,
        children: [
            { x: 0, y: 0, width: 30, height: 10, children: [makeImage(dataUrl)] },
            { x: 35, y: 0, width: 60, height: 10, children: [makeText(label, spec.fontSize)] },
        ],
    };
};


const layout =
    (_spec: Spec, items: Box[]): Box => {
        const height = items.reduce<number>((acc, b) => acc + b.height, 0);
        const width = items.reduce<number>((acc, b) => Math.max(acc, b.width), 0);
        if (items.length === 0) {
            return { x: 0, y: 0, height, width, children: [] };
        }
        return {
            x: 0, y: 0, height, width,
            children: [{
                direction: 'vertical',
                items,
            }],
        };
    };


const renderSimple =
    (spec: Spec, config: PointStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, olContext } = ctx;
        const styleFn = pointStyle(config);
        const styles = styleFn(new Feature(pointGeometry));

        styles.forEach((style) => {
            olContext.setStyle(style);
            olContext.drawGeometry(pointGeometry);
        });
        const label = getDatasetMetadata(layerInfo.metadataId).fold(
            () => '',
            md => fromRecord(getMessageRecord(md.resourceTitle)));

        return item(spec, canvas.toDataURL(), label);
    };


const renderDiscrete =
    (spec: Spec, config: PointStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = pointStyle(config);
        const items: Box[] = [];
        config.groups.forEach((group) => {
            if (group.values.length > 0) {
                canvasContext.clearRect(0, 0, ctWidth, ctHeight);
                const f = new Feature(pointGeometry);
                f.set(config.propName, group.values[0]);
                const styles = styleFn(f);
                styles.forEach((style) => {
                    olContext.drawFeature(f, style);
                });
                items.push(item(spec, canvas.toDataURL(), fromRecord(group.label)));
            }
        });

        return layout(spec, items);
    };

const renderContinuous =
    (spec: Spec, config: PointStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = pointStyle(config);
        const items: Box[] = [];
        config.intervals.forEach((interval) => {
            canvasContext.clearRect(0, 0, ctWidth, ctHeight);
            const f = new Feature(pointGeometry);
            const v = interval.low + ((interval.high - interval.low) / 2);
            f.set(config.propName, v);
            const styles = styleFn(f);
            styles.forEach((style) => {
                olContext.drawFeature(f, style);
            });
            items.push(item(spec, canvas.toDataURL(), fromRecord(interval.label)));
        });

        return layout(spec, items);
    };

const render =
    (spec: Spec, config: PointStyleConfig, layerInfo: ILayerInfo) => {
        const ctx = getContext(ctWidth, ctHeight);
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
