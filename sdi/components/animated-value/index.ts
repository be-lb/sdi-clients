/*
*  Copyright (C) 2018 Atelier Cartographique <contact@atelier-cartographique.be>
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
import { Getter, Setter } from '../../shape';

const FRAME_RATE = 16 * 2 * 2 * 2;

export interface ValueShape {
    [k: string]: number;
}


export interface CurrentValue {
    getCurrent: Getter<number>;
    setCurrent: (n: number) => void;
}

export interface TargetValue {
    target: Getter<number>;
}


export const getValue =
    (gv: Getter<ValueShape>, k: string) =>
        () => {
            const vs = gv();
            if (k in vs) {
                return vs[k];
            }
            return 0;
        };

export const setValue =
    (sv: Setter<ValueShape>, k: string) =>
        (v: number) =>
            sv(vs => ({ ...vs, [k]: v }));


export const initValues = (): ValueShape => ({});
export type AnimatedValue = CurrentValue & TargetValue;
// export type AnimatedValueRender = (n: number) => React.ReactNode;


export const value =
    (av: AnimatedValue, threshold = 0.1) => {
        const c = av.getCurrent();
        const t = av.target();
        const diff = t - c;
        const absDiff = Math.abs(diff);
        if (absDiff > threshold) {
            setTimeout(() => {
                const step = diff / 2;
                av.setCurrent(c + step);
            }, FRAME_RATE);
        }
        return c;
    };


