
// imports from sdi
import {
    IUser, Feature,
    IMapBaseLayer,
} from 'sdi/source';

interface BaseLayerCollection {
    [k: string]: IMapBaseLayer;
}

export type AppLayout = 'map' | 'map-and-feature';

// State Augmentation
declare module 'sdi/shape' {
    export interface IShape {
        'app/layout': AppLayout;
        'app/layerId': string | null;
        'app/featureId': string | number | null;
        'app/current-feature': Feature | null;
        'app/route': string[];

        'data/user': IUser | null;
        'data/baselayers': BaseLayerCollection;
    }
}
