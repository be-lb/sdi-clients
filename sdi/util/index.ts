import { IMapBaseLayer } from '../source';
import { fromRecord } from '../locale';

export interface IMapBaseLayerTranslated {
    name: string;
    srs: string;
    params: {
        LAYERS: string;
        VERSION: string;
    };
    url: string;
}

export const hashMapBaseLayer = (l: IMapBaseLayer) => {
    return `${fromRecord(l.name)}|${fromRecord(l.url)}|${fromRecord(l.params.LAYERS)}`;
};


export const translateMapBaseLayer = (l: IMapBaseLayer): IMapBaseLayerTranslated => ({
    name: fromRecord(l.name),
    srs: l.srs,
    params: {
        LAYERS: fromRecord(l.params.LAYERS),
        VERSION: l.params.VERSION,
    },
    url: fromRecord(l.url),
});

