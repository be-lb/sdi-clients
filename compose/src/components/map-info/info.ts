/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as debug from 'debug';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormEvent } from 'react';

import { DIV, H1, P, IMG, INPUT, SPAN } from 'sdi/components/elements';
import { IMapInfo } from 'sdi/source';
import tr, { formatDate, fromRecord } from 'sdi/locale';

import queries from '../../queries/app';
import events, { toDataURL } from '../../events/app';
import mapInfoQueries from '../../queries/map-info';
import mapInfoEvents from '../../events/map-info';
import editable from '../editable';
import { DataUrl, MapInfoIllustrationState } from '../../shape/types';
import { button, remove } from '../button';

const logger = debug('sdi:map-info/info');

let selectedImage: File | null;
let selectedImageDataUrl: DataUrl | null;

const getInfo = <T>(a: (b: IMapInfo) => T, c: T): T => {
    const minfo = queries.getMapInfo();
    if (minfo) {
        return a(minfo);
    }
    return c;
};

const getTitle = () => getInfo(m => m.title, { fr: '', nl: '' });

const getDescription = () => getInfo(m => m.description, { fr: '', nl: '' });

const toP = (p: string) => P({}, p);

const uploadButton = button('upload', 'validate');
const publishButton = button('toggle-off');
const unpublishButton = button('toggle-on');

const renderStatus =
    ({ status }: IMapInfo) => {
        if ('published' === status) {
            return DIV({ className: 'toggle' },
                DIV({ className: 'no-active' }, tr('draft')),
                unpublishButton(() => mapInfoEvents.mapStatus('draft')),
                DIV({ className: 'active' }, tr('published')));
        }
        return DIV({ className: 'toggle' },
            DIV({ className: 'active' }, tr('draft')),
            publishButton(() => mapInfoEvents.mapStatus('published')),
            DIV({ className: 'no-active' }, tr('published')));
    };

const formatTitle = (props: React.ClassAttributes<Element>, title: string) => {
    const isEmpty = title.trim().length === 0;
    const text = isEmpty ? tr('emptyMapTitle') : title;
    return H1(props, text);
};


const formatDescription = (props: React.ClassAttributes<Element>, description: string) => {
    const isEmpty = description.trim().length === 0;
    const elems = isEmpty ? tr('emptyMapDescription') : description.split('\n').map(toP);
    const html = renderToStaticMarkup(DIV({}, ...elems));
    return DIV({
        className: 'map-description',
        dangerouslySetInnerHTML: { __html: html },
        ...props,
    });
};

const clearSelectedImage = () => {
    selectedImage = null;
    selectedImageDataUrl = null;
    mapInfoEvents.showImg();
};

const uploadSelectedImage = () => {
    if (selectedImage !== null) {
        mapInfoEvents.uploadImg(selectedImage);
    }
};

const setSelectedImage = (img: File) => {
    selectedImageDataUrl = null;
    selectedImage = img;

    toDataURL(selectedImage)
        .then((dataUrl: DataUrl) => {
            selectedImageDataUrl = dataUrl;
            mapInfoEvents.showSelectedImg();
        })
        .catch(() => mapInfoEvents.showImg());

    mapInfoEvents.generatingSelectedImgPreview();
};

