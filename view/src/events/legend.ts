
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

import { dispatch } from 'sdi/shape';
import { IMapBaseLayer } from 'sdi/source';

import { LegendPage } from '../shape/types';
import { IUgWsResponse } from '../ports/geocoder';



const events = {
    setPage(p: LegendPage) {
        dispatch('component/legend', (state) => {
            state.currentPage = p;
            return state;
        });
    },

    setWMSLegendVisible(b: boolean) {
        dispatch('component/legend/show-wms-legend', () => b);
    },

    updateWebServiceURL(url: string) {
        dispatch('component/legend/webservices', state => ({ ...state, url }));
    },

    updateWebServiceLayers(services: IMapBaseLayer[]) {
        dispatch('component/legend/webservices', (state) => {
            state.layers = services;
            state.folded = false;
            return state;
        });
    },

    // addWebServiceLayer(lyr: IMapBaseLayer) {
    //     dispatch('port/map/baseLayers', bl => bl.concat([lyr]));
    // },

    updateGeocoderTerm(address: string) {
        dispatch('component/legend/geocoder', state => ({ ...state, address }));
    },

    updateGeocoderResponse(serviceResponse: IUgWsResponse | null) {
        dispatch('component/legend/geocoder', (state) => {
            state.serviceResponse = serviceResponse;
            return state;
        });
    },

    unfoldGeocoder() {
        dispatch('component/legend/geocoder', (state) => {
            state.folded = false;
            return state;
        });
    },

    foldGeocoder() {
        dispatch('component/legend/geocoder', (state) => {
            state.folded = true;
            return state;
        });
    },

    updatePositionerLatitude(lat: number) {
        dispatch('component/legend/positioner', (state) => {
            state.point.latitude = lat;
            return state;
        });
    },

    updatePositionerLongitude(lon: number) {
        dispatch('component/legend/positioner', (state) => {
            state.point.longitude = lon;
            return state;
        });
    },

    shareWithView(b: boolean) {
        dispatch('component/legend/share', (state) => {
            state.withView = b;
            return state;
        });
    },
};

export default events;
