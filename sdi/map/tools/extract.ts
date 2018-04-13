import {
    Collection,
    Feature,
    layer,
    Map,
    Extent,
} from 'openlayers';
import { some, none, fromNullable } from 'fp-ts/lib/Option';

import { scopeOption } from '../../lib/scope';
import {
    ExtractOptions,
    Interaction,
    fromInteraction,
    ExtractFeature,
} from '../index';


interface FeatureExtract {
    lid: string;
    fs: Feature[];
}

interface MapAndLayers {
    map: ol.Map;
    layers: Collection<layer.Vector>;
}

interface MapAndLayersAndExtent extends MapAndLayers {
    extent: [number, number, number, number];
}

const getExtent =
    ({ map }: MapAndLayers) =>
        some(
            map.getView()
                .calculateExtent(map.getSize()));

const sameExtent =
    (e1: Extent, e2: Extent) =>
        e1[0] === e2[0] && e1[1] === e2[1] && e1[2] === e2[2] && e1[3] === e2[3];

const fromExtract =
    ({ fs, lid }: FeatureExtract): ExtractFeature[] =>
        fs.map(f => ({
            layerId: lid,
            featureId: f.getId(),
        }));

const extractFeatures =
    ({ layers, extent }: MapAndLayersAndExtent) =>
        layers.getArray()
            .map(l => ({
                lid: l.get('id'),
                fs: l.getSource().getFeaturesInExtent(extent),
            }))
            .reduce<ExtractFeature[]>(
                (acc, fe) => acc.concat(fromExtract(fe)),
                []);

export const extract =
    ({ setCollection }: ExtractOptions) => {
        let mapRef: ol.Map;
        let colRef: Collection<layer.Vector>;
        let lastExtent: Extent = [0, 0, 0, 0];

        const update =
            (i: Interaction) =>
                fromInteraction('extract', i)
                    .foldL(
                        () => { lastExtent = [0, 0, 0, 0]; },
                        () =>
                            scopeOption()
                                .let('map', fromNullable(mapRef))
                                .let('layers', fromNullable(colRef))
                                .let('extent', getExtent)
                                .let('shouldUpdate', ({ extent }) => {
                                    const su = !sameExtent(lastExtent, extent);
                                    if (su) {
                                        lastExtent = extent;
                                        return some(true);
                                    }
                                    return none;
                                })
                                .map(extractFeatures)
                                .map(setCollection));

        const init =
            (map: Map, layers: Collection<layer.Vector>) => {
                mapRef = map;
                colRef = layers;
            };

        return { init, update };
    };