const renderMapIllustrationToolbar = (src: string | undefined) => {
    const state = mapInfoQueries.getState();

    if (state === MapInfoIllustrationState.showSelectedImage) {
        const clearPreviewButton = remove(`renderMapIllustrationToolbar-clear-${src}`, 'cancel')(() => clearSelectedImage());

        const label = DIV({ className: 'label' }, tr('imagePreview'));

        const validatePreviewButton = uploadButton(() => uploadSelectedImage());

        return DIV({ className: 'uploader-wrapper' },
            clearPreviewButton,
            label,
            validatePreviewButton,
        );
    }
    else if (state === MapInfoIllustrationState.generateSelectedImagePreview) {
        const label = DIV({ className: 'label' }, tr('imageGeneratingPreview'));
        return DIV({ className: 'uploader-wrapper' },
            SPAN({ className: 'loader-spinner' }),
            label);
    }
    else if (state === MapInfoIllustrationState.uploadSelectedImage) {
        const label = DIV({ className: 'label' }, tr('imageUploading'));
        return DIV({ className: 'uploader-wrapper' },
            SPAN({ className: 'loader-spinner' }),
            label);
    }
    else {
        const uploadField = INPUT({
            type: 'file',
            name: 'map-info-illustration-image',
            onChange: (e: FormEvent<HTMLInputElement>) => {
                if (e && e.currentTarget.files && e.currentTarget.files.length > 0) {
                    setSelectedImage(e.currentTarget.files[0]);
                }
                else {
                    clearSelectedImage();
                }
            },
        });

        if (src && src !== '') {
            const removeIllustrationButton = remove(`renderMapIllustrationToolbar-remove-${src}`)(() => events.removeMapInfoIllustration());

            const label = DIV({ className: 'label' }, tr('mapInfoChangeIllustration'));

            return DIV({ className: 'uploader-wrapper' },
                removeIllustrationButton,
                label,
                uploadField,
            );
        }
        else {
            const label = DIV({ className: 'label' }, tr('mapInfoAddIllustration'));

            return DIV({ className: 'uploader-wrapper' },
                label,
                uploadField,
            );
        }

    }
};


const renderMapIllustrationImg = (src: DataUrl | string | undefined | null) => {
    const state = mapInfoQueries.getState();
    let className = '';

    if (state === MapInfoIllustrationState.showSelectedImage
        || state === MapInfoIllustrationState.uploadSelectedImage) {
        className = 'preview';
        src = selectedImageDataUrl;
        if (src) {
            return DIV({ className: 'map-illustration' }, IMG({ className, src }));
        }
        else {
            return DIV({ className: 'map-illustration' }, IMG({ className }));
        }
    }
    else if (state === MapInfoIllustrationState.generateSelectedImagePreview) {
        return DIV({ className: 'empty-image' }, '');
    }
    else if (src && src !== '') {
        return DIV({ className: 'map-illustration' }, IMG({ className, src }));
    }
    else {
        return DIV({ className: 'empty-image' }, '');
    }
};


const renderMapIllustration = (src: string | undefined) => {
    return DIV({ className: 'editable-wrapper' },
        DIV({ className: 'map-illustration' },
            renderMapIllustrationImg(src),
            renderMapIllustrationToolbar(src)));
};


const hasCategory =
    (c: string, info: IMapInfo) => info.categories.indexOf(c) >= 0;

const renderCategories =
    (info: IMapInfo) => {
        const categories = queries.getCategories();
        const elements = categories.map((cat) => {
            if (hasCategory(cat.id, info)) {
                return (
                    DIV({
                        className: 'category selected interactive',
                        onClick: () => events.removeCategory(cat.id),
                    }, fromRecord(cat.name)));
            }
            return (
                DIV({
                    className: 'category interactive',
                    onClick: () => events.addCategory(cat.id),
                }, fromRecord(cat.name)));
        });

        return (
            DIV({ className: 'category-wrapper' }, ...elements));
    };

const render =
    (mapInfo: IMapInfo) => (
        DIV({ className: 'map-infos' },
            renderCategories(mapInfo),
            renderStatus(mapInfo),

            editable(`map_info_title`, getTitle, events.setMapTitle, formatTitle)(),

            DIV({ className: 'map-date' },
                DIV({ className: 'map-date-label' }, tr('lastModified')),
                DIV({ className: 'map-date-value' },
                    formatDate(new Date(mapInfo.lastModified)))),

            renderMapIllustration(mapInfo.imageUrl),

            editable(`map_info_description`, getDescription, events.setMapDescription, formatDescription)())
    );

export default render;

logger('loaded');
