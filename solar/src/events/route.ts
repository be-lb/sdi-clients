

import { query, queryK, dispatchK } from 'sdi/shape';

import { setLayout, loadCapakey } from './app';


const hasHistory = ((typeof window !== 'undefined') && window.history && window.history.pushState);

type historyStateKind = 'locate' | 'preview' | 'detail';

interface HistoryState {
    kind: historyStateKind;
    route: string[];
}


const getRoute = queryK('app/route');
const setRoute = dispatchK('app/route');



const cleanRoute =
    () => getRoute()
        .reduce((acc, s) => {
            if (s.length > 0) {
                return acc.concat([s]);
            }
            return acc;
        }, [] as string[]);

// const getNumber =
//     (s?: string) => {
//         if (s) {
//             const n = parseFloat(s);
//             if (!Number.isNaN(n)) {
//                 return n;
//             }
//         }
//         return null;
//     };

// const setMapView =
//     () => {
//         const r = cleanRoute();
//         scopeOption()
//             .let('lat', fromNullable(getNumber(r[1])))
//             .let('lon', fromNullable(getNumber(r[2])))
//             .let('zoom', fromNullable(getNumber(r[3])))
//             .map(({ lat, lon, zoom }) => {
//                 viewEvents.updateMapView({
//                     dirty: 'geo',
//                     center: [lat, lon],
//                     zoom,
//                 });
//             });
//     };

export const navigate =
    () => {
        const r = cleanRoute();
        if (r.length > 1) {
            const screen = r[0];
            const capakey = r[1];
            loadCapakey(capakey);
            switch (screen) {
                case 'preview':
                    setLayout('Preview');
                    break;
                case 'detail':
                    setLayout('Detail');
                    break;
                default:
                    setLayout('Locate');
            }
        }
        else {
            setLayout('Locate');
        }
    };


// const pushMap =
//     (mid: string) => {
//         if (hasHistory) {
//             const s: HistoryState = {
//                 kind: 'map',
//                 route: [mid],
//             };

//             window.history.pushState(
//                 s,
//                 `View - ${mid}`,
//                 `${query('app/root')}view/${mid}`);
//         }
//     };

const push =
    (kind: historyStateKind, route: string[]) => {
        setRoute(() => route);
        if (hasHistory) {
            const s: HistoryState = {
                kind,
                route,
            };

            window.history.pushState(
                s,
                `Solar - ${kind}`,
                `${query('app/root')}solar/${route.join('/')}`);
        }
    };



export const navigateLocate =
    () => {
        push('locate', ['locate']);
        navigate();
    };

export const navigatePreview =
    (capakey: string) => {
        push('preview', ['preview', capakey]);
        navigate();
    };

export const navigateDetail =
    (capakey: string) => {
        push('detail', ['detail', capakey]);
        navigate();
    };


(function () {
    if (hasHistory) {
        window.onpopstate = (event) => {
            const s = event.state as HistoryState;
            switch (s.kind) {
                case 'locate':
                case 'preview':
                case 'detail':
                    setRoute(() => s.route);
                    break;
            }
            navigate();
        };
    }
})();
