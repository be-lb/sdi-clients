import * as debug from 'debug';

import { query, queryK, dispatchK } from 'sdi/shape';

import { setLayout, loadCapakey } from './app';
import { selectMapGray, selectMapOPrtho } from './map';

const logger = debug('sdi:solar/route');

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



export const navigate =
    () => {
        const r = cleanRoute();
        if (r.length > 1) {
            const screen = r[0];
            const capakey = r[1];
            setLayout('Loader');
            loadCapakey(capakey)
                .then(() => {
                    logger(`navigate(${screen}, ${capakey})`);
                    switch (screen) {
                        case 'preview':
                            setLayout('Preview');
                            selectMapGray();
                            break;
                        case 'detail':
                            setLayout('Detail');
                            selectMapGray();
                            break;
                        default:
                            setLayout('Locate:Geocoder');
                            selectMapOPrtho();
                    }
                })
                .catch(err => logger(err));
        }
        else {
            setLayout('Locate:Geocoder');
            selectMapOPrtho();
        }
    };




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
            if (event.state) {
                const s = event.state as HistoryState;
                switch (s.kind) {
                    case 'locate':
                    case 'preview':
                    case 'detail':
                        setRoute(() => s.route);
                        break;
                }
            }
            navigate();
        };
    }
})();


logger('loaded');
