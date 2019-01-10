

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

import { DIV, INPUT, IMG, P, SPAN } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { IMapInfo, MessageRecord } from 'sdi/source';

import { queryMaps } from '../events/mapnavigator';
import { navigateMap } from '../events/route';
import { getMaps } from '../queries/mapnavigator';
import { fromPredicate } from 'fp-ts/lib/Either';
import { compose } from 'fp-ts/lib/function';

const logger = debug('sdi:mapnavigator');

const searchInput =
    () => INPUT({
        key: 'map-navigator-search-input',
        type: 'search',
        name: 'search',
        placeholder: tr('searchAtlas'),
        onChange: e => queryMaps(e.currentTarget.value.trim()),
    });

const searchButton =
    () => DIV({
        className: 'search-icon',
    },
        SPAN({ className: 'magnifier' }));


const searchField = () => (
    DIV({
        className: 'input-wrapper map-navigator-search',
    },
        searchInput(),
        searchButton()));


const mapTitle =
    (map: IMapInfo) => DIV({ className: 'map-title' }, fromRecord(map.title));


const isGreaterThan100 = fromPredicate<string, string>(rec => rec.length >= 100, rec => rec);

const trimDescription =
    (record: string) =>
        isGreaterThan100(record).fold(
            rec => rec,
            rec => `${rec.substr(0, 100)}...`,
        );

const description =
    compose((s: string) => P({}, s), trimDescription, fromRecord);


const readMore =
    () => DIV({ className: 'read-more' });

const imgWrapper =
    (map: IMapInfo) => DIV({ className: 'map-tile-img' },
        IMG({ src: map.imageUrl }));


const renderMap =
    (map: IMapInfo) => {
        const mid = map.id;
        return (
            DIV({
                key: mid,
                className: 'map-navigator-tile',
            },
                DIV({
                    onClick: () => mid ? navigateMap(mid) : null,
                },
                    imgWrapper(map),
                    mapTitle(map),
                    description(map.description),
                    readMore())));
    };

const renderMaps =
    () => getMaps().map(renderMap);

export const render = () =>
    DIV({ className: 'map-navigator' },
        searchField(),
        DIV({ className: 'maps-container' }, renderMaps()));

export default render;

logger('loaded');
