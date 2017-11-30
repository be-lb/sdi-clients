
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



import appQueries from '../queries/app';
import appEvents from '../events/app';
import {
    getView,
    getScaleLine,
    getInteraction,
    getInteractionMode,
} from '../queries/map';
import {
    viewEvents,
    scalelineEvents,
    measureEvents,
    trackerEvents,
    setExtractCollection,
    startMark,
    endMark,
} from '../events/map';
import { AppLayout } from '../shape/types';

import geocoder from './legend-tools/geocoder';
import baseSwitch from './base-layer-switch';

const logger = debug('sdi:comp/map');
// const mapId = 'be-sdi-this-is-the-map';


const options: IMapOptions = {
    element: null,
    getBaseLayer: appQueries.getCurrentBaseLayer,
    getMapInfo: appQueries.getMapInfo,
    getView,

    updateView: viewEvents.updateMapView,
    setScaleLine: scalelineEvents.setScaleLine,
};

let mapSetTarget: (t: Element | null) => void;
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
        appEvents.setCurrentFeatureById(lid, fid);
        appEvents.setLayout(AppLayout.MapAndFeature);
    };


const getSelected =
    () => {
        const f = appQueries.getCurrentFeature();
        const l = appQueries.getCurrentLayer();
        const fid = f ? f.id : null;
        return {
            featureId: fid,
            layerId: l,
        }
    }


const attachMap =
    () =>
        (element: Element | null) => {
            // logger(`attachMap ${typeof element}`);
            if (!mapUpdate) {
                const {
                    update,
                    setTarget,
                    selectable,
                    measurable,
                    trackable,
                    extractable,
                    markable,
                    highlightable,
                } = create({ ...options, element });
                mapSetTarget = setTarget;
                mapUpdate = update;
                appEvents.signalReadyMap();

                selectable({ selectFeature }, getInteraction);

                measurable({
                    updateMeasureCoordinates: measureEvents.updateMeasureCoordinates,
                    stopMeasuring: measureEvents.stopMeasure,
                }, getInteraction);

                trackable({
                    resetTrack: trackerEvents.resetTrack,
                    setCenter: center => viewEvents.updateMapView(
                        { dirty: 'geo', center }),
                    updateTrack: trackerEvents.updateTrack,
                }, getInteraction);

                extractable({
                    setCollection: setExtractCollection,
                }, getInteraction);

                markable({ startMark, endMark }, getInteraction);

                highlightable(getSelected);

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
                geocoder(),
                baseSwitch(),
                scaleline())
        );
    };


export default render;

logger('loaded');
