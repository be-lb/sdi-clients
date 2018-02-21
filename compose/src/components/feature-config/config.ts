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
import * as Color from 'color';
import { ReactNode } from 'react';

import { MessageKey } from 'sdi/locale/message-db';
import {
    BooleanConfig,
    ConfigWithLabel,
    ConfigWithLevel,
    ConfigWithStyle,
    ImageConfig,
    NumberConfig,
    PiechartConfig,
    PiechartPiece,
    PropType,
    RowConfig,
    StringConfig,
    StringOptionLevel,
    StringOptionStyle,
    TextConfig,
    TimeserieConfig,
    URLConfig,
} from 'sdi/source';
import { DIV, SPAN } from 'sdi/components/elements';
import { inputText, inputNullableNumber } from 'sdi/components/input';
import tr from 'sdi/locale';
import { getLayerPropertiesKeys } from 'sdi/util';

import {
    addPieChartPiece,
    addPropToConfig,
    movePropDown,
    movePropUp,
    removePieChartPiece,
    removePropFromConfig,
    resetEditedValue,
    setCurrentRow,
    setPiechartPieceColor,
    setPiechartPieceLabel,
    setPiechartRadius,
    setPiechartScale,
    setPropLevelForConfig,
    setPropStyleForConfig,
    setPropTypeForConfig,
    setPropWithLabelForConfig,
    setTimeserieReference,
    setTimeserieUrl,
    setTextText,
} from '../../events/feature-config';
import { getKeys, getCurrentIndex, getRows, getRow } from '../../queries/feature-config';
import appQueries from '../../queries/app';
import { button, remove } from '../button';
import { renderInputAlphaColor } from '../legend-editor/tool-input';



const logger = debug('sdi:feature-config/config');


const moveUpButton = button('move-up');
const moveDownButton = button('move-down');

const propType: PropType[] = ['string', 'number', 'boolean', 'url', 'image', 'html'];
const propLevel: StringOptionLevel[] = ['normal', 'subtitle', 'title'];
const propStyle: StringOptionStyle[] = ['normal', 'bold', 'italic', 'bold-italic'];


const WIDGET_TIMESERIE = '__WIDGET_TIMESERIE__';
const WIDGET_PIECHART = '__WIDGET_PIECHART__';
const WIDGET_TEXT = '__WIDGET_TEXT__';
const WIDGETS = [
    WIDGET_PIECHART,
    WIDGET_TIMESERIE,
    WIDGET_TEXT,
];
const WIDGET_NAME: { [k: string]: PropType } = {
    [WIDGET_PIECHART]: 'piechart',
    [WIDGET_TIMESERIE]: 'timeserie',
    [WIDGET_TEXT]: 'text',
};

const isWidget =
    (pn: string) =>
        WIDGETS.reduce((acc, w) => {
            if (acc) {
                return acc;
            }
            return w === pn;
        }, false);


const renderSelectItem =
    <T extends string>(set: (a: T) => void) => (v: T) => (
        DIV({ className: 'interactive', onClick: () => set(v) }, SPAN({}, v))
    );

export const renderSelect =
    <T extends string>(list: T[], selected: T | null, set: (a: T) => void) => {
        const mkItem = renderSelectItem(set);
        const below = list.filter(i => i !== selected).map(mkItem);

        return (
            DIV({ className: 'select' },
                DIV({ className: 'selected' }, SPAN({}, (!selected) ? 'none' : selected)),
                DIV({ className: 'below' }, ...below)));
    };


const inputWithLabel =
    (index: number, row: ConfigWithLabel) =>
        DIV({
            className: (row.options.withLabel) ? 'with-label active' : 'with-label',
            onClick: () => {
                setPropWithLabelForConfig(
                    index, !row.options.withLabel);
            },
        }, tr('displayLabel'));


const inputType =
    (index: number, row: RowConfig) =>
        renderSelect<PropType>(propType, row.type,
            v => setPropTypeForConfig(index, v));


const inputLevel =
    (index: number, row: ConfigWithLevel) =>
        renderSelect<StringOptionLevel>(propLevel, row.options.level,
            v => setPropLevelForConfig(index, v));


const inputStyle =
    (index: number, row: ConfigWithStyle) =>
        renderSelect<StringOptionStyle>(propStyle, row.options.style,
            v => setPropStyleForConfig(index, v));


