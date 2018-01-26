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

import { getContext, IOLContext, lineStyle } from 'sdi/map/style';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, LineStyleConfig, LineStyleConfigSimple, LineStyleConfigDiscrete, LineStyleConfigContinuous } from 'sdi/source';

import { getDatasetMetadata } from '../../queries/app';
import { makeImage, makeText, Box } from '../print/context';
import { Spec } from '../print/template';

const logger = debug('sdi:legend-linestring');

const lineGeometry = new geom.LineString([
    [0, 15],
    [32, 15],
]);


const item = (spec: Spec, dataUrl: string, label: string): Box => {
    return {
        x: 0, y: 0, width: 100, height: 20,
        children: [
            { x: 0, y: 0, width: 30, height: 100, children: [makeImage(dataUrl)] },
            { x: 35, y: 0, width: 60, height: 100, children: [makeText(label, spec.fontSize)] },
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
    (spec: Spec, config: LineStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, olContext } = ctx;
        const styles = lineStyle(config)(new Feature(lineGeometry));
        styles.forEach((style) => {
            olContext.setStyle(style);
            olContext.drawGeometry(lineGeometry);
        });
        const label = getDatasetMetadata(layerInfo.metadataId).fold(
            () => '',
            md => fromRecord(getMessageRecord(md.resourceTitle)));

        return item(spec, canvas.toDataURL(), label);

    };

const renderDiscrete =
    (spec: Spec, config: LineStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = lineStyle(config);
        const items: Box[] = [];
        config.groups.forEach((group) => {
            if (group.values.length > 0) {
                canvasContext.clearRect(0, 0, 100, 100);
                const f = new Feature(lineGeometry);
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
    (spec: Spec, config: LineStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
        const { canvas, canvasContext, olContext } = ctx;
        const styleFn = lineStyle(config);
        const items: Box[] = [];
        config.intervals.forEach((interval) => {
            canvasContext.clearRect(0, 0, 100, 100);
            const f = new Feature(lineGeometry);
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
    (spec: Spec, config: LineStyleConfig, layerInfo: ILayerInfo) => {
        const ctx = getContext(20, 32);
        if (ctx) {
            switch (config.kind) {
                case 'line-simple': return renderSimple(spec, config, layerInfo, ctx);
                case 'line-discrete': return renderDiscrete(spec, config, layerInfo, ctx);
                case 'line-continuous': return renderContinuous(spec, config, layerInfo, ctx);
            }
        }

        return { x: 0, y: 0, height: 0, width: 0, children: [] };
    };

export default render;

logger('loaded');
