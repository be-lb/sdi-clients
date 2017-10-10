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


import { i, a, p, l, u, MessageRecordIO, TypeOf } from './io';
import { StyleConfigIO } from './style';
import { RowConfigIO } from './row-config';
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


export const ILayerInfoIO = i({
    id: io.string,
    metadataId: io.string,
    visible: io.boolean,
    style: StyleConfigIO,
    featureViewOptions: FeatureViewOptionsIO,
}, 'ILayerInfoIO');
export type ILayerInfo = TypeOf<typeof ILayerInfoIO>;


export const IAttachmentIO = i({
    name: MessageRecordIO,
    url: MessageRecordIO,
}, 'IAttachmentIO');
export type IAttachment = TypeOf<typeof IAttachmentIO>;

export const IMapBaseLayerIO = i({
    name: MessageRecordIO,
    srs: io.string,
    params: i({
        LAYERS: MessageRecordIO,
        VERSION: io.string,
    }),
    url: MessageRecordIO,
}, 'IMapBaseLayerIO');
export type IMapBaseLayer = TypeOf<typeof IMapBaseLayerIO>;

export const IMapInfoIO = io.intersection([
    i({
        title: MessageRecordIO,
        url: io.string,
        lastModified: io.number,
        description: MessageRecordIO,
        attachments: a(IAttachmentIO),
        layers: a(ILayerInfoIO),
        baseLayer: IMapBaseLayerIO,
        categories: a(io.string),
    }),
    p({
        id: io.string,
        imageUrl: io.string,
    }),
], 'IMapInfoIO');
export type IMapInfo = TypeOf<typeof IMapInfoIO>;
