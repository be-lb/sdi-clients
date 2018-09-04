
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
import { IMapInfo, ILayerInfo, Inspire } from 'sdi/source';

import { PROD_THESH_MEDIUM, PROD_THESH_HIGH } from '../queries/simulation';





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

const layerTemplate =
    (): ILayerInfo => ({
        id: solarLocateId,
        legend: null,
        group: null,
        metadataId: solarLocateId,
        visible: true,
        featureViewOptions: { type: 'default' },
        style: {
            intervals: [
                {
                    patternAngle: 0,
                    strokeColor: '#666',
                    strokeWidth: 1,
                    high: PROD_THESH_MEDIUM,
                    fillColor: '#006f90',
                    label: { nl: '', fr: '', en: '' },
                    low: 0,
                    pattern: false,
                },
                {
                    patternAngle: 0,
                    strokeColor: '#666',
                    strokeWidth: 1,
                    high: PROD_THESH_HIGH,
                    fillColor: '#ebe316',
                    label: { nl: '', fr: '', en: '' },
                    low: PROD_THESH_MEDIUM,
                    pattern: false,
                },
                {
                    patternAngle: 0,
                    strokeColor: '#666',
                    strokeWidth: 1,
                    high: 100000000000000,
                    fillColor: '#8db63c',
                    label: { nl: '', fr: '', en: '' },
                    low: PROD_THESH_HIGH,
                    pattern: false,
                },
            ],
            kind: 'polygon-continuous',
            propName: 'productivity',
        },
    });

const mapTemplate =
    (): IMapInfo => ({
        id: solarLocateId,
        url: '/dev/null/solar-locate',
        lastModified: 1523599299611,
        status: 'published',
        title: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        description: { fr: 'SOLAR', nl: 'SOLAR', en: 'SOLAR' },
        baseLayer: 'urbis.irisnet.be/urbis_gray',
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

export const loadLocateMap =
    () => {
        dispatch('app/current-map', () => solarLocateId);
        dispatch('data/maps',
            state => state.concat([mapTemplate()]));
    };
