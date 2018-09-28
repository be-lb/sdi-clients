// tslint:disable:variable-name
import * as iots from 'io-ts';
import { IMapBaseLayerIO } from 'sdi/source';
import { MessageRecordIO } from 'sdi/source/io/io';

export const i = iots.interface;
export const u = iots.union;
export const l = iots.literal;
export const a = iots.array;
export const t = iots.tuple;
export const p = iots.partial;

export const CapakeyIO = i({
    capakey: iots.string,
});

export type Capakey = iots.TypeOf<typeof CapakeyIO>;

export const BaseLayerCollectionIO = iots.dictionary(iots.string, IMapBaseLayerIO, 'BaseLayerCollection');
export type BaseLayerCollection = iots.TypeOf<typeof BaseLayerCollectionIO>;


export const WidgetDescriptionIO = iots.dictionary(iots.string, MessageRecordIO, 'WidgetDescriptionIO')

