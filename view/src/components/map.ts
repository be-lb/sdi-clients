
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
import { DIV } from './elements';
import { create } from '../ports/map';
import mapQueries from '../queries/map';
import appEvents from '../events/app';

const logger = debug('sdi:comp/map');
// const mapId = 'be-sdi-this-is-the-map';

let mapSetTarget: (t: string | Element | undefined) => void;
let mapUpdate: () => void;


const scaleline =
    () => {
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

const attachMap =
    () =>
        (element: Element | null) => {
            // logger(`attachMap ${typeof element}`);
            if (!mapUpdate) {
                const { update, setTarget } = create();
                mapSetTarget = setTarget;
                mapUpdate = update;
                appEvents.signalReadyMap();
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
            DIV({ className: 'map-wrapper' },
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
