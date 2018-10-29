

import * as debug from 'debug';
import { Component, createElement } from 'react';

import { INPUT } from './elements';

const logger = debug('sdi:components/input');

export type Getter<T> = () => T;
export type Setter<T> = (a: T) => void;

type InputAttributes = React.AllHTMLAttributes<HTMLInputElement>;
type AllAttributes = InputAttributes & React.Attributes;

interface InputProps<T> {
    get: Getter<T>;
    set: Setter<T>;
    attrs: AllAttributes;
}

type InputValueT = string | number | null;

interface InputValue<T extends InputValueT> {
    readonly value: T;
}

const value =
    <T extends InputValueT>(value: T): InputValue<T> => ({ value });


class InputText extends Component<InputProps<string>, InputValue<string>> {
    attrs: () => AllAttributes;

    constructor(props: InputProps<string>) {
        super(props);

        const update =
            (n: string) => {
                // logger(`text update "${n}" ${extraAttributes.key}`);
                this.setState(value(n));
                props.set(n);
            };


        this.attrs =
            () => ({
                value: this.state.value,
                type: 'text',
                onChange: e => update(e.currentTarget.value),
                ...props.attrs,
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        // logger(`text render "${this.attrs().value}" ${this.attrs().key}`);
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<string>>) {
        this.setState(value(nextProps.get()));
    }
}

class InputNumber extends Component<InputProps<number>, InputValue<number>> {
    attrs: () => AllAttributes;

    constructor(props: InputProps<number>) {
        super(props);

        const update =
            (n: number) => {
                this.setState(value(n));
                props.set(n);
            };

        this.attrs =
            () => ({
                value: this.state.value,
                type: 'number',
                onChange: e => update(e.currentTarget.valueAsNumber),
                ...props.attrs,
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<number>>) {
        this.setState(value(nextProps.get()));
    }
}

class InputNullableNumber extends Component<InputProps<number | null>, InputValue<number | null>> {
    attrs: () => AllAttributes;

    constructor(props: InputProps<number>) {
        super(props);

        const update =
            (n: number) => {
                this.setState(value(n));
                props.set(n);
            };

        this.attrs =
            () => ({
                value: this.state.value !== null ? this.state.value : undefined,
                type: 'number',
                onChange: e => update(e.currentTarget.valueAsNumber),
                ...props.attrs,
            });
    }

    componentWillMount() {
        this.setState(value(this.props.get()));
    }

    render() {
        return INPUT(this.attrs());
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps<number>>) {
        this.setState(value(nextProps.get()));
    }
}

const extraAttributesFn =
    (attrs = {} as AllAttributes): AllAttributes => attrs;

export const inputText =
    (get: Getter<string>, set: Setter<string>, attrs?: AllAttributes) =>
        createElement(InputText, { set, get, attrs: extraAttributesFn(attrs) });

export const inputNumber =
    (get: Getter<number>, set: Setter<number>, attrs?: AllAttributes) =>
        createElement(InputNumber, { set, get, attrs: extraAttributesFn(attrs) });

export const inputNullableNumber =
    (get: Getter<number | null>, set: Setter<number | null>, attrs?: AllAttributes) =>
        createElement(InputNullableNumber, { set, get, attrs: extraAttributesFn(attrs) });


logger('loaded');
