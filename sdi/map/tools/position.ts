import {
    Map,
    MapBrowserEvent,
} from 'openlayers';

import {
    PositionOptions,
    Interaction,
    fromInteraction,
} from '../index';


export const position =
    ({ setPosition }: PositionOptions) => {
        let isActive = false;

        const update =
            (i: Interaction) =>
                fromInteraction('position', i)
                    .foldL(
                        () => {
                            isActive = false;
                        },
                        () => {
                            isActive = true;
                        });

        const init =
            (map: Map) => {
                map.on('pointermove', (event: MapBrowserEvent) => {
                    if (isActive) {
                        setPosition(event.coordinate);
                    }
                });
            };

        return { init, update };
    };
