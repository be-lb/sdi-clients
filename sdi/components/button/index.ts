
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

import { factory } from './base';


export const MAX_DURATION = 5000;

export interface ButtonQuerySet {
    allButtons(): any;
    hasKey(k: string): boolean;
    isActive(k: string): boolean;
    duration(k: string): number;
}

export interface ButtonEventSet {
    setStep(k: string, s: any): void;
}


export type ButtonGetter = () => ButtonComponent;
export type ButtonSetter = (h: (a: ButtonComponent) => ButtonComponent) => void;

export type ButtonType =
    | 'add'
    | 'arrow-right'
    | 'bar-chart'
    | 'cancel'
    | 'clear'
    | 'close'
    | 'confirm'
    | 'draft'
    | 'edit'
    | 'filter'
    | 'login'
    | 'logout'
    | 'move-down'
    | 'move-up'
    | 'navigate'
    | 'next'
    | 'pie-chart'
    | 'prev'
    | 'publish'
    | 'remove'
    | 'save'
    | 'search'
    | 'select'
    | 'settings'
    | 'switch'
    | 'table'
    | 'text'
    | 'toggle-off'
    | 'toggle-on'
    | 'translate'
    | 'upload'
    | 'validate'
    | 'view'
    ;

export type Step = 'initial' | 'active';

interface ButtonState {
    step: Step;
    since: number;
}

export interface ButtonComponent {
    [k: string]: ButtonState;
}


export default factory;
