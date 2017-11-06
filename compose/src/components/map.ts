
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
import { ReactNode } from 'react';

import { DIV } from 'sdi/components/elements';

import { IMapOptions, create } from 'sdi/map';
import appQueries from '../queries/app';
import appEvents from '../events/app';
import mapQueries from '../queries/map';
import mapEvents from '../events/map';
// import layerQueries from '../queries/layer-editor';
// import layerEvents from '../events/layer-editor';
// import { button } from './button';

const logger = debug('sdi:comp:map');
const mapId = 'be-sdi-this-is-the-map';

const options: IMapOptions = {
    element: null,
    getBaseLayer: appQueries.getCurrentBaseLayer,
    getView: mapQueries.getView,
    getMapInfo: appQueries.getMapInfo,

    updateView: mapEvents.updateMapView,
    setScaleLine: mapEvents.setScaleLine,
};

let mapSetTarget: (t: string | Element) => void;
let mapUpdate: () => void;

const attachMap = (element: Element | null) => {
    if (!mapUpdate) {
        const { update, setTarget } = create({
            ...options,
            element,
        });
        mapSetTarget = setTarget;
        mapUpdate = update;
        appEvents.signalReadyMap();
    }
    if (element) {
        logger('mapSetTarget');
        mapSetTarget(element);
    }
};

const scaleline = () => {
    const sl = mapQueries.getScaleLine();


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


// const addButton = button('add', 'add');
// const selectButton = button('select');

const render = () => {
    if (mapUpdate) {
        mapUpdate();
    }

    const overlays: ReactNode[] = [];

    // if (!layerQueries.isReadonly()) {
    //     const mode = mapQueries.getEditableMode();
    //     if ('select' === mode) {
    //         overlays.push(
    //             DIV({ className: 'map-mode' }, addButton(() => {
    //                 layerEvents.setCreateMode();
    //             })));
    //     }
    //     else if ('create' === mode) {
    //         overlays.push(
    //             DIV({ className: 'map-mode' }, selectButton(() => {
    //                 layerEvents.setSelectMode();
    //             })));
    //     }
    // }

    overlays.push(scaleline());

    return (
        DIV({ className: 'map-wrapper' },
            DIV({
                id: mapId,
                className:
                'map',
                ref: attachMap,
            }),
            ...overlays)
    );
};


export default render;

logger('loaded');
