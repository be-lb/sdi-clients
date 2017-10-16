
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

import { IUser } from 'sdi/source';
import { ButtonComponent } from '../components/button';
import { LoginForm, defaultLoginForm } from '../components/login';

export enum AppLayout {
    Login,
}

// State Interface


export interface IShapeApp {
    'app/user': string | null;
    'app/api-root': string;
    'app/lang': 'fr' | 'nl';
    'app/layout': AppLayout[];
    'app/csrf': string | null;

    'component/button': ButtonComponent;
    'component/login': LoginForm;
}


export interface IShapeData {
    'data/user': IUser | null;
}

export type IShape = IShapeApp & IShapeData;

// Initial Application State 

export const appShape: IShapeApp = {
    'app/user': null,
    'app/api-root': 'http://localhost:3000/',
    'app/lang': 'fr',
    'app/layout': [AppLayout.Login],
    'app/csrf': null,

    'component/button': {},
    'component/login': defaultLoginForm(),
};
