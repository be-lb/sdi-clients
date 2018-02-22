
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
    <T>({ getRequest, setResponse }: PrintOptions<T>) => {
        const pendings: PrintResponse<T>[] = [];
        let mapRef: ol.Map;
        let baseLayersRef: Collection<layer.Image>;

        const getResponseFromPendings =
            (id: string) =>
                fromNullable(pendings.find(r => r.id === id));

        const updateResponse =
            (req: PrintRequest<T>) =>
                (id: string, u: Partial<PrintResponse<T>>) => {
                    const idx = pendings.findIndex(r => r.id === id);
                    if (idx >= 0) {
                        const r = pendings[idx];
                        pendings[idx] = {
                            ...r,
                            ...u,
                            props: req.props,
                        };
                        setResponse(pendings[idx]);
                    }
                };

        const startPrint =
            (req: PrintRequest<T>) => {
                const reqId = req.id;
                if (reqId === null) {
                    return;
                }
                const noneResponse: PrintResponse<T> = {
                    id: req.id,
                    data: '',
                    status: 'none',
                    props: req.props,
                };
                pendings.push(noneResponse);
                setResponse(noneResponse);

                const updateResponseWithReq = updateResponse(req);

                scopeOption()
                    .let('map', fromNullable(mapRef))
                    .let('baseLayers', fromNullable(baseLayersRef))
                    .let('base',
                        ({ baseLayers }) => fromNullable(baseLayers.item(0)))
                    .map(({ map, base }) => {
                        const source = base.getSource() as ol.source.ImageWMS;
                        const target = map.getTargetElement() as HTMLElement;
                        const afterResize =
                            () => {
                                map.once('postcompose', (event: any) => {
                                    const canvas: HTMLCanvasElement = event.context.canvas;
                                    source.once('imageloadstart', () => {
                                        updateResponseWithReq(reqId, { status: 'start' });
                                    });

                                    source.once('imageloaderror', () => {
                                        updateResponseWithReq(reqId, { status: 'error' });
                                    });

                                    source.once('imageloadend', () => {
                                        window.setTimeout(() => {
                                            const data = canvas.toDataURL('image/png');
                                            updateResponseWithReq(reqId,
                                                { data, status: 'end' });
                                        }, 100);
                                    });

                                    source.refresh();
                                });

                                map.renderSync();
                            };


                        const size = map.getSize();
                        const extent = map.getView().calculateExtent(size);
                        // logger(`A sz ${size} ; extent ${extent}`);
                        const width = Math.round(req.width * req.resolution / 25.4);
                        const height = Math.round(req.height * req.resolution / 25.4);
                        // const width = Math.round(req.width * req.resolution);
                        // const height = Math.round(req.height * req.resolution);
                        logger(`size ${width}x${height} @${req.resolution}`);
                        target.style.width = `${width}px`;
                        target.style.height = `${height}px`;
                        map.setSize([width, height]);

                        map.getView().fit(extent, {
                            size: [width, height],
                            callback: afterResize,
                        });

                        // logger(`B sz ${map.getSize()} ; extent ${map.getView().calculateExtent(map.getSize())}`);
                    })
                    .foldL(
                        () => logger(`Failed to start print`),
                        () => logger(`Print Started`));

            };

        const update =
            (i: Interaction) =>
                fromInteraction('print', i)
                    .foldL(
                        () => null,
                        () => {
                            const req = getRequest();
                            const reqId = req.id;
                            if (reqId) {
                                getResponseFromPendings(reqId)
                                    .foldL(
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
