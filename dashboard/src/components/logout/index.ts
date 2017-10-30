
import { fromNullable } from 'fp-ts/lib/Option';

import { DIV } from 'sdi/components/elements';

import { tryLogout } from '../../events/login';
import { button } from '../button';
import { getUserData } from '../../queries/app';





const logoutButton = button('logout', 'logout');
const username = () => DIV({ className: 'logout-username' }, fromNullable(getUserData()).fold(
    () => '',
    u => u.name));


const render =
    () => (
        DIV({ className: 'login-widget' },
            username(),
            logoutButton(tryLogout)));

export default render;
