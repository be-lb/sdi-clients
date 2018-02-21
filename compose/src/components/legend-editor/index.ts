

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
import { fromNullable } from 'fp-ts/lib/Option';

import { DIV, H1, SPAN } from 'sdi/components/elements';
import { inputNumber } from 'sdi/components/input';
import tr, { fromRecord } from 'sdi/locale';
import { StyleConfig, SubType } from 'sdi/source';

import queries from '../../queries/legend-editor';
import events from '../../events/legend-editor';
import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import * as featureConfigEvents from '../../events/feature-config';
import selectMain from './select-main';
import selectType from './select-type';
import toolsMain from './tools-main';
import continuous from './select-item-continuous';
import discrete from './select-item-discrete';
import { AppLayout } from '../../shape/types';
import { button, remove } from '../button';
import editable from '../editable';
import { renderLabelOnly } from './tool-point';
import { MessageRecord } from '../../sdi/source/io/io';

const logger = debug('sdi:legend-editor');

export type LegendPage = 'legend' | 'tools';

export type PointConfigSelected = 'label' | 'marker';

export interface ILegend {
    currentPage: LegendPage;
}


export interface ILegendEditor {
    mainSelected: number;
    itemSelected: number;
    styleGroupSelected: number;
    styleGroupEditedValue: string | null;
    pointConfig: PointConfigSelected;
    autoClassValue: number;
}


export const initialLegendEditorState = (): ILegendEditor => ({
    mainSelected: -1,
    itemSelected: -1,
    styleGroupSelected: -1,
    pointConfig: 'marker',
    styleGroupEditedValue: null,
    autoClassValue: 2,
});


const closeButton = button('close');
const featureEditButton = button('layerInfoSettings');
const switchTableButton = button('layerInfoSwitchTable');
const switchMapButton = button('layerInfoSwitchMap');

const renderHeader =
    (legendType: SubType, _lid: string, _propName: string) => {

        const titleComps: React.ReactNode[] = [
            DIV({ className: 'app-title' }, tr('legendBuilder')),
            renderLegendType(legendType),
        ];


        return (
            DIV({ className: 'app-split-header' },
                DIV({ className: 'app-split-title' },
                    ...titleComps),
                DIV({ className: 'app-split-tools' },
                    // Close
                    closeButton(
                        () => { appEvents.setLayout(AppLayout.MapAndInfo); })))
        );
    };


const renderMapTableSwitch = () => {
    const l = appQueries.getLayout();
    if (AppLayout.LegendEditor === l) {
        return (
            switchTableButton(() => {
                appEvents.setLayout(AppLayout.LegendEditorAndTable);
            }, 'table')
        );
    }
    return (
        switchMapButton(() => {
            appEvents.setLayout(AppLayout.LegendEditor);
        }, 'map')
    );
};

const renderLegendType = (legendType: SubType) => {
    if (legendType === 'simple') {
        return (
            DIV({ className: 'legend-type' },
                // SPAN({ className: 'legend-type-label' }, tr('legendType')),
                SPAN({ className: 'legend-type-value' }, tr('legendTypeSimple')),
            )
        );
    }
    else {
        const label = (legendType === 'continuous') ? tr('legendTypeContinuous') : tr('legendTypeDiscrete');

        return (
            DIV({ className: 'legend-type' },
                // SPAN({ className: 'legend-type-label' }, tr('legendType')),
                SPAN({ className: 'legend-type-value' }, label))
        );
    }
};

const getInfo =
    (lid: string) => {
        const { info } = appQueries.getLayerInfo(lid);
        return fromNullable(info);
    };


const renderLabel =
    (lid: string) =>
        getInfo(lid).fold(
            DIV(),
            (info) => {
                const getLabel =
                    () =>
                        info.legend !== null ? info.legend : { fr: '', nl: '' };
                const setLabel =
                    (r: MessageRecord) =>
                        events.setLegendLabel(lid, r);

                const input = editable(
                    `layer_legend_label_${lid}`, getLabel, setLabel,
                    (props, label: string) => {
                        const isEmpty = label.trim().length === 0;
                        const text = isEmpty ? tr('layerLegendDefaultLabel') : label;
                        return DIV(props, text);
                    });

                return DIV({ className: 'legend-label' }, input());
            });


