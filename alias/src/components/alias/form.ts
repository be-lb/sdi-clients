
import { Component, createElement } from 'react';

import {
    DIV,
    SPAN,
    INPUT,
} from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { getFormSelect, getFormReplace } from '../../queries/alias';
import { setFormSelect, setFormReplace, formObserve } from '../../events/alias';



type TextGetter = () => string;
type TextSetter = (a: string) => void;

interface GS {
    g: TextGetter;
    s: TextSetter;
    label: MessageKey,
    className: string,
}

interface VS {
    value: string;
}

class Input extends Component<any, VS> {
    constructor(gs: GS, vs: VS) {
        super(gs, vs);
        this.state = vs;
    }

    shouldComponentUpdate() {
        // const { value } = this.state;
        // return value === this.props.g();
        return true;
    }

    componentWillMount() {
        formObserve(() => {
            this.setState({ value: this.props.g() });
        });
        this.setState({ value: this.props.g() });
    }

    render() {
        return (
            DIV({ className: this.props.className },
                SPAN({ className: 'input-label' }, tr(this.props.label)),
                INPUT({
                    value: this.state.value,
                    type: 'text',
                    onChange: e => this.setState({ value: e.currentTarget.value }),
                    onBlur: () => this.props.s(this.state.value),
                }))
        );
    }
}

const renderInputText =
    (className: string, label: MessageKey) =>
        (get: TextGetter, set: TextSetter) => {
            // const defaultValue = get();
            // const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     const newVal = e.currentTarget.value;
            //     set(newVal);
            // };
            // return (
            //     DIV({ className: `form-input ${className}` },
            //         SPAN({ className: 'input-label' }, label),
            //         INPUT({
            //             key: className + label,
            //             defaultValue,
            //             type: 'text',
            //             onChange: update,
            //         }))
            // );

            // return (new Input(label, className, {
            //     s: set,
            //     g: get,
            // }));

            return createElement(Input, { s: set, g: get, className, label }, { value: '' });
        };


const renderSelect =
    renderInputText('form-select', 'select')
        (getFormSelect, setFormSelect);

const renderReplaceFr =
    renderInputText('form-replace', 'replaceFR')
        (getFormReplace('fr'), setFormReplace('fr'));

const renderReplaceNl =
    renderInputText('form-replace', 'replaceNL')
        (getFormReplace('nl'), setFormReplace('nl'));

const render =
    () => (
        DIV({
            className: 'form',
        },
            renderSelect,
            renderReplaceNl,
            renderReplaceFr));

export default render;
