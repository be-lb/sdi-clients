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

import { getContext, IOLContext, polygonStyle } from '../../map/style';
import { DIV, SPAN } from '../elements';
import { fromRecord } from '../../locale';
import {
    ILayerInfo,
    getMessageRecord,
    PolygonStyleConfig,
    PolygonStyleConfigSimple,
    PolygonStyleConfigDiscrete,
    PolygonStyleConfigContinuous,
    Inspire,
} from '../../source';
import { Option } from 'fp-ts/lib/Option';


const logger = debug('sdi:legend-polygon');


const polygonGeometry = new geom.Polygon([[
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
    [0, 0],
]]);

interface Stroke {
    width: number;
    color: string;
}

type StrokeSource = {
    strokeWidth: number,
    strokeColor: string;
    pattern: boolean;
    patternColor?: string;
};

const makeStroke =
    (config: StrokeSource): (Stroke | null) => {
        if (config.strokeWidth >= 0.5) {
            if (config.pattern && config.patternColor === undefined) {
                return null;
            }
            return {
                width: config.strokeWidth,
                color: config.strokeColor,
            };
        }
        return null;
    };

const item =
    (geomType: string, dataUrl: string, label: string, stroke: Stroke | null) =>
        DIV({ className: `legend-item ${geomType}` },
            DIV({ className: 'item-style' },
                DIV({
                    style: {
                        width: '100%',
                        height: '50%',
                        backgroundImage: `url(${dataUrl})`,
                        backgroundPosition: 'center',
                        borderWidth: stroke === null ? '0' : `${stroke.width}px`,
                        borderColor: stroke === null ? 'inherit' : stroke.color,
                        borderStyle: stroke === null ? 'none' : 'solid',
                    },
                })),
            // IMG({ src: dataUrl })),
            DIV({ className: 'item-label' },
                SPAN({}, label)));


const renderSimple = (config: PolygonStyleConfigSimple, _layerInfo: ILayerInfo, md: Option<Inspire>, ctx: IOLContext) => {
    const { canvas, olContext } = ctx;
    const styles = polygonStyle(config)(new Feature(polygonGeometry));
    styles.forEach((style) => {
        olContext.setStyle(style);
        olContext.drawGeometry(polygonGeometry);
    });
    const label = md.fold('', m => fromRecord(getMessageRecord(m.resourceTitle)));

    return [item('polygon', canvas.toDataURL(), label, makeStroke(config))];
};

const renderDiscrete = (config: PolygonStyleConfigDiscrete, _layerInfo: ILayerInfo, _md: Option<Inspire>, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = polygonStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.groups.forEach((group) => {
        if (group.values.length > 0) {
            canvasContext.clearRect(0, 0, 100, 100);
            const f = new Feature(polygonGeometry);
            f.set(config.propName, group.values[0]);
            const styles = styleFn(f);
            styles.forEach((style) => {
                olContext.drawFeature(f, style);
            });
            items.push(
                item('polygon', canvas.toDataURL(),
                    fromRecord(group.label), makeStroke(group)));
        }
    });

    return items;
};

const renderContinuous = (config: PolygonStyleConfigContinuous, _layerInfo: ILayerInfo, _md: Option<Inspire>, ctx: IOLContext) => {
    const { canvas, canvasContext, olContext } = ctx;
    const styleFn = polygonStyle(config);
    const items: React.DOMElement<{}, Element>[] = [];
    config.intervals.forEach((interval) => {
        canvasContext.clearRect(0, 0, 100, 100);
        const f = new Feature(polygonGeometry);
        const v = interval.low + ((interval.high - interval.low) / 2);
        f.set(config.propName, v);
        const styles = styleFn(f);
        styles.forEach((style) => {
            olContext.drawFeature(f, style);
        });
        items.push(
            item('polygon', canvas.toDataURL(),
                fromRecord(interval.label), makeStroke(interval)));
    });

    return items;
};


const render = (config: PolygonStyleConfig, layerInfo: ILayerInfo, md: Option<Inspire>) => {
    const ctx = getContext(100, 100);
    if (ctx) {
        switch (config.kind) {
            case 'polygon-simple': return renderSimple(config, layerInfo, md, ctx);
            case 'polygon-discrete': return renderDiscrete(config, layerInfo, md, ctx);
            case 'polygon-continuous': return renderContinuous(config, layerInfo, md, ctx);
        }
    }

    return [];
};


export default render;

logger('loaded');
