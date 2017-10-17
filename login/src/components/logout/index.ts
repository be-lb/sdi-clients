import { DIV, H1 } from '../elements';
import { tryLogout } from '../../events/login';
import button from '../button';
import tr from '../../locale';




const logoutButton = button('logout', 'logout');


const render =
    () => (
        DIV({ className: 'login-wrapper' },
            H1({}, tr('connectionSDI')),
            DIV({ className: 'login-widget' },
                logoutButton(tryLogout))));

export default render;
