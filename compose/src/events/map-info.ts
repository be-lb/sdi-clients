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
 
import { dispatch } from './index';
import { MapInfoIllustrationState } from '../shape';
import appQueries from '../queries/app';
import { putMap, upload } from '../remote';

const events = {
    showImg() {
        dispatch('app/map-info/illustration', () => MapInfoIllustrationState.showImage);
    },

    generatingSelectedImgPreview() {
        dispatch('app/map-info/illustration', () => MapInfoIllustrationState.generateSelectedImagePreview);
    },

    showSelectedImg() {
        dispatch('app/map-info/illustration', () => MapInfoIllustrationState.showSelectedImage);
    },

    uploadImg(img: File) {
        const mid = appQueries.getCurrentMap();

        dispatch('app/map-info/illustration', () => {
            window.setTimeout(() => {
                upload('/documents/images/', img)
                    .then((data) => {
                        dispatch('data/maps', (maps) => {
                            const idx = maps.findIndex(m => m.id === mid);

                            if (idx >= 0) {
                                const map = maps[idx];
                                const endpoint = appQueries.getApiUrl(`maps/${mid}`);
                                map.imageUrl = data.url;
                                setTimeout(() => {
                                    putMap(endpoint, map);
                                }, 1);
                            }
                            return maps;
                        });
                        events.showImg();
                    }).catch(() => {
                        events.showSelectedImg();
                    });
            }, 1);
            return MapInfoIllustrationState.uploadSelectedImage;
        });
    },
};

export default events;
