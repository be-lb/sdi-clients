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
 
import { i, u, l, a, TypeOf, p } from './io';
import * as io from 'io-ts';

export const PropTypeIO = u([
    l('string'),
    l('number'),
    l('boolean'),
    l('url'),
    l('image'),
    l('piechart'),
    l('timeserie'),
], 'PropTypeIO');
export type PropType = TypeOf<typeof PropTypeIO>;


// string
export const StringOptionLevelIO = u([
    l('title'), l('subtitle'), l('normal'),
], 'StringOptionLevelIO');
export type StringOptionLevel = TypeOf<typeof StringOptionLevelIO>;

export const StringOptionStyleIO = u([
    l('bold'), l('italic'), l('bold-italic'), l('normal'),
], 'StringOptionStyleIO');
export type StringOptionStyle = TypeOf<typeof StringOptionStyleIO>;

export const StringOptionsIO = i({
    level: StringOptionLevelIO,
    style: StringOptionStyleIO,
    withLabel: io.boolean,
}, 'StringOptionsIO');
export type StringOptions = TypeOf<typeof StringOptionsIO>;

export const defaultStringOptions =
    (): StringOptions => ({
        level: 'normal',
        style: 'normal',
        withLabel: true,
    });

// number 
export const NumberOptionsIO = StringOptionsIO;
export type NumberOptions = TypeOf<typeof NumberOptionsIO>;
export const defaultNumberOptions =
    (): NumberOptions => ({
        level: 'normal',
        style: 'normal',
        withLabel: true,
    });


// boolean 
export const BooleanOptionsIO = StringOptionsIO;
export type BooleanOptions = TypeOf<typeof BooleanOptionsIO>;
export const defaultBooleanOptions =
    (): BooleanOptions => ({
        level: 'normal',
        style: 'normal',
        withLabel: true,
    });


// url
export const URLOptionsIO = StringOptionsIO;
export type URLOptions = TypeOf<typeof URLOptionsIO>;
export const defaultURLOptions =
    (): URLOptions => ({
        level: 'normal',
        style: 'normal',
        withLabel: true,
    });

// image
export const ImageOptionsIO = i({
    withLabel: io.boolean,
}, 'ImageOptionsIO');
export type ImageOptions = TypeOf<typeof ImageOptionsIO>;
export const defaultImageOptions =
    (): ImageOptions => ({
        withLabel: false,
    });

// >> the fun starts here - pm

// piechart
export const PiechartPieceIO = io.intersection([
    i({
        propName: io.string,
        color: io.string,
    }),
    p({
        label: io.string,
    }),
], 'PiechartPieceIO');
export type PiechartPiece = TypeOf<typeof PiechartPieceIO>;

export const PiechartOptionsIO = i({
    columns: a(PiechartPieceIO),
    scale: u([l('normal'), l('log')]),
    radius: u([l('normal'), l('dynamic')]),
}, 'PiechartOptionsIO');
export type PiechartOptions = TypeOf<typeof PiechartOptionsIO>;
export const defaultPiechartOptions =
    (): PiechartOptions => ({
        scale: 'normal',
        radius: 'normal',
        columns: [],
    });

// timeserie
export const TimeserieOptionsIO = i({
    urlTemplate: io.string,
}, 'TimeserieOptionsIO');
export type TimeserieOptions = TypeOf<typeof TimeserieOptionsIO>;
export const defaultTimeserieOptions =
    (): TimeserieOptions => ({
        urlTemplate: '',
    });



export const BaseConfigIO = i({
    lang: u([l('fr'), l('nl')]),
    propName: io.string,
}, 'BaseConfigIO');

export const NullConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: io.null,
    }),
], 'NullConfigIO');
export type NullConfig = TypeOf<typeof NullConfigIO>;


export const StringConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('string'),
        options: StringOptionsIO,
    }),
], 'StringConfigIO');
export type StringConfig = TypeOf<typeof StringConfigIO>;

export const NumberConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('number'),
        options: NumberOptionsIO,
    }),
], 'NumberConfigIO');
export type NumberConfig = TypeOf<typeof NumberConfigIO>;

export const BooleanConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('boolean'),
        options: BooleanOptionsIO,
    }),
], 'BooleanConfigIO');
export type BooleanConfig = TypeOf<typeof BooleanConfigIO>;


export const URLConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('url'),
        options: URLOptionsIO,
    }),
], 'URLConfigIO');
export type URLConfig = TypeOf<typeof URLConfigIO>;


export const ImageConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('image'),
        options: ImageOptionsIO,
    }),
], 'ImageConfigIO');
export type ImageConfig = TypeOf<typeof ImageConfigIO>;


export const PiechartConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('piechart'),
        options: PiechartOptionsIO,
    }),
], 'PiechartConfigIO');
export type PiechartConfig = TypeOf<typeof PiechartConfigIO>;


export const TimeserieConfigIO = io.intersection([
    BaseConfigIO,
    i({
        type: l('timeserie'),
        options: TimeserieOptionsIO,
    }),
], 'TimeserieConfigIO');
export type TimeserieConfig = TypeOf<typeof TimeserieConfigIO>;


export const RowConfigIO = u([
    StringConfigIO, NumberConfigIO, BooleanConfigIO, URLConfigIO, ImageConfigIO, PiechartConfigIO, TimeserieConfigIO,
], 'RowConfigIO');
export type RowConfig = TypeOf<typeof RowConfigIO>;


export type ConfigWithLabel = StringConfig | NumberConfig | BooleanConfig | URLConfig | ImageConfig;
export type ConfigWithLevel = StringConfig | NumberConfig | BooleanConfig | URLConfig;
export type ConfigWithStyle = StringConfig | NumberConfig | BooleanConfig | URLConfig;

export const withLabel =
    (a: RowConfig): a is ConfigWithLabel => {
        return ('withLabel' in a.options);
    };

export const withLevel =
    (a: RowConfig): a is ConfigWithLabel => {
        return ('level' in a.options);
    };

export const withStyle =
    (a: RowConfig): a is ConfigWithLabel => {
        return ('style' in a.options);
    };
