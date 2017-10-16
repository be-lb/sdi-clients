import { Credentials } from 'sdi/source';
import { DIV, H1, INPUT } from '../elements';
import { getUsername, getPassword } from '../../queries/login';
import { setUsername, setPassword, tryLogin } from '../../events/login';
import button from '../button';
import tr from '../../locale';



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
