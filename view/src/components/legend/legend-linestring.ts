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
import { DIV, SPAN, IMG } from 'sdi/components/elements';
import { fromRecord } from 'sdi/locale';
import { ILayerInfo, getMessageRecord, LineStyleConfig, LineStyleConfigSimple, LineStyleConfigDiscrete, LineStyleConfigContinuous } from 'sdi/source';

import appQueries from '../../queries/app';

const logger = debug('sdi:legend-linestring');

const lineGeometry = new geom.LineString([
    [0, 15],
    [32, 15],
]);


const item = (geomType: string, dataUrl: string, label: string) => {
    return DIV({ className: `legend-item ${geomType}` },
        DIV({ className: 'item-style' },
            IMG({ src: dataUrl })),
        DIV({ className: 'item-label' },
            SPAN({}, label)));
};


const renderSimple = (config: LineStyleConfigSimple, layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, olContext } = ctx;
    const styles = lineStyle(config)(new Feature(lineGeometry));
    styles.forEach((style) => {
        olContext.setStyle(style);
        olContext.drawGeometry(lineGeometry);
    });
    const md = appQueries.getDatasetMetadata(layerInfo.metadataId);
    const label = md === null ? '' : fromRecord(getMessageRecord(md.resourceTitle));

    return [item('line', canvas.toDataURL(), label)];

};

const renderDiscrete = (config: LineStyleConfigDiscrete, _layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = lineStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.groups.forEach((group) => {
        if (group.values.length > 0) {
            canvasContext.clearRect(0, 0, 100, 100);
            const f = new Feature(lineGeometry);
            f.set(config.propName, group.values[0]);
            const styles = styleFn(f);
            styles.forEach((style) => {
                olContext.drawFeature(f, style);
            });
            items.push(item('line', canvas.toDataURL(), fromRecord(group.label)));
        }
    });

    return items;

};

const renderContinuous = (config: LineStyleConfigContinuous, _layerInfo: ILayerInfo, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = lineStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.intervals.forEach((interval) => {
        canvasContext.clearRect(0, 0, 100, 100);
        const f = new Feature(lineGeometry);
        const v = interval.low + ((interval.high - interval.low) / 2);
        f.set(config.propName, v);
        const styles = styleFn(f);
        styles.forEach((style) => {
            olContext.drawFeature(f, style);
        });
        items.push(item('line', canvas.toDataURL(), fromRecord(interval.label)));
    });

    return items;
};

const render = (config: LineStyleConfig, layerInfo: ILayerInfo) => {
    const ctx = getContext(20, 32);
    if (ctx) {
        switch (config.kind) {
            case 'line-simple': return renderSimple(config, layerInfo, ctx);
            case 'line-discrete': return renderDiscrete(config, layerInfo, ctx);
            case 'line-continuous': return renderContinuous(config, layerInfo, ctx);
        }
    }

    return [];
};

export default render;

logger('loaded');
