import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';


const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu ortho' },
                DIV({ className: 'map-pin top' },
                    DIV({ className: 'pin-head' }, '$n'),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            DIV({ className: 'back-to-map' }, tr('backToMap')));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu plan' },
                DIV({ className: 'map-pin middle' },
                    DIV({ className: 'pin-head' }, '$n'))),
            DIV({ className: 'roof-area' },
                tr('roofTotalArea'),
                SPAN({}, '$m2')));

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
            }, '$area'),
        );

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu volume' },
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










