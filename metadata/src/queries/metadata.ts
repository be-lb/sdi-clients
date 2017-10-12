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
        tr('publicationStatus'),
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
                    md.published ? tr('published') : tr('draft'),
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

export const getMdForm =
    () => query('component/single');

export const getMdTitle =
    (l: 'fr' | 'nl') => () => getMdForm().title[l];

export const getMdDescription =
    (l: 'fr' | 'nl') => () => getMdForm().description[l];


export const getMetadataId =
    () => query('app/current-metadata');

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
        const id = getMetadataId();
        if (id) {
            return getDatasetMetadata(id);
        }
        return none;
    };

logger('loaded');
