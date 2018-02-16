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
import { DIV, SPAN, IMG } from 'sdi/components/elements';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, PointStyleConfig, PointStyleConfigDiscrete, PointStyleConfigSimple, PointStyleConfigContinuous } from 'sdi/source';

import { getDatasetMetadata } from '../../queries/metadata';

const logger = debug('sdi:legend-point');

const pointGeometry = new geom.Point([15, 15]);


const item = (geomType: string, dataUrl: string, label: string) => {
    return DIV({ className: `legend-item ${geomType}` },
        DIV({ className: 'item-style' },
            IMG({ src: dataUrl })),
        DIV({ className: 'item-label' },
            SPAN({}, label)));
};


const renderSimple = (config: PointStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, olContext } = ctx;
    const styleFn = pointStyle(config);
    const styles = styleFn(new Feature(pointGeometry));

    styles.forEach((style) => {
        olContext.setStyle(style);
        olContext.drawGeometry(pointGeometry);
    });
    const label = getDatasetMetadata(layerInfo.metadataId).fold(
        '',
        md => fromRecord(getMessageRecord(md.resourceTitle)));

    return [item('point', canvas.toDataURL(), label)];
};


const renderDiscrete = (config: PointStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = pointStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.groups.forEach((group) => {
        if (group.values.length > 0) {
            canvasContext.clearRect(0, 0, 100, 100);
            const f = new Feature(pointGeometry);
            f.set(config.propName, group.values[0]);
            const styles = styleFn(f);
            styles.forEach((style) => {
                olContext.drawFeature(f, style);
            });
            items.push(item('point', canvas.toDataURL(), fromRecord(group.label)));
        }
    });

    return items;
};

const renderContinuous = (config: PointStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = pointStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.intervals.forEach((interval) => {
        canvasContext.clearRect(0, 0, 100, 100);
        const f = new Feature(pointGeometry);
        const v = interval.low + ((interval.high - interval.low) / 2);
        f.set(config.propName, v);
        const styles = styleFn(f);
        styles.forEach((style) => {
            olContext.drawFeature(f, style);
        });
        items.push(item('point', canvas.toDataURL(), fromRecord(interval.label)));
    });

    return items;
};

const render = (config: PointStyleConfig, layerInfo: ILayerInfo) => {
    const ctx = getContext(32, 32);
    if (ctx) {
        switch (config.kind) {
            case 'point-simple': return renderSimple(config, layerInfo, ctx);
            case 'point-discrete': return renderDiscrete(config, layerInfo, ctx);
            case 'point-continuous': return renderContinuous(config, layerInfo, ctx);
        }
    }
    return [];
};


export default render;

logger('loaded');
