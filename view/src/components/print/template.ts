
import { fromPredicate, Option } from 'fp-ts/lib/Option';

import { Rect, Box, TextAlign } from '../print/context';

export interface Spec {
    rect: Rect;
    fontSize: number;
    strokeWidth: number;
    textAlign: TextAlign;
    color: string;
}

interface PartialSpec {
    rect: Rect;
    fontSize?: number;
    strokeWidth?: number;
    textAlign?: TextAlign;
    color?: string;
}

const makeSpec =
    (s: PartialSpec): Spec => ({
        fontSize: 10,
        strokeWidth: 1,
        textAlign: 'left',
        color: 'black',
        ...s,
    });

export type SpecName =
    | 'title'
    | 'map'
    | 'legend'
    | 'legendItem'
    | 'logo'
    | 'attribution'
    | 'scaleline'
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
        title: makeSpec({
            rect: { x: 15, y: 15, width: 180, height: 26 },
            textAlign: 'left',
            fontSize: 24,
            color: '#006f90',
        }),

        map: makeSpec({
            rect: { x: 15, y: 35, width: 180, height: 180 },
            color: '#949499',
        }),


        legend: makeSpec({ rect: { x: 15, y: 220, width: 180, height: 55 } }),
        legendItem: makeSpec({
            rect: { x: 0, y: 0, width: 68, height: 5 },
            fontSize: 8,
        }),

        attribution: makeSpec({
            rect: { x: 16, y: 211, width: 180, height: 10 },
            fontSize: 8,
        }),

        scaleline: makeSpec({
            rect: { x: 155 - 2, y: 201, width: 40, height: 12 },
            strokeWidth: 0.5,
        }),

        logo: makeSpec({ rect: { x: 173, y: 275, width: 23, height: 10 } }),
    },

    'a4/landscape': {
        title: makeSpec({
            rect: { x: 205, y: 15, width: 80, height: 30 },
            textAlign: 'left',
            fontSize: 24,
            color: '#006f90',
        }),

        legend: makeSpec({ rect: { x: 205, y: 47, width: 80, height: 135 } }),

        legendItem: makeSpec({
            rect: { x: 0, y: 0, width: 80, height: 5 },
            fontSize: 8,
        }),

        map: makeSpec({
            rect: { x: 15, y: 15, width: 180, height: 180 },
            color: '#949499',
        }),

        attribution: makeSpec({
            rect: { x: 16, y: 192, width: 180, height: 10 },
            fontSize: 8,
        }),

        scaleline: makeSpec({
            rect: { x: 155 - 2, y: 183 - 2, width: 40, height: 12 },
            strokeWidth: 0.5,
        }),

        logo: makeSpec({ rect: { x: 262, y: 185, width: 23, height: 10 } }),
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


