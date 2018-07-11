import { DIV, IMG } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { getOrthoURL, streetNumber, totalArea, areaExcellent, areaMedium, areaLow } from '../../queries/simulation';
import map from '../map';
import { withM2, withPercent } from 'sdi/util';


const barChart =
    () => {
        const a = areaExcellent()
        const b = areaMedium()
        const c = areaLow()
        return DIV({ className: 'barchart' },
            DIV({
                className: 'great',
                style: { width: `${a}%` },
            }, withPercent(a)),
            DIV({
                className: 'good',
                style: { width: `${b}%` },
            }, withPercent(b)),
            DIV({
                className: 'unusable',
                style: { width: `${c}%` },
            }, withPercent(c)));
    }

const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu ortho' },
                DIV({ className: 'circle-wrapper' },
                    IMG({ src: getOrthoURL() })),
                DIV({ className: `map-pin top numnum-${streetNumber().length}` },
                    DIV({ className: 'pin-head' }, `${streetNumber()}`),
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
                    DIV({ className: 'pin-head' }, `${streetNumber()}`))),
            DIV({ className: 'illu-text roof-area' },
                DIV({}, tr('roofTotalArea')),
                DIV({}, withM2(totalArea()))));

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










