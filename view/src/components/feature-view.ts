
import { fromNullable } from 'fp-ts/lib/Option';

import { ILayerInfo, Feature } from 'sdi/source';
import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { renderConfig, renderDefault as defaultView } from 'sdi/components/feature-view';
import timeserie from 'sdi/components/timeserie';


import app from '../queries/app';
import appEvents from '../events/app';
import legendEvents from '../events/legend';
import { dispatchTimeserie, loadData } from '../events/timeserie';
import { getData, queryTimeserie } from '../queries/timeserie';
import { AppLayout } from '../shape/types';
import { viewEvents } from '../events/map';
import { button } from './button';



const zoomButton = button('zoomOnFeature', 'zoomOnFeature');

export const switcher =
    () => (
        DIV({ className: 'switcher infos' },
            DIV({
                className: `switch-legend`,
                title: tr('mapLegend'),
                onClick: () => {
                    appEvents.setLayout(AppLayout.MapFS);
                    legendEvents.setPage('legend');
                },
            }))
    );



const tsPlotter = timeserie(
    queryTimeserie, getData, app.getCurrentLayer,
    dispatchTimeserie, loadData);
const noView = () => DIV({ className: 'feature-view no' });


const wrap =
    (feature: Feature, child: React.ReactNode) =>
        DIV({ className: 'feature-view-wrapper' },
            zoomButton(() => viewEvents.updateMapView({
                dirty: 'geo/feature',
                feature,
            })),
            child);

export const renderDefault =
    () =>
        fromNullable(app.getCurrentFeature())
            .fold(noView, defaultView);

const withInfo =
    (info: ILayerInfo) =>
        fromNullable(app.getCurrentFeature())
            .fold(noView,
            feature => wrap(feature, renderConfig(
                info.featureViewOptions, feature, tsPlotter)));



const render =
    () =>
        fromNullable(app.getCurrentLayerInfo().info)
            .fold(noView, withInfo);


export default render;
