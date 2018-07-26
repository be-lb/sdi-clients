import {
    Overlay,
    Map,
} from 'openlayers';
import { fromNullable } from 'fp-ts/lib/Option';

import {
    MarkOptions,
    Interaction,
    fromInteraction,
} from '..';



export const mark =
    ({ endMark, startMark }: MarkOptions) => {
        let mapRef: ol.Map;
        const marker = document.createElement('div');
        marker.setAttribute('class', 'map-marker');
        const overlay = new Overlay({
            positioning: 'center-center',
            element: marker,
        });
        const update =
            (i: Interaction) =>
                fromInteraction('mark', i)
                    .foldL(
                        () => fromNullable(mapRef).map((m) => { m.removeOverlay(overlay); }),
                        ({ state }) => fromNullable(mapRef).map(
                            (m) => {
                                if (state.started) {
                                    if (state.endTime <= Date.now()) {
                                        m.removeOverlay(overlay);
                                        endMark();
                                    }
                                }
                                else {
                                    overlay.setPosition(state.coordinates);
                                    m.addOverlay(overlay);
                                    startMark();
                                }
                            }));

        const init =
            (map: Map) => {
                mapRef = map;
            };

        return { init, update };
    };
