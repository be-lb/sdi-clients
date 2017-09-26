
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

import { parse as parseUrl } from 'url';
import { IShapeApp, IMapBaseLayerTranslated } from '../shape';
import { Feature, Properties, FeatureCollection, IMapBaseLayer } from 'sdi/source';
import { fromRecord } from '../locale/index';

export const applyQueryView = (state: IShapeApp) => {
    const location = document.location;
    const url = parseUrl(location.href, true);

    if (url.query) {
        const q = url.query;

        // map
        if ('m' in q) {
            state['app/current-map'] = q.m;
        }

        // API Root URL
        if ('api' in q) {
            let apiRoot = q.api;
            if (apiRoot[apiRoot.length - 1] !== '/') {
                apiRoot = apiRoot + '/';
            }
            state['app/api-root'] = apiRoot;
        }

        // view state
        const mapView = state['port/map/view'];
        if (('srs' in q) && q.srs === mapView.srs) {
            if (('lat' in q) && ('lon' in q)) {
                const lon = parseFloat(q.lon);
                const lat = parseFloat(q.lat);
                mapView.center = [lon, lat];
            }
            if ('zoom' in q) {
                mapView.zoom = parseInt(q.zoom, 10);
            }
            if ('rotation' in q) {
                mapView.rotation = parseInt(q.rotation, 10);
            }
        }
        state['port/map/view'] = mapView;
    }

};



export const uniqIdGen = (prefix = '') => {
    let counter = 0;
    return () => {
        counter += 1;
        return `${prefix}${counter}`;
    };
};

export const uniqId = uniqIdGen('sdi-');

const APP_ID_KEY = '__app_id__';

export const addAppIdToFeature = (f: Feature) => {
    f.properties = {
        [APP_ID_KEY]: uniqId(),
        ...f.properties,
    };
};

const FETAURE_PROPS_BLACKLIST = new Set([APP_ID_KEY]);

export const getFeatureProperties = (f: Feature): Properties => {
    const props = f.properties;
    if (!props) {
        return null;
    }
    return (
        Object.keys(props).reduce<Properties>((acc, k) => {
            if (FETAURE_PROPS_BLACKLIST.has(k)) {
                return acc;
            }
            return {
                [k]: props[k],
                ...acc,
            };
        }, {}));
};


export const getLayerPropertiesKeys = (fc: FeatureCollection): string[] => {
    if (fc.features.length === 0) {
        return [];
    }
    const f = fc.features[0];
    const props = f.properties;
    if (!props) {
        return [];
    }
    return (
        Object.keys(props).reduce<string[]>((acc, k) => {
            if (FETAURE_PROPS_BLACKLIST.has(k)) {
                return acc;
            }
            acc.push(k);
            return acc;
        }, []));
};

export const hashMapBaseLayer = (l: IMapBaseLayer) => {
    return `${fromRecord(l.name)}|${fromRecord(l.url)}|${fromRecord(l.params.LAYERS)}`;
};


export const translateMapBaseLayer = (l: IMapBaseLayer): IMapBaseLayerTranslated => ({
    name: fromRecord(l.name),
    srs: l.srs,
    params: {
        LAYERS: fromRecord(l.params.LAYERS),
        VERSION: l.params.VERSION,
    },
    url: fromRecord(l.url),
});
