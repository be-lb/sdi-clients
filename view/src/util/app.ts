
// /*
//  *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
//  *
//  *  This program is free software: you can redistribute it and/or modify
//  *  it under the terms of the GNU General Public License as published by
//  *  the Free Software Foundation, version 3 of the License.
//  *
//  *  This program is distributed in the hope that it will be useful,
//  *  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  *  GNU General Public License for more details.
//  *
//  *  You should have received a copy of the GNU General Public License
//  *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//  */

// import { parse as parseUrl } from 'url';

// import { IShape } from 'sdi/shape';

// export const applyQueryView =
//     (state: IShape) => {
//         const location = document.location;
//         const url = parseUrl(location.href, true);

//         if (url.query) {
//             const q = url.query;

//             // map
//             if ('m' in q) {
//                 state['app/current-map'] = q.m;
//             }

//             // view state
//             const mapView = state['port/map/view'];
//             if (('srs' in q) && q.srs === mapView.srs) {
//                 if (('lat' in q) && ('lon' in q)) {
//                     const lon = parseFloat(q.lon);
//                     const lat = parseFloat(q.lat);
//                     mapView.center = [lon, lat];
//                 }
//                 if ('zoom' in q) {
//                     mapView.zoom = parseInt(q.zoom, 10);
//                 }
//                 if ('rotation' in q) {
//                     mapView.rotation = parseInt(q.rotation, 10);
//                 }
//             }
//             state['port/map/view'] = mapView;
//         }

//     };

