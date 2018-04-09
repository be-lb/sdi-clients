import * as debug from 'debug';
import { none, fromNullable } from 'fp-ts/lib/Option';

import { query, subscribe } from 'sdi/shape';
import { MessageRecordLang, TemporalReference, FreeText, isAnchor, isTemporalExtent, Inspire, Keyword } from 'sdi/source';
import tr, { fromRecord, formatDate } from 'sdi/locale';
import { TableDataType, TableDataRow, TableSource } from 'sdi/components/table';

const logger = debug('sdi:queries/metadata');

// metadata list
const loadLayerListKeys =
    () => ([
        tr('layerId'),
        tr('publicationStatus'),
        tr('geometryType'),
        tr('title'),
        tr('temporalReference'),
        // tr('pointOfContact'),
        // tr('responsibleOrganisation'),
    ]);

const loadLayerListTypes =
    (): TableDataType[] => ([
        'string',
        'string',
        'string',
        'string',
        'string',
        // 'string',
        // 'string',
    ]);

export const getTemporalReference = (t: TemporalReference) => {
    if (isTemporalExtent(t)) {
        return formatDate(new Date(Date.parse(t.end)));
    }
    return formatDate(new Date(Date.parse(t.revision)));

};

const getLayerListData =
    (mds: Inspire[]): TableDataRow[] => {

        const getFreeText = (ft: FreeText) => {
            if (isAnchor(ft)) {
                return fromRecord(ft.text);
            }

            return fromRecord(ft);
        };


        return (
            mds.map((md) => {
                const cells = [
                    md.uniqueResourceIdentifier,
                    md.published ? tr('published') : tr('draft'),
                    md.geometryType,
                    getFreeText(md.resourceTitle),
                    getTemporalReference(md.temporalReference),
                    // md.metadataPointOfContact.reduce((acc, poc, idx) => {
                    //     const sep = idx === 0 ? '' : ', ';
                    //     return `${acc}${sep}${poc.contactName}`;
                    // }, ''),
                    // md.responsibleOrganisation.reduce((acc, ri, idx) => {
                    //     const sep = idx === 0 ? '' : '; ';
                    //     return acc + sep + getFreeText(ri.organisationName);
                    // }, ''),
                ];
                return { from: md.id, cells };
            }));
    };

export const getTableSource =
    subscribe('data/datasetMetadata', state => ({
        data: getLayerListData(state),
        keys: loadLayerListKeys(),
        types: loadLayerListTypes(),
    } as TableSource), 'app/lang');


// Keywords


const keywordsKeys =
    () => ([
        tr('label'),
        tr('thesaurus'),
    ]);

const keywordsTypes =
    (): TableDataType[] => ([
        'string',
        'string',
    ]);

const getKeywordsData =
    (kws: Keyword[]): TableDataRow[] =>
        kws.map((kw) => {
            const cells = [
                fromRecord(kw.name),
                fromRecord(kw.thesaurus.name),
            ];
            return { from: kw.id, cells };
        });

export const getKeywordsSource =
    subscribe('data/keywords', state => ({
        data: getKeywordsData(state),
        keys: keywordsKeys(),
        types: keywordsTypes(),
    } as TableSource), 'app/lang');


export const getPersonOfContact =
    (id: number) =>
        fromNullable(query('data/md/poc').find(poc => poc.id === id));

export const getResponsibleOrg =
    (id: number) =>
        fromNullable(query('data/md/org').find(org => org.id === id));


export const getMdForm =
    () => query('component/single');

export const getMdTitle =
    (l: MessageRecordLang) => () => getMdForm().title[l];

export const getMdDescription =
    (l: MessageRecordLang) => () => getMdForm().description[l];

export const formIsSaving =
    () => getMdForm().saving;

export const getMetadataId =
    () => query('app/current-metadata');

export const getDatasetMetadata =
    (id: string) =>
        fromNullable(query('data/datasetMetadata').find(
            md => md.id === id));

export const getCurrentDatasetMetadata =
    () => {
        const id = getMetadataId();
        if (id) {
            return getDatasetMetadata(id);
        }
        return none;
    };

const withoutNull =
    <T>(ts: (T | null)[]) => {
        const r: T[] = [];
        ts.forEach(t => !!t ? r.push(t) : null);
        return r;
    }

export const getKeywordList =
    () => query('data/keywords');

export const getKeywordDataOpt =
    (id: string) => fromNullable(query('data/keywords').find(k => k.id === id));

export const getKeywords =
    () => withoutNull(
        getMdForm()
            .keywords.map(getKeywordDataOpt)
            .map(o => o.fold(null, k => k)));

export const isSelectedKeyword =
    (id: string) => getMdForm().keywords.indexOf(id) >= 0;


export const getTopicList =
    () => query('data/topics');

export const getTopicDataOpt =
    (id: string) => fromNullable(query('data/topics').find(k => k.id === id));

export const getTopics =
    () => withoutNull(
        getMdForm()
            .topics.map(getTopicDataOpt)
            .map(o => o.fold(null, k => k)));

export const isSelectedTopic =
    (id: string) => getMdForm().topics.indexOf(id) >= 0;


logger('loaded');
