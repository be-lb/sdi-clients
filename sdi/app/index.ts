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

import { IShape, dispatch, query } from '../shape';
import { fromNullable } from 'fp-ts/lib/Option';
import { render } from 'react-dom';
import { IStoreInteractions, MessageRecord, ILayerInfo, Inspire } from '../source';

// types

export interface SyntheticLayerInfo {
    name: MessageRecord | null;
    info: ILayerInfo | null;
    metadata: Inspire | null;
}


// queries
export const getUserId = () => fromNullable(query('app/user'));

export const getApiUrl = (path: string) => `${query('app/api-root')}${path}`;

export const getLang = () => query('app/lang');

export const getCSRF = () => fromNullable(query('app/csrf'));

export const getRoot = () => query('app/root');

// events
export const setLang = (l: 'fr' | 'nl') => {
    document.body.setAttribute('lang', l);
    dispatch('app/lang', () => l);
};

export const navigateRoot =
    () => window.location.assign(getRoot());

// main loop

const MIN_FRAME_RATE = 16;


export type RenderMain = () => React.ReactElement<any>;

export const loop =
    (renderMain: RenderMain, effects?: () => void) =>
        (store: IStoreInteractions<IShape>) => {

            let lastFrameRequest: number | null = null;
            let version: number = -1;
            let frameRate = MIN_FRAME_RATE;
            const root = document.createElement('div');
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
                    try {
                        const startRenderTime = performance.now();
                        render(renderMain(), root);
                        const renderTime = performance.now() - startRenderTime;
                        if (renderTime > frameRate) {
                            frameRate = renderTime;
                        }
                        else if (frameRate > MIN_FRAME_RATE) {
                            frameRate -= 1;
                        }
                    }
                    catch (err) {
                        throw err;
                        // requestAnimationFrame(updateState);
                    }
                }
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
