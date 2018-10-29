import * as debug from 'debug';

const logger = debug('sdi:map/singleclick');

import {
    Map,
    MapBrowserEvent,
} from 'openlayers';

import {
    SingleClickOptions,
    Interaction,
    fromInteraction,
} from '..';


export const singleclick =
    ({ setPosition }: SingleClickOptions) => {
        let isActive = false;

        const update =
            (i: Interaction) =>
                fromInteraction('singleclick', i)
                    .foldL(
                        () => {
                            isActive = false;
                        },
                        () => {
                            isActive = true;
                        });

        const init =
            (map: Map) => {
                map.on('singleclick', (event: MapBrowserEvent) => {
                    logger(`hit ${isActive}`);
                    if (isActive) {
                        setPosition(event.coordinate);
                    }
                });
            };

        return { init, update };
    };


logger('loaded');