const renderSelectRow =
    (pn: string) => (
        DIV({
            className: 'row',
            onClick: () => addPropToConfig(pn),
        },
            DIV({ className: 'propName' }, pn)));


const renderSelectWidget =
    (wn: string) =>
        DIV({
            className: 'row',
            onClick: () => addPropToConfig(wn, WIDGET_NAME[wn]),
        },
            DIV({
                className: 'propName',
            }, WIDGET_NAME[wn]));


const renderMoveUpButton =
    (index: number) => moveUpButton(() => movePropUp(index));


const renderMoveDownButton =
    (index: number) => moveDownButton(() => movePropDown(index));


const renderRemoveButton =
    (index: number) =>
        remove(`remove-feature-config-${index}`)(
            () => removePropFromConfig(index));


const renderSelectedRow =
    (row: RowConfig, key: number, rows: RowConfig[]) => {
        const current = getCurrentIndex();
        const propName = row.propName;
        const displayName = isWidget(propName) ? WIDGET_NAME[propName] : propName;
        let tools = [];

        if (key === 0) {
            tools = [
                renderMoveDownButton(key),
                renderRemoveButton(key),
            ];
        }
        else if (key + 1 === rows.length) {
            tools = [
                renderMoveUpButton(key),
                renderRemoveButton(key),
            ];
        }
        else {
            tools = [
                renderMoveDownButton(key),
                renderMoveUpButton(key),
                renderRemoveButton(key),
            ];
        }

        return (
            DIV({
                key,
                className: (current === key) ? 'row configured active' : 'row configured',
                onClick: () => setCurrentRow(key),
            },
                DIV({ className: 'propName' }, displayName),
                DIV({ className: 'tools' }, ...tools)));
    };


const label = (k: MessageKey, c = 'label') => DIV({ className: c }, tr(k));

const renderStringEditor =
    (index: number, config: StringConfig | NumberConfig | BooleanConfig | URLConfig) => [
        DIV({ className: 'item' },
            inputWithLabel(index, config)),
        DIV({ className: 'item' },
            label('textFormat'), inputLevel(index, config)),
        DIV({ className: 'item' },
            label('textStyle'), inputStyle(index, config)),
    ];

const renderTextEditor =
    (index: number, config: TextConfig) => [
        DIV({ className: `style-tool text` },
            SPAN({ className: 'label' }, tr('featureText')),
            inputText(
                () => config.options.text,
                newVal => setTextText(index, newVal))),
        DIV({ className: 'item' },
            label('textFormat'), inputLevel(index, config)),
        DIV({ className: 'item' },
            label('textStyle'), inputStyle(index, config)),
    ];


const renderImageEditor =
    (index: number, config: ImageConfig) => [
        DIV({ className: 'item' },
            inputWithLabel(index, config)),
    ];



const renderPiechartPiece =
    (index: number) =>
        (piece: PiechartPiece, key: number) => {
            const removeButton = remove(
                `renderStyleGroupValue-${piece.propName}-${key}`);

            const inputColor = renderInputAlphaColor('style-tool color', '',
                () => Color(piece.color),
                c => setPiechartPieceColor(
                    index, piece.propName, c.string()));

            const inputLabel = DIV({ className: `style-tool label` },
                SPAN({ className: 'label' }, tr('alias')),
                inputText(
                    () => (piece.label === undefined) ? piece.propName : piece.label,
                    newVal => setPiechartPieceLabel(index, piece.propName, newVal)));

            return (
                DIV({ className: 'value-name', key: `pie-piece-${piece.propName}-${key}` },
                    DIV({ className: 'piece-header' },
                        removeButton(
                            () => removePieChartPiece(index, piece.propName)),
                        SPAN({}, piece.propName),
                        inputLabel),
                    DIV({ className: 'piece-body' },
                        inputColor)));
        };

const pieceAdd =
    (index: number, value: string) => {
        if (value) {
            resetEditedValue();
            addPieChartPiece(index, value);
        }
    };


const renderColumnNames =
    (index: number, keys: string[]) =>
        keys.map((key) => {
            return DIV({
                key,
                className: 'column-name',
                onClick: () => pieceAdd(index, key),
            }, key);
        });


const columnPicker =
    (index: number) => {
        const { metadata } = appQueries.getCurrentLayerInfo();
        const children: React.ReactNode[] = [];
        if (metadata) {
            const layerData = appQueries.getLayerData(metadata.uniqueResourceIdentifier);
            if (layerData) {
                const keys = getLayerPropertiesKeys(layerData);
                children.push(...renderColumnNames(index, keys));
            }
        }

        return (
            DIV({ className: 'column-picker' },
                DIV({ className: 'title' }, tr('columnPicker')),
                ...children));
    };

