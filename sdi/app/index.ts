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

import { IShape } from '../shape';
import { render } from 'react-dom';
import { IStoreInteractions, MessageRecord, ILayerInfo, Inspire } from '../source';
import { getLang } from './queries';

export * from './queries';
export * from './events';
export * from './rect';

const logger = debug('sdi:sdi/app');

// types

export interface SyntheticLayerInfo {
    name: MessageRecord | null;
    info: ILayerInfo | null;
    metadata: Inspire | null;
}


// main loop

const MIN_FRAME_RATE = 16;


export type RenderMain = () => React.ReactElement<any>;

export const loop =
    (name: string, renderMain: RenderMain, effects?: () => void) =>
        (store: IStoreInteractions<IShape>) => {

            let lastFrameRequest: number | null = null;
            let version: number = -1;
            let frameRate = MIN_FRAME_RATE;
            const root = document.createElement('div');
            root.setAttribute('class', `root ${name}`);
            document.body.appendChild(root);


            const updateState = (ts: number) => {
                let offset: number = 0;
                const stateVersion = store.version();
                if (lastFrameRequest !== null) {
                    offset = ts - lastFrameRequest;
                }
                else {
                    lastFrameRequest = ts;
                }

                if (offset >= frameRate && (version !== stateVersion)) {
                    version = stateVersion;
                    lastFrameRequest = ts;
                    // try {
                    // logger(`render ${version}`);
                    const startRenderTime = performance.now();
                    render(renderMain(), root);
                    const renderTime = performance.now() - startRenderTime;
                    if (renderTime > frameRate) {
                        frameRate = renderTime;
                    }
                    else if (frameRate > MIN_FRAME_RATE) {
                        frameRate = Math.max(frameRate - 6, MIN_FRAME_RATE);
                    }
                    // }
                    // catch (err) {
                    //     throw err;
                    // requestAnimationFrame(updateState);
                    // }
                }
                else if (version === stateVersion) {
                    // logger(`no render ${version}`);
                    if (frameRate > MIN_FRAME_RATE) {
                        frameRate = Math.max(frameRate - 6, MIN_FRAME_RATE);
                    }
                }
                // logger(`framerate ${frameRate}`)
                requestAnimationFrame(updateState);
            };

            const start = () => {
                document.body.setAttribute('lang', getLang());
                requestAnimationFrame(updateState);
                if (effects) {
                    effects();
                }
            };

            return start;
        };

logger('loaded');
