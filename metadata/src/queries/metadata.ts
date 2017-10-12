import * as debug from 'debug';
import { query } from './index';
import { some, none } from 'fp-ts/lib/Option';
import { TemporalReference, FreeText, isAnchor, isTemporalExtent } from 'sdi/source';
import tr, { fromRecord, formatDate } from '../locale';
import { TableDataType, TableDataRow } from '../components/table/base';

const logger = debug('sdi:queries/metadata');

// metadata list
export const loadLayerListKeys =
    () => ([
        tr('layerId'),
        tr('geometryType'),
        tr('title'),
        tr('temporalReference'),
        tr('pointOfContact'),
        tr('responsibleOrganisation'),
    ]);

export const loadLayerListTypes =
    (): TableDataType[] => ([
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
    ]);

export const loadLayerListData =
    (): TableDataRow[] | null => {
        const mds = query('data/datasetMetadata');
        const keys = Object.keys(mds);
        if (keys.length < 1) {
            return null;
        }
        const getFreeText = (ft: FreeText) => {
            if (isAnchor(ft)) {
                return fromRecord(ft.text);
            }

            return fromRecord(ft);
        };

        const getTemporalReference = (t: TemporalReference) => {
            if (isTemporalExtent(t)) {
                return formatDate(new Date(Date.parse(t.end)));
            }
            return formatDate(new Date(Date.parse(t.revision)));

        };

        return (
            keys.map((id) => {
                const md = mds[id];
                const cells = [
                    md.uniqueResourceIdentifier,
                    md.geometryType,
                    getFreeText(md.resourceTitle),
                    getTemporalReference(md.temporalReference),
                    md.metadataPointOfContact.reduce((acc, poc, idx) => {
                        const sep = idx === 0 ? '' : ', ';
                        return `${acc}${sep}${poc.contactName}`;
                    }, ''),
                    md.responsibleOrganisation.reduce((acc, ri, idx) => {
                        const sep = idx === 0 ? '' : '; ';
                        return acc + sep + getFreeText(ri.organisationName);
                    }, ''),
                ];
                return { from: id, cells };
            }));
    };

export const getMdTitle =
    (l: 'fr' | 'nl') => () => query('component/single').title[l];

export const getMdDescription =
    (l: 'fr' | 'nl') => () => query('component/single').description[l];


export const getDatasetMetadata =
    (id: string) => {
        const collection = query('data/datasetMetadata');
        if (id in collection) {
            return some(collection[id]);
        }
        return none;
    };

export const getCurrentDatasetMetadata =
    () => {
        const id = query('app/current-metadata');
        logger(`getCurrentDatasetMetadata ${id}`);
        if (id) {
            return getDatasetMetadata(id);
        }
        logger(`failed ${id}`)
        return none;
    };

logger('loaded');
