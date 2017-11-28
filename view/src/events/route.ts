
import { fromNullable } from 'fp-ts/lib/Option';

import { query, queryK, dispatchK, dispatch } from 'sdi/shape';
import { scopeOption } from 'sdi/lib';

import events from './app';
import { viewEvents } from './map';
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

const getNumber =
    (s?: string) => {
        if (s) {
            const n = parseFloat(s);
            if (!Number.isNaN(n)) {
                return n;
            }
        }
        return null;
    }

const setMapView =
    () => {
        const r = cleanRoute();
        scopeOption()
            .let('lat', fromNullable(getNumber(r[1])))
            .let('lon', fromNullable(getNumber(r[2])))
            .let('zoom', fromNullable(getNumber(r[3])))
            .map(({ lat, lon, zoom }) => {
                viewEvents.updateMapView({
                    dirty: 'geo',
                    center: [lat, lon],
                    zoom,
                })
            })
    }

export const navigate =
    () => {
        const r = cleanRoute();
        if (r.length > 0) {
            events.clearMap();
            dispatch('app/current-map', () => r[0]);
            events.loadMap();
            events.setLayout(AppLayout.MapAndInfo);
            setMapView();
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
