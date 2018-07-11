import { DIV, IMG } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { getOrthoURL } from '../../queries/simulation';
import map from '../map';


const barChart =
    () =>
        DIV({ className: 'barchart' },
            DIV({
                className: 'great',
                width: '%value',
            }, '$area'),
            DIV({
                className: 'good',
                width: '%value',
            }, '$area'),
            DIV({
                className: 'unusable',
                width: '%value',
            }, '$area'));

const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu ortho' },
                DIV({ className: 'circle-wrapper' },
                    IMG({ src: getOrthoURL() })),
                DIV({ className: 'map-pin top' },
                    DIV({ className: 'pin-head' }, '$n'),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            DIV({ className: 'illu-text back-to-map' },
                DIV({}, '<-'),
                DIV({}, tr('solBackTo')),
                DIV({}, tr('solGeneralMap')),

            ));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu plan' },
                DIV({ className: 'circle-wrapper' },
                    map()),
                DIV({ className: 'map-pin middle' },
                    DIV({ className: 'pin-head' }, '$n'))),
            DIV({ className: 'illu-text roof-area' },
                DIV({}, tr('roofTotalArea')),
                DIV({}, '$value')));

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu volume' },
                DIV({ className: 'circle-wrapper' }),
                DIV({ className: 'map-pin right' },
                    DIV({ className: 'pin-end' }),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            barChart());



export const context =
    () =>
        DIV({ className: 'context' },
            wrapperOrtho(),
            wrapperPlan(),
            wrapper3D());










