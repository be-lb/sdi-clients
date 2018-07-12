

import * as debug from 'debug';
import { vec3, mat3, mat4, vec2 } from 'gl-matrix';

import { FeatureCollection, Feature, getFeatureProp } from 'sdi/source';
import { Option, none, some } from 'fp-ts/lib/Option';
import { PROD_THESH_HIGH, PROD_THESH_MEDIUM } from '../../queries/simulation'


const logger = debug('sdi:solar/perspective');



type Finalizer = (c: CanvasRenderingContext2D) => void;
type Transformer = (pt: vec3) => vec2;
type Prepper = (c: CanvasRenderingContext2D, f: Feature) => () => void;
type n3 = [number, number, number];


function scalarDiv2(a: vec2, s: number) {
    return vec2.fromValues(a[0] / s, a[1] / s);
}

function scalarMul2(a: vec2, s: number) {
    return vec2.fromValues(a[0] * s, a[1] * s);
}

const zAxis = vec3.fromValues(0, 0, 1);

// << utils
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


function getLineRingCoord(t: Transformer, lr: n3[]) {
    return lr.map(pt => t(vec3.fromValues(pt[0], pt[1], pt[2])));
}

function getPolygonCoords(t: Transformer, p: n3[][]) {
    return p.map(lr => getLineRingCoord(t, lr));
}

function getMultiPolygonCoords(t: Transformer, m: n3[][][]) {
    return m.map(p => getPolygonCoords(t, p));
}


// draw
function drawLineRingCoord(ctx: CanvasRenderingContext2D, finalizer: Finalizer, lr: vec2[]) {
    const start = lr[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    lr.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
    finalizer(ctx);
}

function drawPolygonCoords(ctx: CanvasRenderingContext2D, finalizer: Finalizer, p: vec2[][]) {
    return p.map(lr => drawLineRingCoord(ctx, finalizer, lr));
}

function drawMultiPolygonCoords(ctx: CanvasRenderingContext2D, finalizer: Finalizer, m: vec2[][][]) {
    return m.map(p => drawPolygonCoords(ctx, finalizer, p));
}



export interface Camera {
    pos: vec3;
    target: vec3;
    viewport: vec2;
}


function getTransform(cam: Camera): Transformer {
    const CT = vec3.sub(vec3.create(), cam.target, cam.pos);
    const angle = vec3.angle(CT, zAxis);
    const normal = vec3.cross(vec3.create(), zAxis, CT);
    const rotMat = mat4.fromRotation(mat4.create(), -angle, normal);
    const dist = vec3.dist(cam.pos, cam.target);
    const toCenter = mat3.fromTranslation(mat3.create(), scalarDiv2(cam.viewport, 2));

    return (pt: vec3) => {
        const pt0 = vec3.sub(vec3.create(), pt, cam.pos);
        const ptRot = (
            rotMat === null ?
                pt0 :
                vec3.transformMat4(vec3.create(), pt0, rotMat)
        );
        let pt2 = vec2.fromValues(ptRot[0], ptRot[1]);
        pt2 = scalarMul2(pt2, cam.viewport[0] / dist);
        return vec2.transformMat3(vec2.create(), pt2, toCenter);
    };

}

export function perspective(
    cam: Camera,
    buildings: FeatureCollection,
    roofs: FeatureCollection,
): Option<string> {
    const width = cam.viewport[1];
    const height = cam.viewport[1];
    const tranform = getTransform(cam);


    const painter =
        (
            ctx: CanvasRenderingContext2D,
            prep: Prepper,
            fin: Finalizer,
            fc: FeatureCollection,
        ) => {
            fc.features.forEach((f) => {
                const end = prep(ctx, f);
                const geom = f.geometry;
                const gt = geom.type;
                if ('MultiPolygon' === gt) {
                    drawMultiPolygonCoords(ctx, fin,
                        getMultiPolygonCoords(tranform, geom.coordinates as n3[][][]));
                }
                else if ('Polygon' === gt) {
                    drawPolygonCoords(ctx, fin,
                        getPolygonCoords(tranform, geom.coordinates as n3[][]));
                }
                end();
            });
        };


    const buildingFinalizer: Finalizer = c => c.stroke();
    const roofFinalizer: Finalizer = c => c.fill();

    const buildingPrepper: Prepper =
        (c) => {
            c.save();
            c.strokeStyle = '#666';
            c.lineWidth = 0.5;
            return () => c.restore();
        };

    const roofPrepper: Prepper =
        (c, f) => {
            c.save();
            const p = getFeatureProp(f, 'productivity', 0);
            if (p >= PROD_THESH_HIGH) {
                c.fillStyle = '#00f';
            }
            else if (p > PROD_THESH_MEDIUM && p < PROD_THESH_HIGH) {
                c.fillStyle = '#0f0';
            }
            else {
                c.fillStyle = '#f00';
            }

            return () => c.restore();
        };


    const renderFrame =
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, width, height);
            painter(ctx, buildingPrepper, buildingFinalizer, buildings);
            painter(ctx, roofPrepper, roofFinalizer, roofs);
        };


    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width.toFixed());
    canvas.setAttribute('height', height.toFixed());
    const context = canvas.getContext('2d');


    if (context) {
        renderFrame(context);
        return some(canvas.toDataURL());
    }
    return none;
}


logger('loaded');
