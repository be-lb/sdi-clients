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
import { IUgWsAddress } from 'sdi/ports/geocoder';
import { inputs, outputs, thermicOutputs } from 'solar-sim';
import { FeatureCollection } from 'sdi/source';
import { Obstacles } from '../components/adjust';
import { Camera } from '../components/context/mat';

export type TypologyEnum =
    | 'closed'
    | 'detached'
    | 'apartments'
    | 'administrative'
    | 'collective'
    | 'industrial'
    ;


export type System = 'photovoltaic' | 'thermal';

// State Augmentation

interface GenericContainer<T> {
    [k: string]: T;
}

declare module 'sdi/shape' {
    export interface IShape {
        'solar/system': System;
        'solar/address': IUgWsAddress | null;
        'solar/inputs': inputs;
        'solar/outputs/pv': outputs | null;
        'solar/outputs/thermal': thermicOutputs | null;
        'solar/obstacle': Obstacles;
        'solar/optimalArea': number | null;
        'solar/loading': string[];
        'solar/loaded': string[];
        'solar/perspective/camera': Camera | null;
        'solar/perspective/src': string | null;

        'solar/data/roofs': GenericContainer<FeatureCollection>;
        'solar/data/geoms': GenericContainer<FeatureCollection>;
        'solar/data/buildings': GenericContainer<FeatureCollection>;
    }
}
