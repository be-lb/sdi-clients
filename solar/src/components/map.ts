
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
import { Coordinate } from 'openlayers';

import { DIV } from 'sdi/components/elements';

import { IMapOptions, create } from 'sdi/map';
import { getCurrentBaseLayer, getView, getInteraction } from '../queries/map';
import { scalelineEvents, viewEvents } from '../events/map';
import { loadCoordinate } from '../events/app';
import { getMapInfo } from '../queries/app';

const logger = debug('sdi:comp:map');
const mapId = 'be-sdi-this-is-the-map';

const options: IMapOptions = {
    element: null,
    getBaseLayer: getCurrentBaseLayer,
    getView,
    getMapInfo,

    updateView: viewEvents.updateMapView,
    setScaleLine: scalelineEvents.setScaleLine,
};

let mapSetTarget: (t: Element | null) => void;
let mapUpdate: () => void;

const pickPlace =
    (coords: Coordinate) => loadCoordinate(coords);

const attachMap = (element: Element | null) => {
    if (!mapUpdate) {
        const { update, setTarget, clickable } = create({
            ...options,
            element,
        });
        mapSetTarget = setTarget;
        mapUpdate = update;

        clickable({ setPosition: pickPlace }, getInteraction);
    }
    if (element) {
        logger('mapSetTarget');
        mapSetTarget(element);
    }
};

const render = () => {
    if (mapUpdate) {
        mapUpdate();
    }
    return (
        DIV({ className: 'map-wrapper' },
            DIV({
                id: mapId,
                className:
                    'map',
                ref: attachMap,
            }))
    );
};


export default render;

logger('loaded');
