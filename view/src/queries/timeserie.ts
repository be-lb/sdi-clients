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

import { query } from 'sdi/shape';
import { initialTimeserieState } from 'sdi/components/timeserie';

export const queryTimeserie =
    (id: string) => {
        const ts = query('component/timeserie');
        if (id in ts) {
            return ts[id];
        }
        return initialTimeserieState();
    };

export const getData =
    (id: string) => {
        const series = query('data/timeseries');
        if (id in series) {
            return series[id];
        }
        return null;
    };