const renderZoomRange =
    (lid: string) => {
        const { info } = appQueries.getLayerInfo(lid);
        if (info) {
            const getMin =
                () => getInfo(lid).fold(0, i => i.minZoom || 0);
            const getMax =
                () => getInfo(lid).fold(0, i => i.maxZoom || 30);
            const setMin =
                (n: number) => {
                    events.setZoomRange(lid, n, getMax());
                };
            const setMax =
                (n: number) => {
                    events.setZoomRange(lid, getMin(), n);
                };
            const minInput = inputNumber(
                getMin, setMin, { key: `min-zoom-${lid}` });
            const maxInput = inputNumber(
                getMax, setMax, { key: `max-zoom-${lid}` });

            return (
                DIV({ className: 'zoom-range' },
                    DIV({ className: 'zoom-range-input-box' },
                        DIV({ className: 'label' }, tr('minZoom')),
                        minInput),
                    DIV({ className: 'zoom-range-input-box' },
                        DIV({ className: 'label' }, tr('maxZoom')),
                        maxInput))
            );
        }
        return DIV();
    };

const renderLayerInfo = (lid: string, _style: StyleConfig) => {
    const gt = queries.getGeometryType();
    const { name, metadata } = appQueries.getLayerInfo(lid);
    if (name && metadata) {
        const resetButton = remove(
            `renderLayerInfo-${lid}`);
        const layerName = fromRecord(name);
        const legendType = queries.getLegendType();
        const contents = [];
        const buttons = [];


        buttons.push(renderMapTableSwitch());
        buttons.push(featureEditButton(() => {
            featureConfigEvents.resetEditor();
            appEvents.setLayout(AppLayout.FeatureConfig);
        }));
        if ('simple' !== legendType) {
            buttons.push(resetButton(events.resetLegend));
        }

        contents.push(H1({}, SPAN({}, layerName)));
        contents.push(DIV({ className: 'layer-info-btns' }, ...buttons));
        contents.push(renderLabel(lid));
        contents.push(renderZoomRange(lid));
        if (('simple' !== legendType) && ('Point' === gt || 'MultiPoint' === gt)) {
            contents.push(
                DIV({ className: 'column-toolbox' },
                    DIV({ className: 'help' }, tr('pointLabelHelp')),
                    renderLabelOnly()));
        }

        return DIV({ className: 'app-col-main info-main' }, ...contents);
    }

    return [DIV()];
};

const wrapLeft =
    (title: string, ...children: React.ReactNode[]): React.ReactNode => (
        DIV({ className: 'app-col-wrapper layer-infos' },
            DIV({ className: 'app-col-header' },
                DIV({ className: 'title' }, title)),
            ...children)
    );

const wrapCenter =
    (title: string, ...children: React.ReactNode[]): React.ReactNode => (
        DIV({ className: 'app-col-wrapper picker' },
            DIV({ className: 'app-col-header' },
                DIV({ className: 'title' }, title)),
            ...children)
    );

const wrapRight =
    (title: string, ...children: React.ReactNode[]): React.ReactNode => (
        DIV({ className: 'app-col-wrapper settings' },
            DIV({ className: 'app-col-header' },
                DIV({ className: 'title' }, title)),
            ...children)
    );


const renderBody = (lid: string) => {
    const style = queries.getStyle();
    const legendType = queries.getLegendType();

    if (style !== null) {
        const info = renderLayerInfo(lid, style);

        if (legendType === 'simple') {
            return DIV({ className: 'app-split-main' },
                wrapLeft(tr('legendInfoHeader'), info),
                wrapCenter(tr('legendTypeSelect'), selectType()),
                wrapRight(tr('style'), toolsMain()));
        }
        else {
            const propName = queries.getSelectedMainName();
            if (propName === '') {
                return DIV({ className: 'app-split-main' },
                    wrapLeft(tr('legendInfoHeader'), info),
                    wrapCenter(tr('legendTypeSelect'), selectType()),
                    wrapRight(tr('columnPicker'), selectMain(lid)));
            }
            else {

                if (legendType === 'discrete') {
                    return DIV({ className: 'app-split-main' },
                        wrapLeft(tr('legendInfoHeader'), info),
                        wrapCenter(`${tr('legendItems')} - ${propName}`, discrete()),
                        wrapRight(tr('style'), toolsMain()));
                }
                else {
                    return DIV({ className: 'app-split-main' },
                        wrapLeft(tr('legendInfoHeader'), info),
                        wrapCenter(`${tr('legendItems')} - ${propName}`, continuous()),
                        wrapRight(tr('style'), toolsMain()));
                }
            }
        }
    }

    return DIV();
};

const render = () => {
    const { info } = appQueries.getCurrentLayerInfo();
    if (!info) {
        return DIV({ className: 'app-split-wrapper legend-builder' });
    }
    featureConfigEvents.ensureSelectedFeature();
    return (
        DIV({ className: 'app-split-wrapper legend-builder' },
            renderHeader(queries.getLegendType(),
                info.id,
                queries.getSelectedMainName()),
            renderBody(info.id))
    );
};

export default render;

logger('loaded');
