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

import { Step, MAX_DURATION, ButtonQuerySet, ButtonSetter } from './index';


export const buttonEvents =
    (dispatch: ButtonSetter, queries: ButtonQuerySet) => {

        setInterval(() => {
            const state = queries.allButtons();
            const shouldUpdate = (
                Object.keys(state)
                    .reduce((acc, k) => {
                        if (acc) {
                            return acc;
                        }
                        const d = Date.now() - state[k].since;
                        return (state[k].step === 'active' && d <= (MAX_DURATION + 1000));
                    }, false));

            if (shouldUpdate) {
                dispatch(state => state);
            }
        }, 1000);

        const events = {
            setStep(k: string, s: Step) {
                dispatch((state) => {
                    state[k] = {
                        step: s,
                        since: Date.now(),
                    };
                    return state;
                });
            },
        };

        return events;
    };

