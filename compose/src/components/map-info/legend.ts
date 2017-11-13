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

import { ILayerInfo, getMessageRecord, Inspire, IMapInfo } from 'sdi/source';
import tr, { fromRecord } from 'sdi/locale';
import { DIV, H2, SPAN } from 'sdi/components/elements';

import legendPoint from './legend-point';
import legendLinestring from './legend-linestring';
import legendPolygon from './legend-polygon';
import queries from '../../queries/app';
import appEvents from '../../events/app';
import { resetLayerTable } from '../../events/table';
import legendEvents from '../../events/legend-editor';
import { AppLayout } from '../../shape/types';
import { button, remove } from '../button';
import { getDatasetMetadata } from '../../queries/metadata';


const addButton = button('add');
// const editButton = button('edit');
const upButton = button('move-up');
const downButton = button('move-down');

const wrapItem =
    (md: Inspire | null) =>
        (...nodes: React.ReactNode[]) => {
            if (md) {
                const data = queries.getLayerData(md.uniqueResourceIdentifier);
                if (data) {
                    return nodes;
                }
            }
            return nodes.concat(SPAN({
                className: 'loader-spinner',
            }));
        };

const renderLegendItem =
    (layerInfo: ILayerInfo): React.ReactNode[] => {
        switch (layerInfo.style.kind) {
            case 'polygon-continuous':
            case 'polygon-discrete':
            case 'polygon-simple':
                return legendPolygon(layerInfo.style, layerInfo);
            case 'point-discrete':
            case 'point-simple':
            case 'point-continuous':
                return legendPoint(layerInfo.style, layerInfo);
            case 'line-simple':
            case 'line-discrete':
            case 'line-continuous':
                return legendLinestring(layerInfo.style, layerInfo);
            default:
                throw (new Error('UnknownStyleKind'));
        }
    };

const renderEditButton =
    (info: ILayerInfo) => {
        const md = getDatasetMetadata(info.metadataId).fold(
            () => null,
            md => md);
        const label = md === null ? '' : fromRecord(getMessageRecord(md.resourceTitle));
        const wrap = wrapItem(md);
        return (
            DIV({
                className: 'table-name',
                onClick: () => {
                    appEvents.setCurrentLayerId(info.id);
                    appEvents.resetLegendEditor();
                    appEvents.setLayout(AppLayout.LegendEditor);
                },
            },
                SPAN({}, ...wrap(label)))
        );
    };

const renderDeleteButton =
    (info: ILayerInfo) => {
        const removeButton = remove(`legend::renderDeleteButton-${info.id}`);
        return (
            removeButton(() => {
                legendEvents.removeLayer(info);
                appEvents.setLayout(AppLayout.MapAndInfo);
            })
        );
    };

const renderUpButton =
    (info: ILayerInfo) => {
        return (
            upButton(() => {
                legendEvents.moveLayerUp(info);
            })
        );
    };

const renderDownButton =
    (info: ILayerInfo) => {
        return (
            downButton(() => {
                legendEvents.moveLayerDown(info);
            })
        );
    };

const renderTools =
    (info: ILayerInfo, idx: number, len: number) => {
        const tools: React.ReactNode[] = [];
        if (len === 1) {
            tools.push(
                renderDeleteButton(info));
        }
        else if (idx === 0) {
            tools.push(
                renderDownButton(info),
                renderDeleteButton(info));
        }
        else if (idx === (len - 1)) {
            tools.push(
                renderUpButton(info),
                renderDeleteButton(info));
        }
        else {
            tools.push(
                renderUpButton(info),
                renderDownButton(info),
                renderDeleteButton(info));
        }
        return DIV({ className: 'legend-block-tools' },
            renderEditButton(info),
            DIV({ className: 'tools' }, ...tools));
    };

const renderLayer =
    (info: ILayerInfo, idx: number, layers: ILayerInfo[]) => {
        const items = renderLegendItem(info);
        return (
            DIV({ className: 'legend-block' },
                renderTools(info, idx, layers.length),
                ...items)
        );
    };

const renderAddButton =
    () => {
        return (
            addButton(() => {
                resetLayerTable();
                appEvents.setLayout(AppLayout.LayerSelect);
            })
        );
    };


const reverse =
    (a: ILayerInfo[]): ILayerInfo[] => a.reduceRight<ILayerInfo[]>((acc, v) => acc.concat([v]), []);

const render =
    (mapInfo: IMapInfo) => {
        const blocks = reverse(mapInfo.layers).map(renderLayer);
        return (
            DIV({},
                H2({}, tr('mapLegend')),
                renderAddButton(),
                ...blocks)
        );
    };

export default render;
