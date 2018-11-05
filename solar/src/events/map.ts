
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

import { right } from 'fp-ts/lib/Either';
import { some, none } from 'fp-ts/lib/Option';

import { SyntheticLayerInfo } from 'sdi/app';
import { dispatchK, dispatch, query } from 'sdi/shape';
import { viewEventsFactory, scaleEventsFactory, removeLayer, addLayer, FetchData } from 'sdi/map';
import { IUgWsResponse } from 'sdi/ports/geocoder';
import { IMapInfo, ILayerInfo, Inspire, PolygonDiscreteGroup } from 'sdi/source';

import { Tag } from '../queries/simulation';





export const scalelineEvents = scaleEventsFactory(dispatchK('port/map/scale'));
export const viewEvents = viewEventsFactory(dispatchK('port/map/view'));

export const updateGeocoderResponse =
    (serviceResponse: IUgWsResponse | null) =>
        dispatch('component/geocoder/response', () => serviceResponse);

export const clearGeocoderResponse = () => updateGeocoderResponse(null);

export const updateGeocoderTerm =
    (address: string) =>
        dispatch('component/geocoder/input', () => address);

const solarLocateId = 'solar-locate';

const metadataTemplate =
    (): Inspire => ({
        id: solarLocateId,
        geometryType: 'MultiPolygon',
        resourceTitle: { fr: 'solar', nl: 'solar', en: 'solar' },
        resourceAbstract: { fr: '', nl: '', en: '' },
        uniqueResourceIdentifier: solarLocateId,
        topicCategory: [],
        keywords: [],
        geographicBoundingBox: { west: 0.0, north: 0.0, east: 0.0, south: 0.0 },
        temporalReference: { creation: '2018-04-12T14:51:27.335376Z', revision: '2018-04-12T14:51:27.335030Z' },
        responsibleOrganisation: [1],
        metadataPointOfContact: [1],
        metadataDate: '2018-04-12T14:51:27.335030Z',
        published: false,
    });


const groupTemplate =
    (tag: Tag, fillColor: string): PolygonDiscreteGroup => ({
        strokeColor: '#666',
        patternAngle: 0,
        strokeWidth: 1,
        label: { nl: '', fr: '', en: '' },
        fillColor,
        values: [tag],
        pattern: false,
    });

const layerTemplate =
    (): ILayerInfo => ({
        id: solarLocateId,
        legend: null,
        group: null,
        metadataId: solarLocateId,
        visible: true,
        featureViewOptions: { type: 'default' },
        style: {
            groups: [
                groupTemplate('great', '#8db63c'),
                groupTemplate('good', '#ebe316'),
                groupTemplate('unusable', '#006f90'),
            ],
            propName: 'tag',
            kind: 'polygon-discrete',
        },
    });

const mapTemplate =
    (baseLayer: string): IMapInfo => ({
        baseLayer,
        id: `${solarLocateId}-${baseLayer}`,
        url: `/dev/null/solar-locate/`,
        lastModified: 1523599299611,
        status: 'published',
        title: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        description: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        categories: [],
        attachments: [],
        layers: [layerTemplate()],
    });

const layerInfo =
    (): SyntheticLayerInfo => ({
        name: { fr: 'o', nl: 'o', en: 'o' },
        info: layerTemplate(),
        metadata: metadataTemplate(),
    });

const fetchData =
    (capakey: string): FetchData =>
        () => {
            const roofs = query('solar/data/roofs');
            if (capakey in roofs) {
                return right(some(roofs[capakey]));
            }
            return right(none);
        };

export const addRoofLayer =
    (capakey: string) => {
        removeLayer(solarLocateId);
        addLayer(layerInfo, fetchData(capakey));
    };

export const clearRoofLayer =
    () => {
        removeLayer(solarLocateId);
    };

const BASEMAPS = {
    gray: 'urbis.irisnet.be/urbis_gray',
    ortho: 'urbis.irisnet.be/ortho2018_Toponymy',
};

export const loadMaps =
    () => dispatch('data/maps',
        state => state.concat([
            mapTemplate(BASEMAPS.gray),
            mapTemplate(BASEMAPS.ortho),
        ]));

export const selectMapGray =
    () => dispatch('app/current-map', () => `${solarLocateId}-${BASEMAPS.gray}`);

export const selectMapOPrtho =
    () => dispatch('app/current-map', () => `${solarLocateId}-${BASEMAPS.ortho}`);
