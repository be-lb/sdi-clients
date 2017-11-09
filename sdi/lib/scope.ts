
// import * as debug from 'debug';
import { Some, None, some } from 'fp-ts/lib/Option';

// const logger = debug('sdi:scope');

// type LetValue<S, A> =
//     | Option<A>
//     | ((s: S) => Option<A>)
//     ;

// class Scope<S> {

//     constructor(private scope: Option<S>) { }

//     let<K extends string, A>(k: K, o: LetValue<S, A>): Scope<S & {[k in K]: A}> {
//         type t = S & {[k in K]: A};
//         const v = typeof o === 'function' ?
//             this.scope.fold(() => none, s => o(s)) :
//             o;
//         const s = v.fold(
//             () => { logger(`none ${k}`); return none; },
//             fv => this.scope.map(
//                 ts => Object.assign({}, ts, { [k]: fv })));

//         return (new Scope<t>(s as Option<t>));
//     }



//     map<A>(f: (s: S) => A): Option<A> {
//         return this.scope.map(f);
//     }

//     toOption() {
//         return this.scope;
//     }
// }

declare module 'fp-ts/lib/Option' {
    interface None<A> {
        let<N extends string, B>(name: N, other: Option<B> | ((a: A) => Option<B>)): Option<A & {[K in N]: B }>;
    }
    interface Some<A> {
        let<N extends string, B>(name: N, other: Option<B> | ((a: A) => Option<B>)): Option<A & {[K in N]: B }>;
    }
}

None.prototype.let = function () {
    return this;
};

Some.prototype.let = function (name, other) {
    const fb = typeof other === 'function' ? other(this.value) : other;
    return fb.map(b => ({ ...this.value, [name]: b }));
};



export const scopeOption = () => some({});

/**
 *  type test
 */
export const _v = scopeOption()
    .let('a', some(1))
    .let('b', s => some(s.a + 2))
    .let('c', some(3))
    .let('d', some('result: '))
    .map(({ a, c, d }) => `${d} ${a + c}`);
