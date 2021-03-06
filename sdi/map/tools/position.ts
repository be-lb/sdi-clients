import {
    Map,
    MapBrowserEvent,
} from 'openlayers';

import {
    PositionOptions,
    Interaction,
    fromInteraction,
} from '..';


export const position =
    ({ setPosition, stopPosition }: PositionOptions) => {
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

                map.on('singleclick', (event: MapBrowserEvent) => {
                    if (isActive) {
                        stopPosition(event.coordinate);
                    }
                });
            };

        return { init, update };
    };
