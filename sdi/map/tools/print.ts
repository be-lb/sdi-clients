
import * as debug from 'debug';
import {
    Map, Collection, layer,
} from 'openlayers';
import { fromNullable } from 'fp-ts/lib/Option';

import {
    PrintRequest,
    PrintResponse,
    PrintOptions,
    fromInteraction,
    Interaction,
} from '../index';
import { scopeOption } from '../../lib/scope';

const logger = debug('sdi:map/print');


export const print =
    ({ getRequest, setResponse }: PrintOptions) => {
        const pendings: PrintResponse[] = [];
        let mapRef: ol.Map;
        let baseLayersRef: Collection<layer.Image>;

        const getResponseFromPendings =
            (id: string) =>
                fromNullable(pendings.find(r => r.id === id));

        const updateResponse =
            (id: string, u: Partial<PrintResponse>) => {
                const idx = pendings.findIndex(r => r.id === id);
                if (idx >= 0) {
                    const r = pendings[idx];
                    pendings[idx] = {
                        ...r,
                        ...u,
                    };
                    setResponse(pendings[idx]);
                }
            };

        const startPrint =
            (req: PrintRequest) => {
                const reqId = req.id;
                if (reqId === null) {
                    return;
                }
                const noneResponse: PrintResponse = {
                    id: req.id,
                    data: '',
                    status: 'none',
                };
                pendings.push(noneResponse);
                setResponse(noneResponse);


                scopeOption()
                    .let('map', fromNullable(mapRef))
                    .let('baseLayers', fromNullable(baseLayersRef))
                    .let('base',
                    ({ baseLayers }) => fromNullable(baseLayers.item(0)))
                    .map(({ map, base }) => {
                        const source = base.getSource() as ol.source.ImageWMS;
                        map.once('postcompose', (event: any) => {
                            const canvas: HTMLCanvasElement = event.context.canvas;

                            source.once('imageloadstart', () => {
                                updateResponse(reqId, { status: 'start' });
                            });

                            source.once('imageloaderror', () => {
                                updateResponse(reqId, { status: 'error' });
                            });

                            source.once('imageloadend', () => {
                                window.setTimeout(() => {
                                    const data = canvas.toDataURL('image/png');
                                    updateResponse(reqId,
                                        { data, status: 'end' });
                                }, 100);
                            });
                        });


                        const size = map.getSize();
                        const extent = map.getView().calculateExtent(size);
                        logger(`A sz ${size} ; extent ${extent}`);
                        const width = Math.round(req.width * req.resolution / 25.4);
                        const height = Math.round(req.height * req.resolution / 25.4);
                        map.setSize([width, height]);
                        map.getView().fit(extent, {
                            size: [width, height],
                        });
                        map.renderSync();
                        logger(`B sz ${map.getSize()} ; extent ${map.getView().calculateExtent(map.getSize())}`);
                    });

            };

        const update =
            (i: Interaction) =>
                fromInteraction('print', i)
                    .fold(
                    () => null,
                    () => {
                        const req = getRequest();
                        const reqId = req.id;
                        if (reqId) {
                            getResponseFromPendings(reqId)
                                .fold(
                                () => startPrint(req),
                                () => null);
                        }
                    });

        const init =
            (map: Map, baseLayers: Collection<layer.Image>) => {
                mapRef = map;
                baseLayersRef = baseLayers;
            };

        return { init, update };
    };


logger('loaded');
