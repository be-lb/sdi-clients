import bbox from '@turf/bbox';

import { DIV, IMG } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { withM2, withPercent } from 'sdi/util';
import { scopeOption } from 'sdi/lib';
import { FeatureCollection, Feature } from 'sdi/source';

import map from '../map';
import {
    areaExcellent,
    areaLow,
    areaMedium,
    getBuildings,
    getOrthoURL,
    getRoofs,
    streetNumber,
    totalArea,
    getPerpectiveCamera,
} from '../../queries/simulation';
import { perspective, reduceMultiPolygon, Reducer, reducePolygon } from './perspective';
import { Camera } from './mat';
import { vec3, vec2 } from 'gl-matrix';
import { Option, some, none } from 'fp-ts/lib/Option';
import { navigateLocate } from '../../events/route';
import { clearRoofLayer } from '../../events/map';
import { setPerspectiveCamera } from '../../events/simulation';

import { buildingAdress } from '../item-factory';


const mobileAdress =
    () =>
        DIV({ className: 'mobile-adress' },
            buildingAdress());

const makeBar =
    (v: number, colorClass: string, label: string) =>
        DIV({ className: 'bar' },
            DIV({ className: 'bar-color-wrapper' },
                DIV({
                    className: `bar-color ${colorClass}`,
                    style: { width: `${v}%` },
                })),
            DIV({ className: 'bar-value' }, withPercent(v)),
            DIV({ className: 'bar-label' }, label));


const barChart =
    () => {
        const a = areaExcellent();
        const b = areaMedium();
        const c = areaLow();

        const bars = [];
        if (a > 0) {
            bars.push(makeBar(a, 'great', tr('orientationGreat')));
        }
        if (b > 0) {
            bars.push(makeBar(b, 'good', tr('orientationGood')));
        }
        if (c > 0) {
            bars.push(makeBar(c, 'unusable', tr('unusable')));
        }
        return DIV({ className: 'barchart' }, ...bars);
    };

const backToMap =
    () =>
        DIV({
            className: 'illu-text solar-btn btn-level-2', onClick: () => {
                clearRoofLayer();
                navigateLocate();
            },
        },
            DIV({ className: 'solar-inner-btn' }, tr('solBackToMap')),
        );

const roofArea =
    () =>
        DIV({ className: 'illu-text roof-area' },
            DIV({}, tr('roofTotalArea')),
            DIV({ className: 'roof-area-value' }, withM2(totalArea())));





const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu ortho' },
                DIV({ className: 'circle-wrapper' },
                    IMG({ src: getOrthoURL() })),
                DIV({ className: `map-pin top numnum-${streetNumber().length}` },
                    DIV({ className: 'pin-head' }, `${streetNumber()}`),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu plan' },
                DIV({ className: 'circle-wrapper' },
                    map())));

export const wrapper3D =
    (src: string) =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu volume' },
                DIV({ className: 'circle-wrapper' },
                    IMG({ src }))));





const ALTITUDE_0 = 0;
const ALTITUDE_100 = 100;


const isExactFeature =
    ({ properties }: Feature): boolean => {
        if (properties !== null) {
            return ('is_exact' in properties) && properties['is_exact'];
        }
        return false;
    };

const getCamera =
    (fc: FeatureCollection): Option<Camera> =>
        getPerpectiveCamera()
            .foldL(() => {
                const fcExact: FeatureCollection = {
                    type: 'FeatureCollection',
                    features: fc.features.filter(isExactFeature),
                };
                type n3 = [number, number, number];
                const [minx, miny, maxx, maxy] = bbox(fcExact);
                const cx = minx + ((maxx - minx) / 2);
                const cy = miny + ((maxy - miny) / 2);
                const maxxer = (acc: number, p: n3) => Math.max(acc, p[2]);
                const maxz = fcExact.features.reduce((acc, f) => {
                    const geom = f.geometry;
                    const gt = geom.type;
                    const r: Reducer = {
                        f: maxxer,
                        init: acc,
                    };
                    if ('MultiPolygon' === gt) {
                        return Math.max(acc, reduceMultiPolygon(r, geom.coordinates as n3[][][]));
                    }
                    else if ('Polygon' === gt) {
                        return Math.max(acc, reducePolygon(r, geom.coordinates as n3[][]));
                    }
                    return acc;
                }, ALTITUDE_0);

                const minzzer = (acc: number, p: n3) => Math.min(acc, p[2]);
                const minz = fcExact.features.reduce((acc, f) => {
                    const geom = f.geometry;
                    const gt = geom.type;
                    const r: Reducer = {
                        f: minzzer,
                        init: acc,
                    };
                    if ('MultiPolygon' === gt) {
                        return Math.min(acc, reduceMultiPolygon(r, geom.coordinates as n3[][][]));
                    }
                    else if ('Polygon' === gt) {
                        return Math.min(acc, reducePolygon(r, geom.coordinates as n3[][]));
                    }
                    return acc;
                }, ALTITUDE_100);

                if (maxz !== undefined && minz !== undefined) {
                    const dist = (Math.max((maxx - minx), (maxy - miny)) * 1);
                    const pos = vec3.fromValues(
                        cx,
                        cy - dist,
                        maxz + dist);
                    const target = vec3.fromValues(cx, cy,
                        maxz - (dist / 2));
                    const viewport = vec2.fromValues(1024, 1024);
                    const cam = {
                        pos,
                        target,
                        viewport,
                    };
                    setTimeout(() => setPerspectiveCamera(cam), 0);
                    return some(cam);
                }
                return none;
            },
                c => some(c),
        );


const emptyRoofs = some<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
});

const render3D =
    () =>
        scopeOption()
            .let('buildings', getBuildings())
            .let('roofs', getRoofs().fold(emptyRoofs, roofs => some(roofs)))
            .let('camera', ({ buildings }) => getCamera(buildings))
            .let('src', ({ camera, roofs, buildings }) => perspective(camera, buildings, roofs))
            .foldL<React.ReactNode>(
                () => wrapper3D(''),
                scope => wrapper3D(scope.src));



const contextInfos =
    () =>
        DIV({ className: 'context-infos-wrapper' },
            backToMap(),
            roofArea(),
            barChart(),
        );


const contextIllus =
    () =>
        DIV({ className: 'context-illus-wrapper' },
            wrapperOrtho(),
            wrapperPlan(),
            render3D(),
        );


export const context =
    () =>
        DIV({ className: 'context' },
            mobileAdress(),
            contextIllus(),
            contextInfos());










