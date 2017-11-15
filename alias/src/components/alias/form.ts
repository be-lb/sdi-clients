
import { Component, createElement } from 'react';

import {
    DIV,
    SPAN,
    INPUT,
} from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { observeLang } from 'sdi/app';

import { getFormSelect, getFormReplace } from '../../queries/alias';
import { setFormSelect, setFormReplace, formObserve, saveForm, buildForm, deleteAlias } from '../../events/alias';
import { button, remove } from '../button';



type TextGetter = () => string;
type TextSetter = (a: string) => void;

interface GS {
    g: TextGetter;
    s: TextSetter;
    className: string,
    labelKey: MessageKey,
}

interface VS {
    value: string;
    label: string;
}

class Input extends Component<GS, VS> {
    constructor(gs: GS, vs: VS) {
        super(gs, vs);
        this.state = vs;
    }

    shouldComponentUpdate() {
        // const {  } = this.state;
        // return value === this.props.g();
        return true;
    }

    componentWillMount() {
        formObserve(() => {
            this.setState({ value: this.props.g() });
        });
        observeLang(() => {
            this.setState({ label: tr(this.props.labelKey) });
        });
        this.setState({
            value: this.props.g(),
            label: tr(this.props.labelKey),
        });
    }

    render() {
        return (
            DIV({ className: this.props.className },
                SPAN({ className: 'input-label' }, this.state.label),
                INPUT({
                    value: this.state.value,
                    type: 'text',
                    onChange: e => this.setState({
                        value: e.currentTarget.value,
                    }),
                    onBlur: () => this.props.s(this.state.value),
                }))
        );
    }
}

const renderInputText =
    (className: string, label: MessageKey) =>
        (get: TextGetter, set: TextSetter) => {
            return createElement(
                Input,
                { s: set, g: get, className, labelKey: label },
                { value: '', label: '' }
            );
        };


const renderSelect =
    renderInputText('form-select', 'term')
        (getFormSelect, setFormSelect);

const renderReplaceFr =
    renderInputText('form-replace', 'replaceFR')
        (getFormReplace('fr'), setFormReplace('fr'));

const renderReplaceNl =
    renderInputText('form-replace', 'replaceNL')
        (getFormReplace('nl'), setFormReplace('nl'));


const renderActions =
    () => (
        DIV({ className: 'form-actions' },
            button('save', 'save')(saveForm),
            button('add', 'add')(() => buildForm('')),
            remove('alias-remove', 'remove')(deleteAlias)
        )
    );


const render =
    () => (
        DIV({
            className: 'form',
        },
            renderSelect,
            renderReplaceNl,
            renderReplaceFr,
            renderActions()));

export default render;
