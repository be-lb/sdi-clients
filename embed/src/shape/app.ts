
// imports from sdi
import { IUser } from 'sdi/source';

// imports from your application
import { AppLayout } from '../app';


// State Augmentation
declare module 'sdi/shape' {
    export interface IShape {
        'app/layout': AppLayout;
        'app/layerId': string | null;
        'app/featureId': string | number | null;
        'app/route': string[];

        'data/user': IUser | null;
    }
}
