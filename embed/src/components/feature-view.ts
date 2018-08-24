

import { ILayerInfo, Feature } from 'sdi/source';
import { DIV, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { renderConfig, renderDefault as defaultView } from 'sdi/components/feature-view';
import timeserie from 'sdi/components/timeserie';


import { getCurrentFeature, getLayerId, getCurrentLayerInfo } from '../queries/app';
import { setLayout } from '../events/app';
import { dispatchTimeserie, loadData } from '../events/timeserie';
import { getData, queryTimeserie } from '../queries/timeserie';
import { viewEvents } from '../events/map';


const renderZoom =
    (feature: Feature) => DIV({
        className: `zoomOnFeature`,
        title: tr('zoomOnFeature'),
        onClick: () => viewEvents.updateMapView({
            dirty: 'geo/feature',
            feature,
        }),
    });

const zoomToFeature =
    () =>
        getCurrentFeature().fold(NODISPLAY(), renderZoom);


export const switcher =
    () =>
        DIV({ className: 'switcher infos' },
            DIV({
                className: `switch-legend`,
                title: tr('mapLegend'),
                onClick: () => {
                    setLayout('map');
                },
            }),
            zoomToFeature());



const tsPlotter = timeserie(
    queryTimeserie, getData, getLayerId,
    dispatchTimeserie, loadData);

const noView = () => DIV({ className: 'feature-view no' });



export const renderDefault =
    () =>
        getCurrentFeature().fold(noView(), defaultView);

const withInfo =
    (info: ILayerInfo) =>
        getCurrentFeature()
            .fold(noView(),
                feature => renderConfig(
                    info.featureViewOptions, feature, tsPlotter));



const render =
    () =>
        getCurrentLayerInfo().fold(noView(), withInfo);


export default render;
