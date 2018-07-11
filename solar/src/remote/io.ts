// tslint:disable:variable-name
import * as iots from 'io-ts';

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

