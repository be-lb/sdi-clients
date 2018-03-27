
import * as debug from 'debug';
import { fromNullable } from 'fp-ts/lib/Option';

import { query, queryK, subscribe } from 'sdi/shape';
import { TemporalReference, FreeText, isAnchor, isTemporalExtent, Inspire } from 'sdi/source';
import tr, { fromRecord, formatDate } from 'sdi/locale';
import { TableDataType, TableDataRow, TableSource, tableQueries } from 'sdi/components/table';

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
    } as TableSource));


export const getDatasetMetadata =
    (id: string) =>
        fromNullable(query('data/datasetMetadata').find(
            md => md.id === id));


export const metadataTableQueries =
    tableQueries(queryK('component/table'), getTableSource);

export const getSelectedMetadata =
    () => metadataTableQueries.getSelected();

export const getMetadataRow =
    (idx: number) => metadataTableQueries.getRow(idx);

export const getSelectedMetadataRow =
    () => getMetadataRow(getSelectedMetadata());

export const getPersonOfContact =
    (id: number) =>
        fromNullable(query('data/md/poc').find(poc => poc.id === id));

export const getResponsibleOrg =
    (id: number) =>
        fromNullable(query('data/md/org').find(org => org.id === id));



logger('loaded');
