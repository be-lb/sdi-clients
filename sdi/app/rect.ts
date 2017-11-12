
import * as debug from 'debug';
import { IO } from 'fp-ts/lib/IO';

const logger = debug('sdi:app/rect');

export interface RectFn {
    (t: ClientRect): void;
}

interface Sub {
    el: Element;
    fn: RectFn;
    prev: ClientRect | null;
}

let subs: Sub[] = [];

export const rect =
    (fn: RectFn) =>
        (el: Element) => {
            subs.push({ el, fn, prev: null });
        };

const eqRect =
    (a: ClientRect, b: ClientRect) => (
        a.bottom === b.bottom &&
        a.height === b.height &&
        a.left === b.left &&
        a.right === b.right &&
        a.top === b.top &&
        a.width === b.width
    );

type RS = [Sub, IO<void>];

const runSub =
    ({ el, fn, prev }: Sub): RS => {
        const rect = el.getBoundingClientRect();
        if (null === prev || !eqRect(prev, rect)) {
            // fn(rect);
            return [{ el, fn, prev: rect }, new IO(() => fn(rect))];
        }
        return [{ el, fn, prev }, new IO<void>(() => void 0)];
    };

const filterStillThere =
    (xs: Sub[]) => xs.filter(s => s.el !== null);

const run =
    () => {
        // logger(`run ${subs.length}`);
        subs = filterStillThere(subs)
            .map(runSub)
            .map((rs) => {
                rs[1].run();
                return rs[0];
            });
    };


window.setInterval(run, 250);


logger('loaded');
