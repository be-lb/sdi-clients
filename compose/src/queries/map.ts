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

import * as debug from 'debug';
import { query } from 'sdi/shape';

const logger = debug('sdi:queries:map');
// let mapRef: OLMap;

// export const setMapReference = (map: OLMap) => {
//     mapRef = map;
// };

const queries = {

    getView() {
        return query('port/map/view');
    },

    getScaleLine() {
        return query('port/map/scale');
    },

    getEditableMode() {
        return query('port/map/editable').mode;
    },

    getEditableSelected() {
        return query('port/map/editable').selected;
    },



    // /**
    //  * runs a map function against features from the selected
    //  * layer in the current view extent.
    //  * 
    //  * @param id layer ID
    //  * @param fn map function
    //  */
    // mapFeatures<T>(id: string, fn: (a: Feature) => T) {
    //     const results: T[] = [];
    //     let lyr: layer.Vector | undefined;

    //     if (mapRef) {
    //         mapRef.getLayers().forEach((l) => {
    //             if (l.get('id') === id) {
    //                 lyr = <layer.Vector>l;
    //             }
    //         });

    //         if (lyr) {
    //             const e = mapRef.getView().calculateExtent(mapRef.getSize());
    //             // logger(`mapFeatures ${lyr} - ${e}`);
    //             lyr.getSource()
    //                 .forEachFeatureInExtent<null, void>(e, (f) => {
    //                     results.push(fn(f));
    //                 });
    //         }
    //     }
    //     return results;
    // },

};

export default queries;

logger('loaded');
