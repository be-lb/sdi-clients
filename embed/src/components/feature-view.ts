

import { ILayerInfo } from 'sdi/source';
import { DIV } from 'sdi/components/elements';
import { renderConfig, renderDefault as defaultView } from 'sdi/components/feature-view';
import timeserie from 'sdi/components/timeserie';

import { getLayerId, getCurrentFeature, getCurrentLayerInfo } from '../queries/app';
import { dispatchTimeserie, loadData } from '../events/timeserie';
import { getData, queryTimeserie } from '../queries/timeserie';




const tsPlotter = timeserie(
    queryTimeserie, getData, getLayerId,
    dispatchTimeserie, loadData);
const noView =
    (reason: string) =>
        () => DIV({ className: 'feature-view no' }, reason);


export const renderDefault =
    () =>
        getCurrentFeature()
            .fold(noView('Miss Feature'), defaultView);

const withInfo =
    (info: ILayerInfo) =>
        getCurrentFeature()
            .fold(noView('Miss Feature'),
            feature => renderConfig(
                info.featureViewOptions, feature, tsPlotter));



const render =
    () =>
        getCurrentLayerInfo()
            .fold(noView('Miss Layer'), withInfo);


export default render;
