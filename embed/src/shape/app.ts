
// imports from sdi
import { IUser } from 'sdi/source';


// State Augmentation
declare module 'sdi/shape' {
    export interface IShape {
        'app/layerId': string | null;
        'app/featureId': string | number | null;
        'app/route': string[];

        'data/user': IUser | null;
    }
}
