import { IMapBaseLayer, Feature, Properties, FeatureCollection } from '../source';
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

export const uniqIdGen = (prefix = '') => {
    let counter = 0;
    return () => {
        counter += 1;
        return `${prefix}${counter}`;
    };
};

export const uniqId = uniqIdGen('sdi-');

const APP_ID_KEY = '__app_id__';

export const addAppIdToFeature = (f: Feature) => {
    f.properties = {
        [APP_ID_KEY]: uniqId(),
        ...f.properties,
    };
};

const FEATURE_PROPS_BLACKLIST = new Set([APP_ID_KEY]);

export const getFeatureProperties = (f: Feature): Properties => {
    const props = f.properties;
    if (!props) {
        return null;
    }
    return (
        Object.keys(props).reduce<Properties>((acc, k) => {
            if (FEATURE_PROPS_BLACKLIST.has(k)) {
                return acc;
            }
            return {
                [k]: props[k],
                ...acc,
            };
        }, {}));
};


export const getLayerPropertiesKeys = (fc: FeatureCollection): string[] => {
    if (fc.features.length === 0) {
        return [];
    }
    const f = fc.features[0];
    const props = f.properties;
    if (!props) {
        return [];
    }
    return (
        Object.keys(props).reduce<string[]>((acc, k) => {
            if (FEATURE_PROPS_BLACKLIST.has(k)) {
                return acc;
            }
            acc.push(k);
            return acc;
        }, []));
};

