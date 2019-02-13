
import { FeatureCollection, Feature, getFeatureProp, MessageRecord, ILayerInfo } from 'sdi/source';
import { DIV, SPAN, H2 } from 'sdi/components/elements';

import { viewEvents, startPointerPosition } from '../../events/map';
import { addBookmark, addBookmarkFromMark, removeBookmark } from '../../events/bookmark';
import { getBookmarks } from '../../queries/bookmark';


export interface BookmarkProperties {
    name: string;
}

export const bookmarkLayerID = '__bookmarks__';
export const bookmarkLayerName: MessageRecord = {
    en: 'Bookmarks',
    fr: 'Bookmarks',
    nl: 'Bookmarks',
};

export const bookmarkLayerInfo: ILayerInfo = {
    id: bookmarkLayerID,
    metadataId: '####',
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
        }, '[TR#Add bookmark]');

export const render =
    () =>
        DIV({
            className: 'bookmark',
        },
            H2({}, '..TR#bookmarks..'),
            renderAddBookmark(),
            ...(getBookmarks().map(renderBookmark)),
        );

export default render;
