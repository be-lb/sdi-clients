
import { FeatureCollection, Feature, getFeatureProp, MessageRecord, ILayerInfo, Inspire } from 'sdi/source';
import { DIV, SPAN, H2 } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { viewEvents, startPointerPosition } from '../../events/map';
import { addBookmark, addBookmarkFromMark, removeBookmark } from '../../events/bookmark';
import { getBookmarks } from '../../queries/bookmark';


export interface BookmarkProperties {
    name: string;
}

export const bookmarkLayerID = '__bookmarks_info__';
export const bookmarkMetadataID = '__bookmarks_meta__';
export const bookmarkLayerName: MessageRecord = {
    en: 'Bookmarks',
    fr: 'Bookmarks',
    nl: 'Bookmarks',
};

export const bookmarkLayerInfo: ILayerInfo = {
    id: bookmarkLayerID,
    metadataId: bookmarkMetadataID,
    visible: true,
    featureViewOptions: { type: 'default' },
    style: {
        kind: 'point-simple',
        marker: {
            codePoint: 0xf005,
            color: 'black',
            size: 20,
        },
    },
    group: null,
    legend: null,
};


export const bookmarkMetadata: Inspire = {
    id: bookmarkMetadataID,
    uniqueResourceIdentifier: bookmarkLayerID,
    resourceTitle: bookmarkLayerName,
    geographicBoundingBox: { east: 0, west: 0, south: 0, north: 0 },
    keywords: [],
    geometryType: 'Point',
    metadataDate: '',
    metadataPointOfContact: [],
    published: false,
    resourceAbstract: { fr: '', nl: '', en: '' },
    responsibleOrganisation: [],
    temporalReference: { revision: '' },
    topicCategory: [],
};

export const defaultBookmarks =
    (): FeatureCollection => ({
        features: [],
        type: 'FeatureCollection',
    });


const renderBookmark =
    (f: Feature) =>
        DIV({
            className: 'bookmark',
        },
            SPAN({ className: 'bookmark-name' }, getFeatureProp(f, 'name', '~')),
            SPAN({
                className: 'bookmark-pos',
                onClick: () => viewEvents.updateMapView({
                    dirty: 'geo/feature',
                    feature: f,
                }),
            }, '[ICON#center-on]'),
            SPAN({
                className: 'bookmark-remove',
                onClick: () => removeBookmark(getFeatureProp(f, 'name', '~')),
            }, '[ICON#remove]'));

const renderAddBookmark =
    () =>
        DIV({
            className: 'bookmark-add',
            onClick: () => addBookmarkFromMark().mapLeft(
                () => startPointerPosition(addBookmark),
            ),
        }, tr('addBookmark'));

export const render =
    () =>
        DIV({
            className: 'bookmark',
        },
            H2({}, tr('bookmarks')),
            renderAddBookmark(),
            ...(getBookmarks().features.map(renderBookmark)),
        );

export default render;
