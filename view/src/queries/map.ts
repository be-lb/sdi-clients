
import { fromNullable, none, some } from 'fp-ts/lib/Option';
import { mapOption } from 'fp-ts/lib/Array';

import { query, queryK } from 'sdi/shape';
import { measureQueryFactory, fromInteraction } from 'sdi/map';
import tr from 'sdi/locale';

import appQueries from './app';
import { TableSource, TableDataType, TableDataRow, tableQueries } from 'sdi/components/table';
import { IMapInfo } from 'sdi/source';




export const getView = queryK('port/map/view');

// export const getAllBaseLayers = queryK('port/map/baseLayers');

export const getScaleLine = queryK('port/map/scale');

export const getLoading = queryK('port/map/loading');


export const getMapExtent =
    () => fromNullable(getView().extent);

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

export const getPointerPosition =
    () => fromInteraction('position', getInteraction());

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
            [],
            ({ state }) => state.map(e => ({
                from: e.featureId.toString(),
                cells: [
                    e.featureId.toString(),
                    e.layerId,
                ],
            })),
        );

const getExtractSource =
    (): TableSource => ({
        data: getExtractData(),
        keys: getExtractKeys(),
        types: getExtractTypes(),
    });

export const extractTableQueries = tableQueries(
    queryK('component/table/extract'), getExtractSource);


export const getPrintRequest =
    queryK('port/map/printRequest');
export const getPrintResponse =
    queryK('port/map/printResponse');


export type LinkDirection = 'forward' | 'backward';

const formatLink =
    (maps: IMapInfo[]) => (mid: string) =>
        fromNullable(maps.find(m => m.id === mid));


export const getLinks =
    (ld: LinkDirection) => {
        const mid = query('app/current-map');
        const links = query('data/links');
        if (mid === null || !(mid in links)) {
            return none;
        }

        const fm = formatLink(query('data/maps'));
        const mids = links[mid]
            .filter((link => mid === (ld === 'forward' ? link.source : link.target)))
            .map(link => (ld === 'forward' ? link.target : link.source));
        return some(mapOption(mids, fm));
    };
