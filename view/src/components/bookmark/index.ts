
import { FeatureCollection, Feature, getFeatureProp } from 'sdi/source';
import { DIV, SPAN, H2 } from 'sdi/components/elements';

import { viewEvents, startPointerPosition } from '../../events/map';
import { addBookmark, addBookmarkFromMark } from '../../events/bookmark';
import { getBookmarks } from '../../queries/bookmark';


export interface BookmarkProperties {
    name: string;
}

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
            }, 'center-on'));

const renderAddBookmark =
    () =>
        DIV({
            className: 'bookmark-add',
            onClick: () => addBookmarkFromMark().mapLeft(
                () => startPointerPosition(addBookmark),
            ),
        }, 'TR#Add bookmark');

export const render =
    () =>
        DIV({
            className: 'bookmark',
        },
            H2({}, 'TR#bookmarks'),
            renderAddBookmark(),
            ...(getBookmarks().map(renderBookmark)),
        );

export default render;
