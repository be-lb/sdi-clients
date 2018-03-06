

import { query } from 'sdi/shape';
import { uniqIdGen } from 'sdi/util';

import events from './app';
import { AppLayout } from '../shape/types';


const hasHistory = ((typeof window !== 'undefined') && window.history && window.history.pushState);

type HistoryStateKind = 'home' | 'map';

interface HistoryStateBase<K extends HistoryStateKind, T=null> {
    kind: K;
    data: T;
}
type HistoryStateHome = HistoryStateBase<'home'>;
type HistoryStateMap = HistoryStateBase<'map', string>;

type HistoryState =
    | HistoryStateHome
    | HistoryStateMap
    ;

const actionId = uniqIdGen('map-action-');
const urlHome = () => `${query('app/root')}compose/`;
const urlMap = () => `${query('app/root')}compose/${actionId()}`;


const pushMap =
    (mid: string) => {
        if (hasHistory) {
            const s: HistoryStateMap = {
                kind: 'map',
                data: mid,
            };

            window.history.pushState(s, `Studio - ${mid}`, urlMap());
        }
    };

const pushHome =
    () => {
        if (hasHistory) {
            const s: HistoryStateHome = {
                kind: 'home',
                data: null,
            };

            window.history.pushState(s, `Studio - Home`, urlHome());
        }
    };


const goHome =
    () => {
        events.setCurrentMapId(null);
        events.setLayout(AppLayout.Dashboard);
    };

export const navigateHome =
    () => {
        goHome();
        pushHome();
    };

const goMap =
    (mid: string) => {
        events.setCurrentMapId(mid);
        events.setLayout(AppLayout.MapAndInfo);
    };

export const navigateMap =
    (mid: string) => {
        goMap(mid);
        pushMap(mid);
    };

(function () {
    if (hasHistory) {
        window.onpopstate = (event) => {
            const s = event.state as HistoryState;
            switch (s.kind) {
                case 'home':
                    goHome();
                    break;
                case 'map':
                    goMap(s.data);
                    break;
            }
        };
    }
})();
