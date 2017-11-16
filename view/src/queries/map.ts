
import { query, queryK } from 'sdi/shape';
import { measureQueryFactory, fromInteraction } from 'sdi/map';
import tr from 'sdi/locale';

import appQueries from './app';
import { TableSource, TableDataType, TableDataRow, tableQueries } from 'sdi/components/table';




export const getView =
    () => query('port/map/view');

export const getAllBaseLayers =
    () => query('port/map/baseLayers');

export const getScaleLine =
    () => query('port/map/scale');

export const getBaseLayer =
    () => {
        const mapInfo = appQueries.getMapInfo();
        if (mapInfo) {
            return mapInfo.baseLayer;
        }
        return null;
    };

export const getInteraction = queryK('port/map/interaction');
export const measureQueries = measureQueryFactory(getInteraction);

export const getInteractionMode = () => getInteraction().label;

const getExtractKeys =
    () => [
        tr('identifier'),
        tr('layerId'),
    ];

const getExtractTypes =
    (): TableDataType[] => ['string', 'string'];


export const withExtract =
    () => fromInteraction(
        'extract', query('port/map/interaction'));

const getExtractData =
    (): TableDataRow[] =>
        withExtract().fold(
            () => [],
            ({ state }) => state.map(e => ({
                from: e.featureId.toString(),
                cells: [
                    e.featureId.toString(),
                    e.layerId,
                ]
            }))
        )

const getExtractSource =
    (): TableSource => ({
        data: getExtractData(),
        keys: getExtractKeys(),
        types: getExtractTypes(),
    });

export const extractTableQueries = tableQueries(
    queryK('component/table/extract'), getExtractSource);


