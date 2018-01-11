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


import { i, a, p, l, u, MessageRecordIO, TypeOf, nullable } from './io';
import { StyleConfigIO } from './style';
import { RowConfigIO } from './row-config';
import { uuidIO } from './uuid';
import * as io from 'io-ts';


export const FeatureViewDefaultIO = i({
    type: l('default'),
}, 'FeatureViewDefaultIO');
export type FeatureViewDefault = TypeOf<typeof FeatureViewDefaultIO>;

export const FeatureViewConfigIO = i({
    type: l('config'),
    rows: a(RowConfigIO),
}, 'FeatureViewConfigIO');
export type FeatureViewConfig = TypeOf<typeof FeatureViewConfigIO>;

export const FeatureViewOptionsIO = u([
    FeatureViewDefaultIO,
    FeatureViewConfigIO,
], 'FeatureViewOptionsIO');
export type FeatureViewOptions = TypeOf<typeof FeatureViewOptionsIO>;


export const LayerGroupIO = i({
    id: io.string,
    name: MessageRecordIO,
}, 'LayerGroupIO');
export type LayerGroup = TypeOf<typeof LayerGroupIO>;

export const ILayerInfoIO = io.intersection([
    i({
        id: io.string,
        metadataId: io.string,
        visible: io.boolean,
        style: StyleConfigIO,
        featureViewOptions: FeatureViewOptionsIO,
        legend: nullable(MessageRecordIO),
        group: nullable(LayerGroupIO),
    }),
    p({
        minZoom: io.number,
        maxZoom: io.number,
    }),
], 'ILayerInfoIO');
export type ILayerInfo = TypeOf<typeof ILayerInfoIO>;




export const IMapBaseLayerIO = i({
    name: MessageRecordIO,
    srs: io.string,
    params: i({
        LAYERS: MessageRecordIO,
        VERSION: io.string,
    }),
    url: io.string,
}, 'IMapBaseLayerIO');
export type IMapBaseLayer = TypeOf<typeof IMapBaseLayerIO>;

export const MapStatusIO = u([
    l('draft'),
    l('published'),
], 'MapStatusIO');
export type MapStatus = TypeOf<typeof MapStatusIO>;

export const IMapInfoIO = io.intersection([
    i({
        title: MessageRecordIO,
        url: io.string,
        status: MapStatusIO,
        lastModified: io.number,
        description: MessageRecordIO,
        attachments: a(uuidIO),
        layers: a(ILayerInfoIO),
        // baseLayer: IMapBaseLayerIO,
        baseLayer: io.string,
        categories: a(io.string),
    }),
    p({
        id: io.string,
        imageUrl: io.string,
    }),
], 'IMapInfoIO');
export type IMapInfo = TypeOf<typeof IMapInfoIO>;
