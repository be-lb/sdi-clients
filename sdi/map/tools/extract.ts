import {
    Collection,
    Feature,
    layer,
    Map,
} from 'openlayers';
import { some, fromNullable } from 'fp-ts/lib/Option';

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

        const update =
            (i: Interaction) =>
                fromInteraction('extract', i)
                    .map(() =>
                        scopeOption()
                            .let('map', fromNullable(mapRef))
                            .let('layers', fromNullable(colRef))
                            .let('extent', getExtent)
                            .map(extractFeatures)
                            .map(setCollection));

        const init =
            (map: Map, layers: Collection<layer.Vector>) => {
                mapRef = map;
                colRef = layers;
            };

        return { init, update };
    };
