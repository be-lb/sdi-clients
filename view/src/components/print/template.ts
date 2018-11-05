
import { fromPredicate, Option } from 'fp-ts/lib/Option';

import { Rect, Box, TextAlign } from 'sdi/print/context';

type ResAnnotation = { resolution: number };

interface TemplateSpec {
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


export type Spec = TemplateSpec & ResAnnotation;

const makeSpec =
    (s: PartialSpec): TemplateSpec => ({
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
    | 'north'
    | 'credits'
    ;



export type Template = { [k in SpecName]?: TemplateSpec } & ResAnnotation;

export type TemplateName =
    | 'a4/portrait'
    | 'a4/landscape'
    | 'a0/portrait'
    | 'a0/landscape'
    ;

type TemplateCollection = { [k in TemplateName]: Template };

const templates: TemplateCollection = {
    'a4/portrait': {
        resolution: 200,
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
            rect: { x: 16, y: 212, width: 180, height: 10 },
            fontSize: 5.5,
        }),

        north: makeSpec({
            rect: { x: 188, y: 208, width: 6, height: 6 },
            strokeWidth: 0.5,
        }),

        scaleline: makeSpec({
            rect: { x: 146, y: 205, width: 40, height: 12 },
            strokeWidth: 0.5,
            fontSize: 8,
        }),

        credits: makeSpec({
            rect: { x: 152, y: 277, width: 17, height: 30 / 2 },
            fontSize: 5.5,
            textAlign: 'left',
        }),

        logo: makeSpec({ rect: { x: 175, y: 275, width: 23, height: 10 } }),
    },

    'a4/landscape': {
        resolution: 200,
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
            fontSize: 5.5,
        }),

        north: makeSpec({
            rect: { x: 187, y: 188, width: 6, height: 6 },
            strokeWidth: 0.5,
        }),

        scaleline: makeSpec({
            rect: { x: 145, y: 185, width: 40, height: 12 },
            strokeWidth: 0.5,
            fontSize: 8,
        }),


        credits: makeSpec({
            rect: { x: 205, y: 189, width: 17, height: 10 },
            fontSize: 5.5,
            textAlign: 'left',
        }),
        logo: makeSpec({ rect: { x: 226, y: 187, width: 23, height: 10 } }),
    },

    'a0/portrait': {
        resolution: 100,
        title: makeSpec({
            rect: { x: 30, y: 30, width: 781, height: 104 },
            textAlign: 'left',
            fontSize: 96,
            color: '#006f90',
        }),

        map: makeSpec({
            rect: { x: 30, y: 134, width: 781, height: 781 },
            color: '#949499',
        }),


        legend: makeSpec({ rect: { x: 30, y: 781 + 144, width: 781, height: 210 } }),
        legendItem: makeSpec({
            rect: { x: 0, y: 0, width: 272, height: 20 },
            fontSize: 24,
        }),

        attribution: makeSpec({
            rect: { x: 37, y: 134 + 771 - 5, width: 500, height: 40 },
            fontSize: 22,
        }),

        north: makeSpec({
            rect: { x: 787, y: 134 + 750 + 12, width: 15, height: 15 },
            strokeWidth: 1,
        }),

        scaleline: makeSpec({
            rect: { x: 577, y: 134 + 745 + 10, width: 200, height: 27 },
            strokeWidth: 1,
            fontSize: 22,
        }),

        credits: makeSpec({
            rect: { x: 620, y: 1125, width: 65, height: 40 },
            fontSize: 22,
            textAlign: 'left',
        }),

        logo: makeSpec({ rect: { x: 719, y: 1119, width: 92, height: 40 } }),
    },

    'a0/landscape': {
        resolution: 150,
        title: makeSpec({
            rect: { x: 30 + 781 + 20, y: 30, width: 328, height: 104 },
            textAlign: 'left',
            fontSize: 96,
            color: '#006f90',
        }),

        map: makeSpec({
            rect: { x: 30, y: 30, width: 781, height: 781 },
            color: '#949499',
        }),


        legend: makeSpec({ rect: { x: 30 + 781 + 20, y: 30 + 104 + 15, width: 328, height: 841 - 30 - 104 - 15 - 15 - 40 - 30 } }),
        legendItem: makeSpec({
            rect: { x: 0, y: 0, width: 272, height: 20 },
            fontSize: 24,
        }),

        attribution: makeSpec({
            rect: { x: 37, y: 30 + 771 - 5, width: 500, height: 40 },
            fontSize: 22,
        }),

        north: makeSpec({
            rect: { x: 787, y: 30 + 750 + 12, width: 15, height: 15 },
            strokeWidth: 1,
        }),

        scaleline: makeSpec({
            rect: { x: 577, y: 30 + 745 + 10, width: 200, height: 27 },
            strokeWidth: 1,
            fontSize: 22,
        }),

        credits: makeSpec({
            rect: { x: 30 + 781 + 20, y: 841 - 30 - 40 + 5, width: 65, height: 40 },
            fontSize: 22,
            textAlign: 'left',
        }),

        logo: makeSpec({ rect: { x: 30 + 781 + 20 + 15 + 65, y: 841 - 30 - 40, width: 92, height: 40 } }),
    },

};


const getTemplate =
    (name: TemplateName) => templates[name];


const withSpec =
    (template: Template, specName: SpecName) =>
        fromPredicate<Template>(t => specName in t)(template)
            .map(t => Object.assign({}, t[specName], { resolution: template.resolution }));

export interface ApplyFn<T = Box> {
    (specName: SpecName, fn: SpecFn<T>): Option<T>;
}

export interface SpecFn<T = Box> {
    (s: Spec): T;
}

export const getResolution =
    (templateName: TemplateName) => getTemplate(templateName).resolution;


export const applySpec =
    (templateName: TemplateName) =>
        <T = Box>(specName: SpecName, fn: SpecFn<T>) =>
            withSpec(getTemplate(templateName), specName).map(fn);


