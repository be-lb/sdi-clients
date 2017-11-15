import { dispatch, observe } from '../shape';
import { getRoot } from './queries';


export const setLang = (l: 'fr' | 'nl') => {
    document.body.setAttribute('lang', l);
    dispatch('app/lang', () => l);
};

export const observeLang =
    (f: (l: 'fr' | 'nl') => void) => observe('app/lang', f);

export const navigateRoot =
    () => window.location.assign(getRoot());
