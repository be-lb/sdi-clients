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

import { MAX_DURATION, ButtonGetter, ButtonQuerySet } from './index';


export const buttonQueries =
    (getButton: ButtonGetter): ButtonQuerySet => {

        const queries = {
            allButtons() {
                return getButton();
            },

            hasKey(k: string) {
                const s = getButton();
                return (k in s);
            },

            isActive(k: string) {
                const s = getButton()[k];
                const n = Date.now();
                return (
                    (s)
                        ? ((s.step === 'active') && (n - s.since < MAX_DURATION))
                        : false);
            },

            duration(k: string) {
                const s = getButton()[k];
                return (s) ? Date.now() - s.since : Date.now();
            },
        };

        return queries;
    };

