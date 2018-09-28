
import { fromPredicate, Option } from 'fp-ts/lib/Option';
import { Rect, Box, TextAlign } from './context';

type ResAnnotation = { resolution: number };

export interface TemplateSpec {
    rect: Rect;
    fontSize: number;
    strokeWidth: number;
    textAlign: TextAlign;
    color: string;
}

export interface PartialSpec {
    rect: Rect;
    fontSize?: number;
    strokeWidth?: number;
    textAlign?: TextAlign;
    color?: string;
}


export type Spec = TemplateSpec & ResAnnotation;

export const makeSpec =
    (s: PartialSpec): TemplateSpec => ({
        fontSize: 10,
        strokeWidth: 1,
        textAlign: 'left',
        color: 'black',
        ...s,
    });



export type SpecName = string;
export interface Template {
    [s: string]: TemplateSpec;
}

// export type Template = PartialTemplate & ResAnnotation;

export const withSpec =
    (template: Template, resolution: number, specName: SpecName): Option<Spec> =>
        fromPredicate<Template>(t => specName in t)(template)
            .map((t) => {
                const tspec = t[specName];
                const spec = {
                    ...tspec,
                    resolution,
                };
                return spec;
            });

export interface ApplyFn<T = Box> {
    (specName: SpecName, fn: SpecFn<T>): Option<T>;
}

export interface SpecFn<T = Box> {
    (s: Spec): T;
}

export const applySpec =
    (template: Template, resolution: number) =>
        <T = Box>(specName: SpecName, fn: SpecFn<T>) =>
            withSpec(template, resolution, specName).map(fn);


