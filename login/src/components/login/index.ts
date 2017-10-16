import { Credentials } from 'sdi/source';
import { DIV, INPUT } from '../elements';
import { getUsername, getPassword } from '../../queries/login';
import { setUsername, setPassword, tryLogin } from '../../events/login';
import button from '../button';


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
            INPUT({
                type: 'text',
                defaultValue: getUsername(),
                onChange: e => setUsername(e.currentTarget.value),
            })));


const renderPassword =
    () => (
        DIV({ className: 'password' },
            INPUT({
                type: 'password',
                defaultValue: getPassword(),
                onChange: e => setPassword(e.currentTarget.value),
            })));


const render =
    () => (
        DIV({},
            renderUsername(),
            renderPassword(),
            loginButton(tryLogin)));

export default render;
