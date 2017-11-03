
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
import { format } from 'openlayers';

import { DIV, H2, INPUT } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { hashMapBaseLayer, translateMapBaseLayer } from 'sdi/util';
import { IMapBaseLayer } from 'sdi/source';

import queries from '../../queries/legend';
import events from '../../events/legend';
import { getBaseLayer, getAllBaseLayers } from '../../queries/map';
import { selectBaseLayer } from '../../events/map';
import { ChangeEvent } from 'react';
import { IToolWebServices } from '../../shape/types';

const logger = debug('sdi:webservices');



const wmsCapParser = new format.WMSCapabilities();
// const wmtsCapParser = new format.WMTSCapabilities();

const renderBaseLayers = () => {
    const currentBaseLayer = getBaseLayer();
    const cblh = currentBaseLayer === null
        ? ''
        : hashMapBaseLayer(currentBaseLayer);
    return (
        getAllBaseLayers()
            .map((layer) => {
                const layerName = fromRecord(layer.name);
                const lh = hashMapBaseLayer(layer);
                const className = cblh === lh ? 'active' : '';
                return DIV({
                    className,
                    onClick: () => {
                        selectBaseLayer(lh);
                    },
                }, layerName);
            }));
};

const queryString = (o: { [k: string]: any }) => {
    return Object.keys(o).reduce((a, k) => {
        return `${a}&${k}=${o[k].toString()}`;
    }, '');
};

interface CapLayer {
    Name: string;
    Title: string;
}

interface WMSCapabilities {
    version: string;
    Service: {
        Title: string;
        [k: string]: any;
    };
    Capability: {
        Layer: {
            Layer: CapLayer[];
        };
    };
}

const getLayers = (state: IToolWebServices,
) => () => {
    const options: RequestInit = {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
    };
    const qs = queryString({
        SERVICE: 'WMS',
        request: 'GetCapabilities',
    });

    fetch(`${state.url}?${qs}`, options)
        .then((response) => {
            if (response.ok) {
                return response.text();
            }
            throw new Error(`Network response was not ok.\n${response.statusText}`);
        })
        .then((text) => {
            const parsed = <WMSCapabilities>wmsCapParser.read(text);
            const capalility = parsed.Capability;
            const root = capalility.Layer;
            const layers = root.Layer;
            const services = layers.map<IMapBaseLayer>((cl) => {
                return {
                    name: { fr: cl.Title, nl: cl.Title },
                    srs: 'EPSG:31370',
                    url: { fr: state.url, nl: state.url },
                    params: {
                        LAYERS: { fr: cl.Name, nl: cl.Name },
                        VERSION: parsed.version,
                    },
                };
            });

            events.updateWebServiceLayers(services);
        });
};

const updateUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    events.updateWebServiceURL(url);
};

const folded = (state: IToolWebServices,
) => {
    return DIV({ className: 'tool wms-picker' },
        H2({}, tr('wmsSwitch')),
        DIV({ className: 'tool-body' },
            ...renderBaseLayers(),
            DIV({ className: 'wms-browser' },
                INPUT({
                    type: 'url',
                    placeholder: tr('webServiceUrl'),
                    onChange: updateUrl,
                }),
                DIV({
                    className: 'btn-connect',
                    onClick: getLayers(state),
                }, tr('connect')))));
};


const unfolded = (state: IToolWebServices,
) => {
    const layers = state.layers.map((layer) => {
        const tl = translateMapBaseLayer(layer);
        return DIV({
            onClick: () => {
                events.addWebServiceLayer(layer);
            },
        }, tl.name);
    });

    return DIV({ className: 'tool wms-picker' },
        H2({}, tr('wmsSwitch')),
        DIV({ className: 'tool-body' },
            ...layers));
};


const webservices = () => {
    const state = queries.toolsWebservices();
    if (state.folded) {
        return folded(state);
    }
    return unfolded(state);
};


export default webservices;

logger('loaded');
