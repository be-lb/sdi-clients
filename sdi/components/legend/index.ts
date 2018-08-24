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
import { Option } from 'fp-ts/lib/Option';

import { ILayerInfo, LayerGroup, Inspire } from '../../source';
import { fromRecord } from '../../locale';
import { DIV } from '../elements';

import legendPoint from './legend-point';
import legendLinestring from './legend-linestring';
import legendPolygon from './legend-polygon';

const logger = debug('sdi:legend-item');

const withLabel =
    (layerInfo: ILayerInfo) =>
        (nodes: React.ReactNode[]) => {
            if (layerInfo.legend !== null) {
                const label = fromRecord(layerInfo.legend).trim();
                if (label.length > 0) {
                    return [
                        DIV({ className: 'legend-label' }, label),
                        ...nodes,
                    ];
                }
            }
            return nodes;
        };


export const renderLegendItem =
    (layerInfo: ILayerInfo, md: Option<Inspire>) => {
        const label = withLabel(layerInfo);
        switch (layerInfo.style.kind) {
            case 'polygon-continuous':
            case 'polygon-discrete':
            case 'polygon-simple':
                return label(legendPolygon(layerInfo.style, layerInfo, md));
            case 'point-discrete':
            case 'point-simple':
            case 'point-continuous':
                return label(legendPoint(layerInfo.style, layerInfo, md));
            case 'line-simple':
            case 'line-discrete':
            case 'line-continuous':
                return label(legendLinestring(layerInfo.style, layerInfo, md));
            default:
                throw (new Error('UnknownStyleKind'));
        }
    };



export interface Group {
    g: LayerGroup | null;
    layers: ILayerInfo[];
}

export const groupItems =
    (layers: ILayerInfo[]) =>
        layers.slice().reverse().reduce<Group[]>((acc, info) => {
            const ln = acc.length;
            if (ln === 0) {
                return [{
                    g: info.group,
                    layers: [info],
                }];
            }
            const prevGroup = acc[ln - 1];
            const cg = info.group;
            const pg = prevGroup.g;
            // Cases:
            // info.group == null && prevGroup.g == null => append
            // info.group != null && prevGroup.g != null && info.group.id == prevGroup.id => append
            if ((cg === null && pg === null)
                || (cg !== null && pg !== null && cg.id === pg.id)) {
                prevGroup.layers.push(info);
                return acc;
            }
            // info.group == null && prevGroup.g != null => new
            // info.group != null && prevGroup.g == null => new
            // info.group != null && prevGroup.g != null && info.group.id != prevGroup.id => new

            return acc.concat({
                g: cg,
                layers: [info],
            });

        }, []);


export type MetadataGetter = (id: string) => Option<Inspire>;
export const renderGroups =
    (groups: Group[], getDatasetMetadata: MetadataGetter) =>
        groups.map((group) => {
            const layers = group.layers.filter(l => l.visible === true);
            if (layers.length === 0) {
                return DIV(); // FIXME - we can do better than that
            }
            const items = layers.map(
                layer => renderLegendItem(layer, getDatasetMetadata(layer.metadataId)));
            if (group.g !== null) {
                return (
                    DIV({ className: 'legend-group named' },
                        DIV({ className: 'legend-group-title' },
                            fromRecord(group.g.name)),
                        DIV({ className: 'legend-group-items' }, items)));
            }
            return (
                DIV({ className: 'legend-group anonymous' }, items));
        });



export const legendRenderer =
    (getDatasetMetadata: MetadataGetter) =>
        (layers: ILayerInfo[]) => renderGroups(groupItems(layers), getDatasetMetadata);


logger('loaded');
