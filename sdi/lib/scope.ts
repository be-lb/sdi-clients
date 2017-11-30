
import * as debug from 'debug';

const logger = debug('sdi:lib/scope');

import { Some, None, some } from 'fp-ts/lib/Option';
import { Task } from 'fp-ts/lib/Task';


declare module 'fp-ts/lib/Option' {
    interface None<A> {
        let<N extends string, B>(name: N, other: Option<B> | ((a: A) => Option<B>)): Option<A & {[K in N]: B }>;

        pick<N extends keyof A>(name: N): Option<A[N]>;
    }
    interface Some<A> {
        let<N extends string, B>(name: N, other: Option<B> | ((a: A) => Option<B>)): Option<A & {[K in N]: B }>;

        pick<N extends keyof A>(name: N): Option<A[N]>;
    }
}

None.prototype.let = function () {
    return this;
};

None.prototype.pick = function () {
    return this;
};

Some.prototype.let = function (name, other) {
    const fb = typeof other === 'function' ? other(this.value) : other;
    if (fb.isNone()) {
        logger(`Some.let => none(${name})`);
    }
    return fb.map(b => ({ ...this.value, [name]: b }));
};

Some.prototype.pick = function (name) {
    return this.map(scope => scope[name]);
};



declare module 'fp-ts/lib/Task' {
    interface Task<A> {
        let<N extends string, B>(name: N, other: Task<B> | ((a: A) => Task<B>)): Task<A & {[K in N]: B }>;
    }
}

Task.prototype.let = function (name, other) {
    const fb = typeof other === 'function' ? other(this.value) : other;
    return fb.map(b => ({ ...this.value, [name]: b }));
};




export const scopeOption = () => some({});
export const scopeTask = () => new Task(() => Promise.resolve({}));

/**
 *  type test
 */
// export const _v1 = scopeOption()
//     .let('a', some(1))
//     .let('b', s => some(s.a + 2))
//     .let('c', some(3))
//     .let('d', some('result: '))
//     .map(({ a, c, d }) => `${d} ${a + c}`);


// const mkT =
//     <T>(p: Promise<T>) => new Task(() => p);
// const mkR =
//     <T>(a: T) => mkT(Promise.resolve(a));

// export const _v3 = scopeTask()
//     .let('a', mkR(1))
//     .let('b', s => mkR(s.a + 1))
//     .map(({ a, b }) => `${a} => ${b}`);

logger('loaded');
