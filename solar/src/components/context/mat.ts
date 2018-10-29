import { vec3, mat3, mat4, vec2 } from 'gl-matrix';



function scalarDiv2(a: vec2, s: number) {
    return vec2.fromValues(a[0] / s, a[1] / s);
}


function scalarMul2(a: vec2, s: number) {
    return vec2.fromValues(a[0] * s, a[1] * s);
}

const zAxis = vec3.fromValues(0, 0, 1);



// it's not in the decl file :/
function angle2(a: vec2, b: vec2) {
    const x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1];

    let len1 = x1 * x1 + y1 * y1;
    if (len1 > 0) {
        // TODO: evaluate use of glm_invsqrt here?
        len1 = 1 / Math.sqrt(len1);
    }

    let len2 = x2 * x2 + y2 * y2;
    if (len2 > 0) {
        // TODO: evaluate use of glm_invsqrt here?
        len2 = 1 / Math.sqrt(len2);
    }

    const cosine = (x1 * x2 + y1 * y2) * len1 * len2;


    if (cosine > 1.0) {
        return 0;
    }
    else if (cosine < -1.0) {
        return Math.PI;
    } else {
        return Math.acos(cosine);
    }
}

export interface Camera {
    pos: vec3;
    target: vec3;
    viewport: vec2;
}

export type Transform = (pt: vec3, scalePoint?: boolean) => vec2;

export function getTranformFunction(cam: Camera): Transform {

    const tref = vec3.fromValues(cam.target[0], cam.target[1], cam.target[2] + 10);
    const CT = vec3.sub(vec3.create(), cam.target, cam.pos);
    const tref0 = vec3.sub(vec3.create(), tref, cam.pos);

    const angle = vec3.angle(CT, zAxis);
    const normal = vec3.cross(vec3.create(), zAxis, CT);
    const rotMat = mat4.fromRotation(mat4.create(), -angle, normal);


    const trefRot = rotMat === null ?
        tref0 :
        vec3.transformMat4(vec3.create(), tref0, rotMat);

    const dist = vec3.dist(cam.pos, cam.target);

    const ref2d = vec2.fromValues(trefRot[0], trefRot[1]);
    const refAngle = angle2(vec2.fromValues(0, -1), ref2d);

    const zrot = mat3.fromRotation(mat3.create(),
        ref2d[0] < 0 ? refAngle : -refAngle);

    const toCenter = mat3.fromTranslation(mat3.create(), scalarDiv2(cam.viewport, 2));

    const scale = cam.viewport[0] / dist;

    const t = function transform(pt: vec3, scalePoint = false) {
        const pt0 = vec3.sub(vec3.create(), pt, cam.pos);
        const ptRot = rotMat === null ?
            pt0 :
            vec3.transformMat4(vec3.create(), pt0, rotMat);

        if (!scalePoint) {
            const pt2d = vec2.transformMat3(
                vec2.create(),
                scalarMul2(
                    vec2.fromValues(ptRot[0], ptRot[1]), scale),
                zrot);

            return vec2.transformMat3(vec2.create(), pt2d, toCenter);
        }

        const dscale = cam.viewport[0] / vec3.dist(cam.pos, pt);
        const pt2d = vec2.transformMat3(
            vec2.create(),
            scalarMul2(
                vec2.fromValues(ptRot[0], ptRot[1]), dscale),
            zrot);

        return vec2.transformMat3(vec2.create(), pt2d, toCenter);
    };
    return t;
}

