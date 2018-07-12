import bbox from '@turf/bbox'

import { DIV, IMG, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withM2, withPercent } from 'sdi/util';
import { scopeOption } from 'sdi/lib';
import { FeatureCollection } from 'sdi/source';

import map from '../map';
import { getOrthoURL, streetNumber, totalArea, areaExcellent, areaMedium, areaLow, getBuildings, getRoofs } from '../../queries/simulation';
import { perspective, Camera, reduceMultiPolygon, Reducer, reducePolygon } from './perspective'
import { vec3, vec2 } from 'gl-matrix';
import { Option, some, none } from 'fp-ts/lib/Option';



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
    (src: string) =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu volume' },
                DIV({ className: 'circle-wrapper' },
                    IMG({ src })),
                DIV({ className: 'map-pin right' },
                    DIV({ className: 'pin-end' }),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            barChart());

const ALTITUDE_100 = 100;

const getCamera =
    (fc: FeatureCollection): Option<Camera> => {
        type n3 = [number, number, number];
        const [minx, miny, maxx, maxy] = bbox(fc);
        const cx = minx + (maxx - minx)
        const cy = miny + (maxy - miny)
        const minzzer = (acc: number, p: n3) => Math.min(acc, p[2])
        const minz = fc.features.reduce((acc, f) => {
            const geom = f.geometry;
            const gt = geom.type
            const r: Reducer = {
                f: minzzer,
                init: acc,
            }
            if ('MultiPolygon' === gt) {
                return Math.min(acc, reduceMultiPolygon(r, geom.coordinates as n3[][][]))
            }
            else if ('Polygon' === gt) {
                return Math.min(acc, reducePolygon(r, geom.coordinates as n3[][]))
            }
            return acc
        }, ALTITUDE_100);

        if (minz !== undefined) {
            const pos = vec3.fromValues(cx, cy - Math.max((maxx - minx), (maxy - miny)), minz + 33)
            const target = vec3.fromValues(cx, cy, minz)
            const viewport = vec2.fromValues(1024, 1024)
            return some({
                pos,
                target,
                viewport,
            })
        }
        return none;
    };

const render3D =
    () =>
        scopeOption()
            .let('buildings', getBuildings())
            .let('roofs', getRoofs())
            .let('camera', ({ roofs }) => getCamera(roofs))
            .let('src', ({ camera, roofs, buildings }) => perspective(camera, buildings, roofs))
            .foldL<React.ReactNode>(
                () => NODISPLAY,
                scope => wrapper3D(scope.src),
        );


export const context =
    () =>
        DIV({ className: 'context' },
            wrapperOrtho(),
            wrapperPlan(),
            render3D());










