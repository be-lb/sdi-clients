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


import { DIV, INPUT, SPAN } from '../elements';
import tr from '../../locale';

import { TimeserieConfig, ITimeserie } from '../../source';
import { TimeseriePlotter, IChartWindow } from '../timeserie';
import { absoluteWindow } from '../timeserie/plot';
import { binarySearch } from '../../util';

const logger = debug('sdi:component/feature-view/timeserie');

interface NotNullProperties {
    [key: string]: any;
}


const tsToDateString =
    (ts: number) =>
        (new Date(ts)).toISOString().substr(0, 10);


const findTSIndex =
    (ts: number, data: ITimeserie) =>
        binarySearch(0, data.length,
            i => (
                data[i][0] === ts ? 0 : (
                    data[i][0] < ts ? -1 : 1)));

const selectedData =
    (w: IChartWindow, data: ITimeserie) => {
        const startIndex = findTSIndex(w.start, data);
        const endIndex = findTSIndex(w.end, data);
        return data.slice(startIndex, endIndex);
    };

const render =
    (tsPlotter: TimeseriePlotter) =>
        (props: NotNullProperties, config: TimeserieConfig) => {
            const { plotter, queries, events } = tsPlotter;
            const data = queries.getData(props, config);

            if (data) {
                const s = queries.getSelection();
                if (s.start < 0) {
                    events.startSelection(data[0][0]);
                    return DIV();
                }
                else if (s.end < s.start) {
                    events.endSelection(data[data.length - 1][0]);
                    return DIV();
                }
                const selectionWindow = s.start >= 0 ? absoluteWindow(s) : { start: data[0][0], end: data[data.length - 1][0] };
                const selectionData = selectedData(selectionWindow, data);

                const inputStart = DIV({},
                    SPAN({}, tr('startDate')),
                    INPUT({
                        type: 'date',
                        min: tsToDateString(data[0][0]),
                        max: tsToDateString(selectionData[selectionData.length - 1][0]),
                        value: tsToDateString(selectionData[0][0]),
                        onChange: (e) => {
                            const d = Date.parse(e.currentTarget.value);
                            if (!isNaN(d)) {
                                events.startSelection(d);
                            }
                        },
                    }));

                const inputEnd = DIV({},
                    SPAN({}, tr('endDate')),
                    INPUT({
                        type: 'date',
                        min: tsToDateString(selectionData[0][0]),
                        max: tsToDateString(data[data.length - 1][0]),
                        value: tsToDateString(selectionData[selectionData.length - 1][0]),
                        onChange: (e) => {
                            const d = Date.parse(e.currentTarget.value);
                            if (!isNaN(d)) {
                                events.endSelection(d);
                            }
                        },
                    }));

                return DIV({},
                    DIV({
                        className: 'chart-wrapper',
                        key: `chart|${selectionWindow.start.toString()}|${selectionWindow.end.toString()}`,
                    },
                        ...plotter(selectionData, selectionWindow, config.options.referencePoint)), inputStart, inputEnd);
            }
            else {
                const id = queries.getTimeserieId(props, config);
                const url = queries.getTimeserieUrl(props, config);

                if (id !== null && url !== null) {
                    events.loadData(id, url);
                    return [DIV({}, tr('loadingData'))];
                }
                else {
                    return [DIV({}, tr('timeserieConfigError'))];
                }
            }

        };

export default render;

logger('loaded');
