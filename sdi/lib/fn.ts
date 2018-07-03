import { fromNullable } from 'fp-ts/lib/Option';



export function fnOpt0<Ret>(f: () => Ret | null) {
    return function () {
        return fromNullable(f());
    };
}

export function fnOpt1<Ret, A>(f: (a: A) => Ret | null) {
    return function (a: A) {
        return fromNullable(f(a));
    };
}

export function fnOpt2<Ret, A, B>(f: (a: A, b: B) => Ret | null) {
    return function (a: A, b: B) {
        return fromNullable(f(a, b));
    };
}

export function fnOpt3<Ret, A, B, C>(f: (a: A, b: B, c: C) => Ret | null) {
    return function (a: A, b: B, c: C) {
        return fromNullable(f(a, b, c));
    };
}


export function fnOpt4<Ret, A, B, C, D>(f: (a: A, b: B, c: C, d: D) => Ret | null) {
    return function (a: A, b: B, c: C, d: D) {
        return fromNullable(f(a, b, c, d));
    };
}
