import { dispatch, observe } from '../shape';
import { getRoot } from './queries';
import { MessageRecordLang } from '../source';


export const setLang = (l: MessageRecordLang) => {
    document.body.setAttribute('lang', l);
    dispatch('app/lang', () => l);
};

export const observeLang =
    (f: (l: MessageRecordLang) => void) => observe('app/lang', f);

export const navigateRoot =
    () => window.location.assign(getRoot());
