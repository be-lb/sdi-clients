



export interface Brand<B extends string> {
    readonly '@@brand': B;
}

export type Branded<T, B extends string> = T & Brand<B>;

/**
 * return the brand of a Branded value
 * avoid looking up a not-yet-existing symbol
 * 
 * @param a Branded value
 */
export function brand<T, B extends string>(a: Branded<T, B>) {
    return a['@@brand'];
}

function branded<T, B extends string>(b: B) {
    return function (a: T): Branded<T, B> {
        return Object.assign(a, { '@@brand': b });
    };
}

function filterNotUndefined<T>(as: (T | undefined)[]): T[] {
    const r: T[] = [];
    for (const i of as) {
        if (typeof i !== 'undefined') {
            r.push(i);
        }
    }
    return r;
}

export type Cast<T, U extends string> = (a: Branded<T, U>) => T;


export function Branded<T, U extends string>(val: Cast<T, U>){

    return function<B extends string>(b: B){
        type Name = B;
        const create = branded<T, Name>(b);

        function op(f: (...ts: T[]) => T) {
            function op_<TA extends Branded<T, U>, TB extends Branded<T, U>, TC extends Branded<T, U>>(a?: TA, b?: TB, c?: TC) {
                const args = filterNotUndefined([a, b, c]);
                return create(f(
                    ...args.map(val)));
            }
            return op_;
        }

        function map<RT>(f: (...ts: T[]) => RT) {
            function map_<TA extends Branded<T, U>, TB extends Branded<T, U>, TC extends Branded<T, U>>(a?: TA, b?: TB, c?: TC) {
                const args = filterNotUndefined([a, b, c]);
                return f(...args.map(val));
            }
            return map_;
        }


        return Object.assign(create, { op, map });
    }
}

/**
 * Build a Brand constructor and operator
 * It expects 3 type parameters
 * - T  source type
 * - U  set of brands
 * - B  brand
 * 
 * @param val A function that maps other branded values to this one
 */
// export function Branded<T, U extends string>(b: string, val: Cast<T, U>) {
//     type Name = typeof b;
//     const create = branded<T, Name>(b);

//     function op(f: (...ts: T[]) => T) {
//         function op_<TA extends Branded<T, U>, TB extends Branded<T, U>, TC extends Branded<T, U>>(a?: TA, b?: TB, c?: TC) {
//             const args = filterNotUndefined([a, b, c]);
//             return create(f(
//                 ...args.map(val)));
//         }
//         return op_;
//     }

//     function map<RT>(f: (...ts: T[]) => RT) {
//         function map_<TA extends Branded<T, U>, TB extends Branded<T, U>, TC extends Branded<T, U>>(a?: TA, b?: TB, c?: TC) {
//             const args = filterNotUndefined([a, b, c]);
//             return f(...args.map(val));
//         }
//         return map_;
//     }


//     return Object.assign(create, { op, map });
// }



// type E = 'Meter' | 'Milimeter';
// const Meter = BrandedClass<number, E, 'Meter'>((a) => {
//     switch (brand(a)) {
//         case 'Meter': return a;
//         case 'Milimeter': return a / 1000;
//     }
// });
// const Milimeter = BrandedClass<number, E, 'Milimeter'>((a) => {
//     switch (brand(a)) {
//         case 'Meter': return a * 1000;
//         case 'Milimeter': return a;
//     }
// });

// const m = Meter.new(123);
// const mm = Milimeter.new(123);

// const addMeter = Meter.op((a, b) => a + b);
// const r = addMeter(m, mm); // >> const r: Branded<number, "Meter">


// const e = m === mm; // Error: Operator '===' cannot be applied to types 'Branded<number, "Meter">' and 'Branded<number, "Milimeter">'.
// const ee = m + mm; // works :( 


// function tf(n: Branded<number, 'Meter'>) {
//     return n;
// }

// tf(mm); // Error: Type '"Milimeter"' is not assignable to type '"Meter"'.
// tf(12); // Error: Type '12' is not assignable to type 'Brand<"Meter">'.
// tf(m); // OK



