import { Inspire } from 'sdi/source';

export type AppLayout =
    | 'List'
    | 'Single';

export interface IDatasetMetadataCollection {
    [id: string]: Inspire;
}
