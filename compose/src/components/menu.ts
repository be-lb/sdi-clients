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
import { IMapBaseLayer } from '../shape';
import mapQueries from '../queries/map';
import mapEvents from '../events/map';
import tr from '../locale';
import { DIV } from './elements';

/*

  <div class="wgt-choose-wms">
      <div class="folded">
          <div>arrière plan</div>
      </div>
  </div>

*/

const logger = debug('sdi:menu');


const renderBaseLayers = () => (
    mapQueries.getAllBaseLayers()
        .map((layer: IMapBaseLayer) => {
            const layerName = layer.name;
            const className = layer.selected ? 'active' : '';
            return DIV({
                className,
                onClick: () => {
                    mapEvents.selectBaseLayer({ name: layerName });
                },
            }, layerName);
        }));



export const fn = () => {
    return (
        DIV({ className: 'wms-picker' },
            DIV({ className: 'tool-label' }, tr('wmsSwitch')),
            ...renderBaseLayers())
    );
};

export default fn;

logger('loaded');
