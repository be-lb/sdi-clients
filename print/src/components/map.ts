
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

import { DIV } from 'sdi/components/elements';
import { create, IMapOptions } from 'sdi/map';
import langSwitch from 'sdi/components/lang-switch';


import { getBaseLayer, getMapInfo } from '../queries/app';
import {
    getView,
    getInteraction,
    getInteractionMode,
    getPrintRequest,
} from '../queries/map';
import {
    viewEvents,
    scalelineEvents,
    setPrintResponse,
} from '../events/map';


const logger = debug('sdi:comp/map');

const getInfo =
    () => getMapInfo().fold(() => null, m => m);

const options: IMapOptions = {
    getBaseLayer,
    getView,
    element: null,
    getMapInfo: getInfo,

    updateView: viewEvents.updateMapView,
    setScaleLine: scalelineEvents.setScaleLine,
};

let mapSetTarget: (t: Element | null) => void;
let mapUpdate: () => void;


const attachMap =
    () =>
        (element: Element | null) => {
            // logger(`attachMap ${typeof element}`);

            if (!mapUpdate) {
                const {
                    update,
                    setTarget,
                    printable,
                } = create({ ...options, element });
                mapSetTarget = setTarget;
                mapUpdate = update;

                printable({
                    getRequest: getPrintRequest,
                    setResponse: setPrintResponse,
                }, getInteraction);

            }
            if (element) {
                mapSetTarget(element);
            }
            else {
                mapSetTarget(null);
            }
        };



const render =
    () => {
        if (mapUpdate) {
            mapUpdate();
        }

        return (
            DIV({ className: `map-wrapper ${getInteractionMode()}` },
                DIV({
                    className: 'map',
                    ref: attachMap(),
                }),
                DIV({ className: 'be-logo-box' }),
                langSwitch())
        );
    };


export default render;

logger('loaded');
