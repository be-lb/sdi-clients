
// imports from sdi
import { IUser, IMapBaseLayer } from 'sdi/source';

// from components
import { PrintState } from '../components/print';

interface BaseLayerCollection {
    [k: string]: IMapBaseLayer;
}


// State Augmentation
declare module 'sdi/shape' {
    export interface IShape {
        'app/layerId': string | null;
        'app/featureId': string | number | null;
        'app/route': string[];

        'component/print': PrintState;

        'data/user': IUser | null;
        'data/baselayers': BaseLayerCollection;
    }
}
