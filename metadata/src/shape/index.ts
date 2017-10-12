
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

import { IUser, Inspire } from 'sdi/source';
import { EditableState } from '../components/editable';
import { ButtonComponent } from '../components/button';
import { IDataTable, initialTableState } from '../components/table/base';
import { MdForm, defaultMdFormState } from '../components/single';

export enum AppLayout {
    List,
    Single,
}

// State Interface


export interface IShapeApp {
    'app/user': string | null;
    'app/api-root': string;
    'app/lang': 'fr' | 'nl';
    'app/layout': AppLayout[];
    'app/current-metadata': string | null;
    'app/csrf': string | null;

    'component/editable': EditableState;
    'component/button': ButtonComponent;
    'component/table': IDataTable;
    'component/single': MdForm;
}

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}

export interface IShapeData {
    'data/user': IUser | null;
    'data/datasetMetadata': IDatasetMetadataCollection;
}

export type IShape = IShapeApp & IShapeData;

// Initial Application State 

export const appShape: IShapeApp = {
    'app/user': null,
    'app/api-root': 'http://localhost:3000/',
    'app/lang': 'fr',
    'app/layout': [AppLayout.List],
    'app/current-metadata': null,
    'app/csrf': null,


    'component/editable': {},
    'component/button': {},
    'component/table': initialTableState(),
    'component/single': defaultMdFormState(),
};