const renderPiechartEditor =
    (index: number, config: PiechartConfig) => {
        const columns = config.options.columns;
        const pieces = columns.map(renderPiechartPiece(index));
        const elements: ReactNode[] = [];

        elements.push(
            DIV({ className: 'selected-items' },
                ...pieces,
                columnPicker(index)));


        const scaleSelect = renderSelect(
            ['normal', 'log'],
            config.options.scale,
            (v) => { setPiechartScale(index, v); });

        const radiusSelect = renderSelect(
            ['normal', 'dynamic'],
            config.options.radius,
            (v) => { setPiechartRadius(index, v); });

        return [
            DIV({ className: 'item' }, label('piechartScale'), scaleSelect),
            DIV({ className: 'item' }, label('piechartRadius'), radiusSelect),
            DIV({ className: 'item item-piechart' }, ...elements),
        ];
    };


const renderTimeserieEditor =
    (index: number, config: TimeserieConfig) => {
        return [
            DIV({ className: 'item' },
                label('timeserieTemplateURL', 'help'),
                inputText(
                    () => config.options.urlTemplate,
                    value => setTimeserieUrl(index, value)),
                label('timeserieReference', 'help'),
                inputNullableNumber(
                    () => config.options.referencePoint,
                    value => setTimeserieReference(index, value)))];
    };


const renderTypeSelector =
    (index: number, config: RowConfig) =>
        DIV({ className: 'item' },
            label('dataType'), inputType(index, config));


const renderRowEditor =
    (index: number) => {
        const row = getRow(index);
        const elements: ReactNode[] = [];
        if (row) {
            switch (row.type) {
                case 'string': elements.push(
                    renderTypeSelector(index, row),
                    ...renderStringEditor(index, row));
                    break;
                case 'number': elements.push(
                    renderTypeSelector(index, row),
                    ...renderStringEditor(index, row));
                    break;
                case 'boolean': elements.push(
                    renderTypeSelector(index, row),
                    ...renderStringEditor(index, row));
                    break;
                case 'url': elements.push(
                    renderTypeSelector(index, row),
                    ...renderStringEditor(index, row));
                    break;
                case 'image': elements.push(
                    renderTypeSelector(index, row),
                    ...renderImageEditor(index, row));
                    break;
                case 'html': elements.push(renderTypeSelector(index, row));
                    break;
                case 'piechart': elements.push(...renderPiechartEditor(index, row));
                    break;
                case 'timeserie': elements.push(...renderTimeserieEditor(index, row));
                    break;
                case 'text': elements.push(...renderTextEditor(index, row));
                    break;
            }
        }
        return elements;
    };


const renderPanel =
    (key: string, className: string, label: MessageKey, ...children: ReactNode[]) =>
        DIV({ className: `app-col-wrapper ${className}`, key: `${label}-${key}` },
            DIV({ className: 'app-col-header' },
                DIV({ className: 'title' }, tr(label))),
            DIV({ className: 'app-col-main' }, ...children));


const render =
    () => {
        const propNames = getKeys();
        const current = getCurrentIndex();
        const rows = getRows();
        const editor = renderRowEditor(current);

        const columElements =
            propNames.filter(pn => !isWidget(pn))
                .map(renderSelectRow);

        const widgetElements = WIDGETS.map(renderSelectWidget);

        const elements: ReactNode[] = [];
        if (widgetElements.length > 0) {
            elements.push(DIV({ className: 'group' },
                DIV({ className: 'group-label' }, tr('widgets')),
                ...widgetElements));
        }
        if (columElements.length > 0) {
            elements.push(DIV({ className: 'group' },
                DIV({ className: 'group-label' }, tr('columns')),
                ...columElements));
        }

        const row = getRow(current);
        const key = `${row ? row.type : 'none'}-${current}`;
        return (
            DIV({ className: 'app-split-main' },
                renderPanel(key, 'rows-remaining', 'infoChoice',
                    ...elements),
                renderPanel(key, 'rows-selected', 'infoReorder',
                    rows.map(renderSelectedRow)),
                renderPanel(key, 'row-editor', 'style', editor))
        );
    };

export default render;

logger('loaded');
