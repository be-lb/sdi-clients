

import * as debug from 'debug';
import { Component, createElement } from 'react';

import { INPUT } from './elements';

const logger = debug('sdi:components/input');

type Getter<T> = () => T;
type Setter<T> = (a: T) => void;


interface InputProps<T> {
    get: Getter<T>;
    set: Setter<T>;
}

interface InputValue<T> {
    readonly value: T;
}

const value =
    <T>(value: T): InputValue<T> => ({ value });

type InputAttributes = React.AllHTMLAttributes<HTMLInputElement>;

class InputText extends Component<InputProps<string>, InputValue<string>> {
    attrs: () => InputAttributes;

    constructor(props: InputProps<string>, attrs?: InputAttributes) {
        super(props);
        const extraAttributes = attrs ? attrs : {};

        const update =
            (n: string) => {
                this.setState(value(n));
                props.set(n);
            };

        this.attrs =
            () => ({
                ...extraAttributes,
                value: this.state.value,
                type: 'text',
                onChange: e => update(e.currentTarget.value),
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<string>>) {
        if (this.props.get !== nextProps.get) {
            this.setState(value(this.props.get()));
        }
    }
}

class InputNumber extends Component<InputProps<number>, InputValue<number>> {
    attrs: () => InputAttributes;

    constructor(props: InputProps<number>, attrs?: InputAttributes) {
        super(props);
        const extraAttributes = attrs ? attrs : {};

        const update =
            (n: number) => {
                this.setState(value(n));
                props.set(n);
            };

        this.attrs =
            () => ({
                ...extraAttributes,
                value: this.state.value,
                type: 'number',
                onChange: e => update(e.currentTarget.valueAsNumber),
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<number>>) {
        if (this.props.get !== nextProps.get) {
            this.setState(value(this.props.get()));
        }
    }
}

class InputNullableNumber extends Component<InputProps<number | null>, InputValue<number | null>> {
    attrs: () => InputAttributes;

    constructor(props: InputProps<number>, attrs?: InputAttributes) {
        super(props);
        const extraAttributes = attrs ? attrs : {};

        const update =
            (n: number) => {
                this.setState(value(n));
                props.set(n);
            };

        this.attrs =
            () => ({
                ...extraAttributes,
                value: this.state.value ? this.state.value : 0,
                type: 'number',
                onChange: e => update(e.currentTarget.valueAsNumber),
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<number>>) {
        if (this.props.get !== nextProps.get) {
            this.setState(value(this.props.get()));
        }
    }
}


export const inputText =
    (get: Getter<string>, set: Setter<string>, attrs?: InputAttributes) =>
        createElement(InputText, { set, get }, attrs);

export const inputNumber =
    (get: Getter<number>, set: Setter<number>, attrs?: InputAttributes) =>
        createElement(InputNumber, { set, get }, attrs);

export const inputNullableNumber =
    (get: Getter<number | null>, set: Setter<number | null>, attrs?: InputAttributes) =>
        createElement(InputNullableNumber, { set, get }, attrs);


logger('loaded');
