

import * as debug from 'debug';
import { vec3, vec2 } from 'gl-matrix';

import { FeatureCollection, Feature, Properties } from 'sdi/source';
import { Option, none, some } from 'fp-ts/lib/Option';
import { Tag, getPerpectiveSrc } from '../../queries/simulation';
import { Camera, getTranformFunction, Transform } from './mat';
import { setPerspectiveSrc } from '../../events/simulation';


const logger = debug('sdi:solar/perspective');



type Finalizer = (c: CanvasRenderingContext2D) => void;
type Transformer = (pt: vec3) => vec2;
type Prepper = (c: CanvasRenderingContext2D, p: Properties) => () => void;
type n3 = [number, number, number];


// << Planes


type Plane = vec3[];
type FeaturePlane = {
    props: Properties;
    plane: Plane;
};
type FeaturePlaneCollection = FeaturePlane[];

function clonePlane(p: FeaturePlane) {
    return {
        props: p.props,
        plane: p.plane.map(v => vec3.fromValues(v[0], v[1], v[2])),
    };
}

function clonePlaneCollection(ps: FeaturePlaneCollection) {
    return ps.map(clonePlane);
}

// function getZ(plane: FeaturePlane, _t: Transform) {
//     const z = (p: vec3) => p[2]
//     const init = Number.MAX_VALUE
//     return plane.reduce((acc, v) => Math.min(acc, z(v)), init)
// }


function getPlanes(fs: Feature[]): FeaturePlaneCollection {
    const result: FeaturePlaneCollection = [];
    fs.forEach((f) => {
        const geom = f.geometry;
        if (geom.type === 'Polygon') {
            const cs = geom.coordinates as number[][][];
            cs.forEach((l) => {
                const vl: Plane = [];
                l.forEach(c => vl.push(vec3.fromValues(c[0], c[1], c[2])));
                result.push({ props: f.properties, plane: vl });
            });
        }
        else if (geom.type === 'MultiPolygon') {
            const cs = geom.coordinates as number[][][][];
            cs.forEach((p) => {
                p.forEach((l) => {
                    const vl: Plane = [];
                    l.forEach(c => vl.push(vec3.fromValues(c[0], c[1], c[2])));
                    result.push({ props: f.properties, plane: vl });
                });
            });
        }
    });

    return result;
}

function sortedPlanes(ps: FeaturePlaneCollection, c: vec3) {
    return clonePlaneCollection(ps).sort((a, b) => {
        // const da = vec3.dist(c, vec3Mean(a))
        // const db = vec3.dist(c, vec3Mean(b))
        const da = a.plane.reduce((acc, v) => Math.max(vec3.sqrDist(c, v), acc), Number.MIN_VALUE);
        const db = b.plane.reduce((acc, v) => Math.max(vec3.sqrDist(c, v), acc), Number.MIN_VALUE);
        if (da < db) {
            return 1;
        } if (da > db) {
            return -1;
        }
        return 0;
    });
}



// >> Planes



// << utils

const getProp =
    <T>(props: Properties, k: string, dflt: T): T => {
        if (props && k in props) {
            if (typeof dflt === typeof props[k]) {
                return props[k] as T;
            }
        }
        return dflt;
    };
export interface Reducer {
    f: (acc: number, p: n3) => number;
    init: number;
}

export function reduceLineString(r: Reducer, p: n3[]) {
    return p.reduce(r.f, r.init);
}

export function reducePolygon(r: Reducer, p: n3[][]) {
    const ls = p.reduce((acc, p) => acc.concat(p), []);
    return reduceLineString(r, ls);
}

export function reduceMultiPolygon(r: Reducer, m: n3[][][]) {
    const ps = m.reduce((acc, p) => acc.concat(p), []);
    return reducePolygon(r, ps);
}

// >> utils


function getLineRingCoord(t: Transformer, lr: Plane) {
    return lr.map(pt => t(vec3.fromValues(pt[0], pt[1], pt[2])));
}

// draw
function drawLineRingCoord(ctx: CanvasRenderingContext2D, finalizer: Finalizer, lr: vec2[]) {
    const start = lr[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    lr.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
    finalizer(ctx);
}

// function drawPolygonCoords(ctx: CanvasRenderingContext2D, finalizer: Finalizer, p: vec2[][]) {
//     return p.map(lr => drawLineRingCoord(ctx, finalizer, lr));
// }

function drawPerspective(
    cam: Camera,
    buildings: FeatureCollection,
    roofs: FeatureCollection,
): Option<string> {
    const width = cam.viewport[1];
    const height = cam.viewport[1];
    const transform = getTranformFunction(cam);


    const painter =
        (
            ctx: CanvasRenderingContext2D,
            prep: Prepper,
            fin: Finalizer,
            planes: FeaturePlaneCollection,
        ) =>
            (t: Transform, c: vec3) => {
                const ps = sortedPlanes(planes, c);
                ps.forEach((p) => {
                    const end = prep(ctx, p.props);
                    drawLineRingCoord(ctx, fin, getLineRingCoord((pt: vec3) => t(pt, false), p.plane));
                    end();
                });
            };


    const buildingFinalizer: Finalizer = (c) => {
        c.fill();
        c.stroke();
    };
    const roofFinalizer: Finalizer = (c) => {
        c.fill();
        c.stroke();
    };

    const buildingPrepper: Prepper =
        (c) => {
            c.save();
            c.strokeStyle = '#444';
            // c.fillStyle = 'rgba(252,251,247,0.6)';
            c.fillStyle = 'rgb(242, 242, 228)';
            c.lineWidth = 0.9;
            return () => c.restore();
        };

    const roofPrepper: Prepper =
        (c, f) => {
            c.save();
            c.strokeStyle = '#666';
            c.lineWidth = 1;

            switch (getProp(f, 'tag', 'great' as Tag)) {
                case 'great': c.fillStyle = '#8db63c';
                    break;
                case 'good': c.fillStyle = '#ebe316';
                    break;
                case 'unusable': c.fillStyle = '#006f90';
                    break;
            }

            return () => c.restore();
        };




    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width.toFixed());
    canvas.setAttribute('height', height.toFixed());
    const context = canvas.getContext('2d');


    if (context) {
        const buildingPainter = painter(context, buildingPrepper, buildingFinalizer, getPlanes(buildings.features));
        const roofPainter = painter(context, roofPrepper, roofFinalizer, getPlanes(roofs.features));
        const renderFrame =
            (ctx: CanvasRenderingContext2D) => {
                ctx.clearRect(0, 0, width, height);
                buildingPainter(transform, cam.pos);
                roofPainter(transform, cam.pos);
            };
        renderFrame(context);
        const pers = canvas.toDataURL('image/bmp', false);
        setPerspectiveSrc(pers);
        return some(pers);
    }
    return none;
}


export function perspective(
    cam: Camera,
    buildings: FeatureCollection,
    roofs: FeatureCollection,
): Option<string> {
    return getPerpectiveSrc().foldL(() => drawPerspective(cam, buildings, roofs), p => some(p));
}


logger('loaded');
