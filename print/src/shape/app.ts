
// imports from sdi
import { IUser, IMapBaseLayer } from 'sdi/source';

interface BaseLayerCollection {
    [k: string]: IMapBaseLayer;
}


// State Augmentation
declare module 'sdi/shape' {
    export interface IShape {
        'app/layerId': string | null;
        'app/featureId': string | number | null;
        'app/route': string[];

        'data/user': IUser | null;
        'data/baselayers': BaseLayerCollection;
    }
}
