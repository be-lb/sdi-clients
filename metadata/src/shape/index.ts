
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

import { Inspire, IUser, TopicCategory, Keyword, MdPointOfContact, ResponsibleOrganisation } from 'sdi/source';
import { ButtonComponent } from 'sdi/components/button';
import { IDataTable } from 'sdi/components/table';

import { MdForm } from '../components/single';
import { AppLayout } from '../app';



// State Augmentation

declare module 'sdi/shape' {
    export interface IShape {
        'app/layout': AppLayout[];
        'app/current-metadata': string | null;

        'component/splash': number;
        'component/button': ButtonComponent;
        'component/table/layers': IDataTable;
        'component/table/keywords': IDataTable;
        'component/single': MdForm;

        'data/user': IUser | null;
        'data/datasetMetadata': Inspire[];
        'data/keywords': Keyword[];
        'data/topics': TopicCategory[];
        'data/md/poc': MdPointOfContact[];
        'data/md/org': ResponsibleOrganisation[];
    }
}
