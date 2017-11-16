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

import { Feature, IMapBaseLayer, IMapInfo, Category, Attachment } from 'sdi/source';
import { IDataTable } from 'sdi/components/table';
import { ITimeserieInteractive, ITimeserieCollection } from 'sdi/components/timeserie';
import { ButtonComponent } from 'sdi/components/button';
import { IMapViewData, IMapScale, Interaction } from 'sdi/map';

import {
    AppLayout,
    ILegend,
    IMenuData,
    IMapNavigator,
    IToolWebServices,
    IToolGeocoder,
    IPositioner,
    IShare,
    ILayerColection,
    IDatasetMetadataCollection,
} from './types';





declare module 'sdi/shape' {
    export interface IShape {
        'app/layout': AppLayout[];
        'app/current-map': string | null;
        'app/current-layer': string | null;
        'app/current-feature': Feature | null;
        'app/map-ready': boolean;
        'app/route': string[];

        'component/legend': ILegend;
        'component/menu': IMenuData;
        'component/table': IDataTable;
        'component/table/extract': IDataTable;
        'component/mapnavigator': IMapNavigator;
        'component/timeserie': ITimeserieInteractive;
        'component/legend/webservices': IToolWebServices;
        'component/legend/geocoder': IToolGeocoder;
        'component/legend/positioner': IPositioner;
        'component/legend/share': IShare;
        'component/button': ButtonComponent;

        'port/map/baseLayers': IMapBaseLayer[];
        'port/map/view': IMapViewData;
        'port/map/scale': IMapScale;
        'port/map/interaction': Interaction;


        'data/layers': ILayerColection;
        'data/maps': IMapInfo[];
        'data/timeseries': ITimeserieCollection;
        'data/categories': Category[];
        'data/datasetMetadata': IDatasetMetadataCollection;
        'data/attachments': Attachment[];
    }
}

