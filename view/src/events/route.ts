

import { query, queryK, dispatchK, dispatch } from 'sdi/shape';

import events from './app';
import { AppLayout } from '../shape/types';


const hasHistory = ((typeof window !== 'undefined') && window.history && window.history.pushState);

type historyStateKind = 'home' | 'map';
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
        if (r.length > 0) {
            events.clearMap();
            dispatch('app/current-map', () => r[0]);
            events.loadMap();
            events.setLayout(AppLayout.MapAndInfo);
        }
        else {
            events.loadAllMaps();
            events.setLayout(AppLayout.MapNavigatorFS);
        }
    };


const pushMap =
    (mid: string) => {
        if (hasHistory) {
            const s: HistoryState = {
                kind: 'map',
                route: [mid],
            };

            window.history.pushState(
                s,
                `View - ${mid}`,
                `${query('app/root')}view/${mid}`);
        }
    };

const pushHome =
    () => {
        if (hasHistory) {
            const s: HistoryState = {
                kind: 'home',
                route: [],
            };

            window.history.pushState(
                s,
                `View - Atlas`,
                `${query('app/root')}view/`);
        }
    };



export const navigateHome =
    () => {
        setRoute(() => ([]));
        navigate();
        pushHome();
    };

export const navigateMap =
    (mid: string) => {
        setRoute(() => ([mid]));
        navigate();
        pushMap(mid);
    };

(function () {
    if (hasHistory) {
        window.onpopstate = (event) => {
            const s = event.state as HistoryState;
            switch (s.kind) {
                case 'home':
                    setRoute(() => s.route);
                    break;
                case 'map':
                    setRoute(() => s.route);
                    break;
            }
            navigate();
        };
    }
})();
