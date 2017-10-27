import { Credentials } from 'sdi/source';
import tr from 'sdi/locale';
import { DIV, H1, INPUT } from 'sdi/components/elements';

import { getUsername, getPassword } from '../../queries/login';
import { setUsername, setPassword, tryLogin } from '../../events/login';
import { button } from '../button';



export interface LoginForm {
    credentials: Credentials;
}

export const defaultLoginForm =
    (): LoginForm => ({
        credentials: {
            username: '',
            password: '',
        },
    });


const loginButton = button('login', 'login');

const renderUsername =
    () => (
        DIV({ className: 'username' },
            DIV({ className: 'label' }, tr('userName')),
            INPUT({
                type: 'text',
                defaultValue: getUsername(),
                onChange: e => setUsername(e.currentTarget.value),
            })));


const renderPassword =
    () => (
        DIV({ className: 'password' },
            DIV({ className: 'label' }, tr('password')),
            INPUT({
                type: 'password',
                defaultValue: getPassword(),
                onChange: e => setPassword(e.currentTarget.value),
            })));


const render =
    () => (
        DIV({ className: 'login-wrapper' },
            H1({}, tr('connectionSDI')),
            DIV({ className: 'login-widget' },
                renderUsername(),
                renderPassword(),
                loginButton(tryLogin))));

export default render;
