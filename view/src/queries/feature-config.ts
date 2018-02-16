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

// import appQueries from './app';
// import { RowConfig, FeatureCollection } from 'sdi/source';
// import { getLayerPropertiesKeys } from '../util/app';


// const queries = {

//     getFeatureViewType() {
//         const { info } = appQueries.getCurrentLayerInfo();
//         if (info) {
//             return info.featureViewOptions.type;
//         }
//         return null;
//     },

//     getConfig() {
//         const { info } = appQueries.getCurrentLayerInfo();
//         if (info
//             && info.featureViewOptions
//             && info.featureViewOptions.type === 'config') {
//             return info.featureViewOptions;
//         }
//         const rows: RowConfig[] = [];
//         return { type: 'config', rows };
//     },

//     // Layer / FeatureCollection

//     getLayer(): FeatureCollection {
//         const id = appQueries.getCurrentLayer();
//         if (id !== null) {
//             const layer = appQueries.getLayerData(id);

//             if (layer !== null) {
//                 return layer;
//             }
//         }
//         return { type: 'FeatureCollection', features: [] };
//     },

//     getKeys(): string[] {
//         return getLayerPropertiesKeys(queries.getLayer());
//     },

// };

// export default queries;
