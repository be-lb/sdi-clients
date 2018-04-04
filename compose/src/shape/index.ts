
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

import { Feature, IUser, IMapInfo, Category, Attachment, Inspire, IMapBaseLayer, MdPointOfContact, ResponsibleOrganisation } from 'sdi/source';
import { IDataTable } from 'sdi/components/table';
import { ButtonComponent } from 'sdi/components/button';
import { ITimeserieInteractive, ITimeserieCollection } from 'sdi/components/timeserie';
import { IMapViewData, IMapScale, Interaction } from 'sdi/map';

import {
    AppLayout,
    ILayerCollection,
    MapInfoIllustrationState,
    AttachmentForm,
} from './types';
import { ILegendEditor } from '../components/legend-editor';
import { EditableState } from '../components/editable';
import { FeatureConfig } from '../components/feature-config';
import { LayerEditor } from '../components/layer';

interface BaseLayerCollection {
    [k: string]: IMapBaseLayer;
}

// State Augmentation

declare module 'sdi/shape' {
    export interface IShape {
        'app/user': string | null;
        'app/api-root': string;
        'app/lang': 'fr' | 'nl';
        'app/layout': AppLayout[];
        'app/current-map': string | null;
        'app/current-layer': string | null;
        'app/current-feature': Feature | null;
        'app/current-metadata': string | null;
        'app/map-ready': boolean;
        'app/map-info/illustration': MapInfoIllustrationState;
        'app/csrf': string | null;
        'app/root': string;

        'component/splash': number;
        'component/table': IDataTable;
        'component/legend-editor': ILegendEditor;
        'component/editable': EditableState;
        'component/button': ButtonComponent;
        'component/feature-config': FeatureConfig;
        'component/layer-editor': LayerEditor;
        'component/timeserie': { [id: string]: ITimeserieInteractive };
        'component/attachments': AttachmentForm[];

        'port/map/view': IMapViewData;
        'port/map/scale': IMapScale;
        'port/map/interaction': Interaction;

        'data/user': IUser | null;
        'data/layers': ILayerCollection;
        'data/maps': IMapInfo[];
        'data/datasetMetadata': Inspire[];
        'data/timeseries': ITimeserieCollection;
        'data/categories': Category[];
        'data/attachments': Attachment[];
        'data/baselayers': BaseLayerCollection;

        'data/md/poc': MdPointOfContact[];
        'data/md/org': ResponsibleOrganisation[];
    }
}
