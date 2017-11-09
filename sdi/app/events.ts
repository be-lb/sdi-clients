import { dispatch } from '../shape';
import { getRoot } from './queries';


export const setLang = (l: 'fr' | 'nl') => {
    document.body.setAttribute('lang', l);
    dispatch('app/lang', () => l);
};

export const navigateRoot =
    () => window.location.assign(getRoot());
