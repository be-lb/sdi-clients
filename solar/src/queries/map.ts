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

import { fromNullable, some, none, Option } from 'fp-ts/lib/Option';

import { query, queryK } from 'sdi/shape';
import { scopeOption, fnOpt0, fnOpt1 } from 'sdi/lib';
import { getLang } from 'sdi/app';
import { MessageRecordLang } from 'sdi/source';



export const getCurrentBaseLayerName =
    fnOpt0(() => {
        const mid = query('app/current-map');
        const map = query('data/maps').find(m => m.id === mid);
        if (map) {
            return map.baseLayer;
        }
        return null;
    });

export const getCurrentBaseLayerOpt =
    () =>
        scopeOption()
            .let('name', getCurrentBaseLayerName())
            .let('baseLayer', fnOpt1(({ name }) => {
                const bls = query('data/baselayers');
                if (name && name in bls) {
                    return bls[name];
                }
                return null;
            }))
            .pick('baseLayer');

export const getCurrentBaseLayer = () => getCurrentBaseLayerOpt().fold(null, a => a);


export const getView = queryK('port/map/view');



export const geocoderResponse =
    () => fromNullable(query('component/geocoder/response'));

interface GeocoderInput {
    addr: string;
    lang: MessageRecordLang;
}

export const geocoderInput =
    (): Option<GeocoderInput> => {
        const addr = query('component/geocoder/input').trim();
        const lang = getLang();
        if (addr.length > 0) {
            const i: GeocoderInput = { addr, lang };
            return some(i);
        }
        return none;
    };
