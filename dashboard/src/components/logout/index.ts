
import { fromNullable } from 'fp-ts/lib/Option';

import { DIV, A, SPAN } from 'sdi/components/elements';
import { IUser } from 'sdi/source';
import tr from 'sdi/locale';

import { tryLogout } from '../../events/login';
import { button } from '../button';
import { getUserData } from '../../queries/app';





const logoutButton = button('logout', 'logout');

const username =
    (user: IUser) => {
        const ut = user.name.trim();
        if (ut.length === 0) {
            return `User ${user.id}`;
        }
        return ut;
    }

const renderLoggedIn =
    (user: IUser) =>
        DIV({ className: 'login-widget' },
            SPAN({ className: 'username' }, username(user)),
            logoutButton(tryLogout));

const renderAnonymous =
    () =>
        DIV({ className: 'login-widget' },
            A({ href: '/client/login/' }, tr('login')));

const render =
    () => fromNullable(getUserData()).foldL(
        renderAnonymous,
        renderLoggedIn,
    );

export default render;
