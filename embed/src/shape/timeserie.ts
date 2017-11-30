
import {
    ITimeserieInteractive,
    ITimeserieCollection,
} from 'sdi/components/timeserie';

declare module 'sdi/shape' {
    export interface IShape {
        'component/timeserie': ITimeserieInteractive;
        'data/timeseries': ITimeserieCollection;
    }
}
