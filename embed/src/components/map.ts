
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



import { getBaseLayer, getMapInfo, getFeatureId, getLayerId } from '../queries/app';
import { setLayout, setCurrentFeatureById } from '../events/app';
import {
    getView,
    getScaleLine,
    getInteraction,
    getInteractionMode,
} from '../queries/map';
import {
    viewEvents,
    scalelineEvents,
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

let mapSetTarget: (t: string | Element | undefined) => void;
let mapUpdate: () => void;


const scaleline =
    () => {
        const sl = getScaleLine();
        return (
            DIV({ className: 'map-scale', style: { width: `${sl.width}px` } },
                DIV({ className: 'map-scale-label' }, `${sl.count} ${sl.unit}`),
                DIV({ className: 'map-scale-chess' },
                    DIV({},
                        DIV({ className: 'white' }),
                        DIV({ className: 'black' })),
                    DIV({},
                        DIV({ className: 'black' }),
                        DIV({ className: 'white' }))))
        );
    };


const selectFeature =
    (lid: string, fid: string | number) => {
        setCurrentFeatureById(lid, fid);
        setLayout('MapAndFeature');
    };


const getSelected =
    () => ({
        featureId: getFeatureId(),
        layerId: getLayerId(),
    })


const attachMap =
    () =>
        (element: Element | null) => {
            // logger(`attachMap ${typeof element}`);
            if (!mapUpdate) {
                const {
                    update,
                    setTarget,
                    selectable,
                    highlightable,
                } = create({ ...options, element });
                mapSetTarget = setTarget;
                mapUpdate = update;

                selectable({ selectFeature }, getInteraction);

                highlightable(getSelected);

            }
            if (element) {
                mapSetTarget(element);
            }
            else {
                mapSetTarget(undefined);
            }
        };


const render =
    () => {
        // logger(`render ${typeof mapUpdate}`);
        if (mapUpdate) {
            mapUpdate();
        }

        return (
            DIV({ className: `map-wrapper ${getInteractionMode()}` },
                DIV({
                    // id: mapId,
                    className: 'map',
                    ref: attachMap(),
                }),
                scaleline())
        );
    };


export default render;

logger('loaded');
