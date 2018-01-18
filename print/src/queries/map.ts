
import { query, queryK } from 'sdi/shape';


import { getMapInfo } from './app';



export const getView =
    () => query('port/map/view');


export const getScaleLine =
    () => query('port/map/scale');

export const getBaseLayer =
    () => getMapInfo().map(({ baseLayer }) => baseLayer);

export const getInteraction = queryK('port/map/interaction');

export const getInteractionMode = () => getInteraction().label;

export const getPrintRequest =
    queryK('port/map/printRequest');
export const getPrintResponse =
    queryK('port/map/printResponse');