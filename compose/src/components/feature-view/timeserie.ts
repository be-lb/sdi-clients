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
import { DIV } from 'sdi/components/elements';
import { graph, absoluteWindow } from '../timeserie';
import { TimeserieConfig } from 'sdi/source';
import queries from '../../queries/timeserie';
import events from '../../events/timeserie';
import { IChartWindow } from '../../shape/types';
import tr from 'sdi/locale';

const logger = debug('sdi:component/feature-view/timeserie');

interface NotNullProperties {
    [key: string]: any;
}

const render = (props: NotNullProperties, config: TimeserieConfig) => {

    const data = queries.getData(props, config);

    if (data) {
        const graphWindow: IChartWindow = { start: 0, width: data.length };
        const selectionWindow: IChartWindow = absoluteWindow(queries.getSelection());

        const graphs = [
            DIV({
                className: 'chart-wrapper',
                key: `chart|${graphWindow.start.toString()}|${graphWindow.width.toString()}|${selectionWindow.start.toString()}|${selectionWindow.width.toString()}`,
            },
                ...graph(data, graphWindow, true))];


        if (selectionWindow.width > 0) {
            const selectionData = data.slice(selectionWindow.start, selectionWindow.start + selectionWindow.width);
            graphs.push(DIV({
                className: 'chart-wrapper',
                key: `chart|${selectionWindow.start.toString()}|${selectionWindow.width.toString()}`,
            },
                ...graph(selectionData, selectionWindow)));
        }

        return graphs;
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
