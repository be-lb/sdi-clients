import buttonFactory from 'sdi/components/button';
import {
    queryK,
    dispatchK,
} from 'sdi/shape';


export const { button, remove } = buttonFactory(
    queryK('component/button'), dispatchK('component/button'));

