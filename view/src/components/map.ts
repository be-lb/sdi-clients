
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

import { DIV, SPAN, H2 } from 'sdi/components/elements';
import { renderScaleline } from 'sdi/map/controls';
import { create, IMapOptions } from 'sdi/map';
import tr, { fromRecord } from 'sdi/locale';
import { MessageRecord } from 'sdi/source';

import appQueries from '../queries/app';
import appEvents from '../events/app';
import {
    getView,
    getScaleLine,
    getInteraction,
    getInteractionMode,
    getLoading,
} from '../queries/map';
import {
    viewEvents,
    scalelineEvents,
    measureEvents,
    trackerEvents,
    setExtractCollection,
    startMark,
    endMark,
    updateLoading,
} from '../events/map';
import { AppLayout } from '../shape/types';

import geocoder from './legend-tools/geocoder';
// import baseSwitch from './base-layer-switch';

const logger = debug('sdi:comp/map');
// const mapId = 'be-sdi-this-is-the-map';


const options: IMapOptions = {
    element: null,
    getBaseLayer: appQueries.getCurrentBaseLayer,
    getMapInfo: appQueries.getMapInfo,
    getView,

    updateView: viewEvents.updateMapView,
    setScaleLine: scalelineEvents.setScaleLine,
    setLoading: updateLoading,
};

let mapSetTarget: (t: Element | null) => void;
let mapUpdate: () => void;


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
        };
    };


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

const renderLoading =
    (ms: MessageRecord[]) => DIV({
        className: `loading-layer-wrapper ${ms.length === 0 ? 'hidden' : ''}`,
    },
        H2({}, tr('loadingData')),
        ms.map(
            r => DIV({
                className: 'loading-layer',
                key: fromRecord(r),
            },
                SPAN({ className: 'loader-spinner' }),
                fromRecord(r))));

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
                renderLoading(getLoading()),
                geocoder(),
                // baseSwitch(),
                renderScaleline(getScaleLine()))
        );
    };


export default render;

logger('loaded');
