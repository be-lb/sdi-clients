
import { fromNullable } from 'fp-ts/lib/Option';

import { ILayerInfo } from 'sdi/source';
import { DIV } from 'sdi/components/elements';
import { renderConfig, renderDefault as defaultView } from 'sdi/components/feature-view';
import timeserie from 'sdi/components/timeserie';

import app from '../queries/app';
import { dispatchTimeserie, loadData } from '../events/timeserie';
import { getData, queryTimeserie } from '../queries/timeserie';


const tsPlotter = timeserie(
    queryTimeserie, getData, app.getCurrentLayer,
    dispatchTimeserie, loadData);
const noView = () => DIV({ className: 'feature-view no' });


export const renderDefault =
    () =>
        fromNullable(app.getCurrentFeature())
            .fold(noView, defaultView);

const withInfo =
    (info: ILayerInfo) =>
        fromNullable(app.getCurrentFeature())
            .fold(noView,
            feature => renderConfig(
                info.featureViewOptions, feature, tsPlotter));



const render =
    () =>
        fromNullable(app.getCurrentLayerInfo().info)
            .fold(noView, withInfo);


export default render;
