
import { fromPredicate } from 'fp-ts/lib/Option';

import { Rect, Box } from '../print/context';
import { Option } from 'fp-ts/lib/Option';


export interface Spec {
    rect: Rect;
    fontSize: number;
    strokeWidth: number;
}

interface PartialSpec {
    rect: Rect;
    fontSize?: number;
    strokeWidth?: number;
}
const makeSpec =
    (s: PartialSpec): Spec => ({
        fontSize: 10,
        strokeWidth: 1,
        ...s,
    });

export type SpecName =
    | 'title'
    | 'map'
    | 'legend'
    | 'logo'
    | 'attribution'
    ;

export type Template = {[k in SpecName]?: Spec};

export type TemplateName =
    | 'a4/portrait'
    | 'a4/landscape'
    | 'a0/portrait'
    | 'a0/landscape'
    ;

type TemplateCollection = {[k in TemplateName]: Template };

const templates: TemplateCollection = {
    'a4/portrait': {
        title: makeSpec({ rect: { x: 15, y: 40, width: 120, height: 26 } }),
        map: makeSpec({ rect: { x: 15, y: 15, width: 180, height: 180 } }),
    },

    'a4/landscape': {
        title: makeSpec({ rect: { x: 215, y: 15, width: 65, height: 60 } }),
        legend: makeSpec({ rect: { x: 215, y: 80, width: 65, height: 180 } }),
        map: makeSpec({ rect: { x: 15, y: 15, width: 180, height: 180 } }),
    },

    'a0/portrait': {

    },

    'a0/landscape': {

    },

};


const getTemplate =
    (name: TemplateName) => templates[name];


const withSpec =
    (template: Template, specName: SpecName) =>
        fromPredicate<Template>(t => specName in t)(template).map(t => t[specName]);

export interface ApplyFn<T = Box> {
    (specName: SpecName, fn: SpecFn<T>): Option<T>;
}

export interface SpecFn<T = Box> {
    (s: Spec): T;
}

export const applySpec =
    (templateName: TemplateName) =>
        <T = Box>(specName: SpecName, fn: SpecFn<T>) =>
            withSpec(getTemplate(templateName), specName).map(fn);


