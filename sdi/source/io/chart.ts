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
 

import { i, u, l, a, t, MessageRecordIO, TypeOf } from './io';
import { IAliasIO } from './alias';
import * as io from 'io-ts';

export const IChartIO = i({
    layer: io.string,
    aliases: a(IAliasIO),
    summary: io.string,
    propName: io.string,
});

export const IChartClassIO = i({
    label: MessageRecordIO,
    interval: t([io.number, io.number]),
});

export const IChartContinuousPart = i({
    type: l('continuous'),
    classes: a(IChartClassIO),
    scale: u([l('normal'), l('log')]),
});

export const IChartDiscretePart = i({
    type: l('discrete'),
    groups: a(a(io.string)),
});

export const IChartContinuousIO = io.intersection([IChartIO, IChartContinuousPart]);
export const IChartDiscreteIO = io.intersection([IChartIO, IChartDiscretePart]);
export const ChartIO = u([IChartContinuousIO, IChartDiscreteIO]);

export type IChartContinuous = TypeOf<typeof IChartContinuousIO>;
export type IChartDiscrete = TypeOf<typeof IChartDiscreteIO>;
export type IChartClass = TypeOf<typeof IChartClassIO>;
export type IChart = TypeOf<typeof IChartIO>;
export type Chart = TypeOf<typeof ChartIO>;
