

import { has } from 'openlayers';
import { PatternAngle } from '../../source';

const { cos, sin, PI } = Math;

const rad = (a: number) => a * PI / 180;

const rotate =
    (c: [number, number], angle: number) =>
        (p: [number, number]): [number, number] =>
            [
                cos(angle) * (p[0] - c[0]) - sin(angle) * (p[1] - c[1]) + c[0],
                sin(angle) * (p[0] - c[0]) + cos(angle) * (p[1] - c[1]) + c[1],
            ];

const drawLine =
    (ctx: CanvasRenderingContext2D) =>
        (center: [number, number], w: number, h: number, angle: number) => {
            const sw = w / 2;
            const sh = h / 2;
            const rot = rotate(center, rad(angle));

            const topLeft = rot([center[0] - sw, center[1] - sh]);
            const topRight = rot([center[0] + sw, center[1] - sh]);
            const bottomRight = rot([center[0] + sw, center[1] + sh]);
            const bottomLeft = rot([center[0] - sw, center[1] + sh]);

            ctx.beginPath();
            ctx.moveTo(topLeft[0], topLeft[1]);
            ctx.lineTo(topRight[0], topRight[1]);
            ctx.lineTo(bottomRight[0], bottomRight[1]);
            ctx.lineTo(bottomLeft[0], bottomLeft[1]);
            ctx.lineTo(topLeft[0], topLeft[1]);
            ctx.fill();
        };

// const normAngle =
//     (angle: number): [number, boolean] => {
//         let smallAngle = angle;
//         let mirror = false;
//         if (smallAngle > 180) {
//             smallAngle = smallAngle - 180;
//         }
//         if (smallAngle > 90) {
//             mirror = true;
//             smallAngle = 90 - (smallAngle - 90);
//         }

//         return [smallAngle, mirror];
//     };

export const makePattern =
    (strokeWidth: number, angle: PatternAngle, color: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', {
            antialias: true,
        });
        if (context) {
            const dpr = has.DEVICE_PIXEL_RATIO;
            const ch = strokeWidth * 9 * dpr;
            const cw = ch;
            const sw = strokeWidth * dpr;
            const line = drawLine(context);
            // const [smallAngle, mirror] = normAngle(angle);
            // const B = rad(smallAngle);
            // const C = rad(90 - smallAngle);
            // const c = ch / 2;
            // // b / sin(B) = c / sin(C)
            // const b = sin(B) * (c / sin(C));
            // const cw = 2 * b;
            const ll = Math.max(cw, ch) * 2;
            let angleCorrect = 0;
            canvas.width = cw;
            canvas.height = ch;

            context.clearRect(0, 0, cw, ch);
            context.fillStyle = color;
            if (angle === 135) {
                context.scale(1, -1);
                context.translate(0, -ch);
                angleCorrect = -90;
            }
            line([0, 0], sw, ll, angle + angleCorrect);
            line([cw / 2, ch / 2], sw, ll, angle + angleCorrect);
            line([cw, ch], sw, ll, angle + angleCorrect);

            return context.createPattern(canvas, 'repeat');
        }
        return color;
    };
