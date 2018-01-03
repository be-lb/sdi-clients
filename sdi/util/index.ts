import { IMapBaseLayer, Feature, Properties, FeatureCollection } from '../source';
import { fromRecord } from '../locale';
import { Setoid } from 'fp-ts/lib/Setoid';

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

export const uniq =
    <T>(o: Setoid<T>) =>
        (as: T[]): T[] =>
            as.reduce(
                (acc, a) => acc.filter(i => !o.equals(a, i)).concat([a]),
                [] as T[]);


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



export const getLayerPropertiesKeysFiltered =
    (fc: FeatureCollection, pred: (a: any) => boolean): string[] => {
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
                if (FEATURE_PROPS_BLACKLIST.has(k) || !pred(props[k])) {
                    return acc;
                }
                acc.push(k);
                return acc;
            }, []));
    };



/*
 * implements binary search (recursive)
 *
 * https://en.wikipedia.org/wiki/Binary_search_algorithm
 * Where it's different from general implementation lies in the fact
 * that's the predicate which evaluates rather then numeric comparision.
 * Thus the predicate must know the key.
 *
 * @param min Number minimum value
 * @param max Number maximun value
 * @predicate Function(pivot) a function that evaluates the current mid value a la compareFunction
 * @context Object context to which the predicate is applied
 *
 */

export type BinaryPredicate = (a: number) => number;

export const binarySearch: (a: number, b: number, c: BinaryPredicate) => number =
    (min, max, predicate) => {
        const interval = max - min;
        const pivot = min + (Math.floor(interval / 2));

        if (max === min) {
            return pivot;
        }
        else if (max < min) {
            // throw (new Error('MaxLowerThanMin'));
            return pivot;
        }

        if (predicate(pivot) > 0) {
            return binarySearch(min, pivot, predicate);
        }
        else if (predicate(pivot) < 0) {
            return binarySearch(pivot + 1, max, predicate);
        }
        return pivot;
    }
