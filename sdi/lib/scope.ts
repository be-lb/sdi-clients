
import * as debug from 'debug';
import { Option, some, none } from 'fp-ts/lib/Option';

const logger = debug('sdi:scope');

type LetValue<S, A> =
    | Option<A>
    | ((s: S) => Option<A>)
    ;

class Scope<S> {

    constructor(private scope: Option<S>) { }

    let<K extends string, A>(k: K, o: LetValue<S, A>): Scope<S & {[k in K]: A}> {
        type t = S & {[k in K]: A};
        const v = typeof o === 'function' ?
            this.scope.fold(() => none, s => o(s)) :
            o;
        const s = v.fold(
            () => { logger(`none ${k}`); return none; },
            fv => this.scope.map(
                ts => Object.assign({}, ts, { [k]: fv })));

        return (new Scope<t>(s as Option<t>));
    }



    map<A>(f: (s: S) => A): Option<A> {
        return this.scope.map(f);
    }

    toOption() {
        return this.scope;
    }
}

/**
 * const v = scope
 *   .let('a', some(1))
 *   .let('b', s => some(s.a + 2))
 *   .let('c', some(3))
 *   .map(({a,c}) => a + c);
 * 
 * >> some(6)
 */
export const scope = () => new Scope(some({}));
