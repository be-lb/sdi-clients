
import { mapOption } from 'fp-ts/lib/Array';

import { scopeOption } from 'sdi/lib';
import tr, { formatDate } from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import {
    ApplyFn,
    applySpec,
    Box,
    createContext,
    makeLayoutVertical,
    makeSpec,
    makeText,
    paintBoxes,
    Template,
    boxContent,
    boxEmpty,
    makeImage,
    makeRect,
    makeLine,
} from 'sdi/print';
import {
    withKWhY,
    withPercent,
    withTCO2Y,
    withM2,
    withKWc,
    withYear,
    withEuro,
    withLiter,
} from 'sdi/util';

import {
    areaExcellent,
    areaLow,
    areaMedium,
    streetName,
    streetNumber,
    locality,
    getOutputPv,
    totalArea,
    getObstacleArea,
    usableRoofArea,
    getPanelUnits,
    pvTechnologyLabel,
    getBuildings,
    getRoofs,
    getSystem,
    getOutputThermal,
} from '../../queries/simulation';
import { some, fromNullable } from 'fp-ts/lib/Option';
import { perspective } from '../context/perspective';
import { getCamera, emptyRoofs } from '../context/index';
import { getLabel } from './print-labels';
import { getCapakey } from '../../queries/app';

const margin = 10;
const pwidth = 210;

const assets = {
    'print-image-logo': '',
    'print-image-mask': '',
};
type Assets = typeof assets;

const styleList =
    (l: StyleSheetList): CSSStyleSheet[] => [].slice.call(l);
const ruleList =
    (s: CSSStyleSheet): CSSStyleRule[] => [].slice.call(s.cssRules);

export const loadPrintAsset =
    () => {
        // from https://developer.mozilla.org/en-US/docs/Web/API/StyleSheetList#Get_all_CSS_rules_for_the_document_using_Array_methods
        const allCSS =
            styleList(document.styleSheets)
                .reduce<CSSStyleRule[]>((prev, styleSheet) => {
                    if (styleSheet.cssRules) {
                        return prev.concat(ruleList(styleSheet));
                    }
                    else {
                        return prev;
                    }
                }, []);

        const keys = Object.keys(assets);
        const r = /url\("(.*)"\)/;
        keys.forEach((k: keyof Assets) => {
            const cssKey = `#${k}`;
            const rule = allCSS.find(r => r.selectorText === cssKey);
            if (rule) {
                fromNullable(rule.style.backgroundImage)
                    .map((backgroundImage) => {
                        const assetUrlRe = r.exec(backgroundImage);
                        if (assetUrlRe) {
                            const assetUrl = assetUrlRe[1];
                            const node = document.createElement('img');
                            node.addEventListener('load', () => {
                                const cnvs = document.createElement('canvas');
                                cnvs.width = node.naturalWidth;
                                cnvs.height = node.naturalHeight;
                                const ctx = cnvs.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(node, 0, 0, node.naturalWidth, node.naturalHeight);
                                    assets[k] = cnvs.toDataURL('image/png');
                                }
                            });
                            node.src = assetUrl;
                        }
                    });
            }
        });
    };


const sectionTitleHeight = 6;
const sectionValueHeight = 4;
const baseSectionRect = { x: 110, y: 0, width: 124, height: sectionTitleHeight };


const template: Template = {
    header: makeSpec({
        rect: { x: margin, y: 260, width: pwidth - (2 * margin), height: 15 },
        fontSize: 24,
        color: '#8db63c',
    }),
    footer: makeSpec({
        rect: { x: margin, y: 278, width: 187, height: 24 },
        fontSize: 9,
    }),
    separator: makeSpec({
        rect: { x: margin, y: 0, width: pwidth - (2 * margin), height: 24 },
    }),
    logo: makeSpec({
        rect: { x: 162, y: 14, width: 36, height: 17 },
    }),
    'creation-date': makeSpec({
        rect: { x: margin, y: 24, width: 187, height: 24 },
        fontSize: 9,
    }),
    url: makeSpec({
        rect: { x: margin, y: 28, width: 187, height: 24 },
        fontSize: 9,
    }),

    'title-pv': makeSpec({
        rect: { x: margin, y: 15, width: pwidth - (2 * margin), height: 24 },
        fontSize: 18,
    }),
    'title-thermal': makeSpec({
        rect: { x: margin, y: 15, width: pwidth - (2 * margin), height: 24 },
        fontSize: 18,
    }),
    'contact-title': makeSpec({
        rect: { x: margin, y: 192, width: pwidth, height: 24 },
        fontSize: 14,
    }),
    'contact-intro': makeSpec({
        rect: { x: margin + 6, y: 200, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-0': makeSpec({
        rect: { x: margin + 6, y: 220, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-0.1': makeSpec({
        rect: { x: margin + 6, y: 224, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-0.2': makeSpec({
        rect: { x: margin + 6, y: 228, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-0.3': makeSpec({
        rect: { x: margin + 6, y: 232, width: 72, height: 24 },
        fontSize: 9,
    }),

    'contact-1': makeSpec({
        rect: { x: margin + 6, y: 237, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-1.1': makeSpec({
        rect: { x: margin + 6, y: 241, width: 72, height: 24 },
        fontSize: 9,
    }),
    'contact-1.2': makeSpec({
        rect: { x: margin + 6, y: 245, width: 72, height: 24 },
        fontSize: 9,
    }),

    'finance-title': makeSpec({
        rect: { x: 110, y: 192, width: 72, height: 24 },
        fontSize: 14,
    }),
    'finance-0': makeSpec({
        rect: { x: 116, y: 200, width: 72, height: 24 },
        fontSize: 9,
    }),
    'finance-1': makeSpec({
        rect: { x: 116, y: 204, width: 72, height: 24 },
        fontSize: 9,
    }),
    'finance-2': makeSpec({
        rect: { x: 116, y: 215.6, width: 72, height: 24 },
        fontSize: 9,
    }),
    'finance-3': makeSpec({
        rect: { x: 116, y: 227, width: 72, height: 24 },
        fontSize: 9,
    }),

    'certif-title': makeSpec({
        rect: { x: 110, y: 244, width: 72, height: 24 },
        fontSize: 14,
    }),
    'certif-body': makeSpec({
        rect: { x: 116, y: 251, width: 72, height: 24 },
        fontSize: 9,
    }),



    address: makeSpec({
        rect: { x: margin, y: 41, width: 180, height: 20 },
        fontSize: 24,
    }),
    illu: makeSpec({
        rect: { x: 13, y: 70, width: 84, height: 84 },
    }),
    legend: makeSpec({
        rect: { x: margin + 6, y: 160, width: 84, height: 26 },
    }),
    'legend-item': makeSpec({
        rect: { x: 0, y: 0, width: 72, height: 6 },
        fontSize: 9,
    }),

    gain: makeSpec({
        rect: { x: margin, y: 179, width: 200, height: 20 },
        fontSize: 16,
        color: '#8db63c',
    }),

    'section-roof': makeSpec({
        rect: { ...baseSectionRect, y: 70, height: sectionTitleHeight + (sectionValueHeight * 3) },
        fontSize: 18,
    }),
    'section-energy': makeSpec({
        rect: { ...baseSectionRect, y: 94, height: sectionTitleHeight + (sectionValueHeight * 4) },
        fontSize: 18,
    }),
    'section-install': makeSpec({
        rect: { ...baseSectionRect, y: 120, height: sectionTitleHeight + (sectionValueHeight * 5) },
        fontSize: 18,
    }),
    'section-finance': makeSpec({
        rect: { ...baseSectionRect, y: 151, height: sectionTitleHeight + (sectionValueHeight * 5) },
        fontSize: 18,
    }),
    value: makeSpec({
        rect: { x: 0, y: 0, width: 100, height: 5 },
        fontSize: 10,
    }),


};


const renderLabel =
    (f: ApplyFn<Box>, key: string) =>
        f(key, ({ rect, textAlign, fontSize, color }) => ({
            ...rect,
            children: [
                makeText(getLabel(key), fontSize, color, textAlign),
            ],
        }));


const renderAddress =
    (f: ApplyFn<Box>, address: string, city: string) =>
        f('address', ({ rect, textAlign, fontSize, color }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(address, fontSize, color, textAlign),
                    makeText(city, fontSize, color, textAlign),
                ]),
            ],
        }));


type VK = [string, MessageKey];

const renderVK =
    (f: ApplyFn<Box>) => (vk: VK) =>
        f('value', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 27,
                    height: rect.height,
                    children: [
                        makeText(vk[0], fontSize, color, 'right', 'bottom'),
                    ],
                },
                {
                    x: 27 + 3.5,
                    y: 0,
                    width: 100,
                    height: rect.height,
                    children: [
                        makeText(tr(vk[1]), fontSize - 2, color, 'left', 'bottom'),
                    ],
                },
            ],
        }));

type LegendItem = [string, number, string];

const renderLegendItem =
    (f: ApplyFn<Box>, label: string, value: number, color: string) =>
        f('legend-item', ({ rect, fontSize }) => ({
            ...rect,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 27,
                    height: rect.height,
                    children: [
                        makeRect([[0, 0], [3.5, 0], [3.5, 3.5], [0, 3.5]], color),
                    ],
                },
                {
                    x: 0,
                    y: 0,
                    width: 15,
                    height: rect.height,
                    children: [
                        makeText(`${Math.floor(value)} %`, fontSize, 'black', 'right'),
                    ],
                },
                {
                    x: 18,
                    y: 0,
                    width: 80,
                    height: rect.height,
                    children: [
                        makeText(label, fontSize),
                    ],
                },
            ],
        }));

const renderLegend =
    (f: ApplyFn<Box>, items: LegendItem[]) =>
        f('legend', ({ rect }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, 5, mapOption(items, i => renderLegendItem(f, i[0], i[1], i[2]))),
            ],
        }));

const renderSeperator =
    (f: ApplyFn<Box>, y: number) =>
        f('separator', ({ rect, color }) => ({
            ...rect,
            y,
            children: [
                makeLine([[0, 0], [rect.width, 0]], 0.1, color),
            ],
        }));

const renderSection =
    (f: ApplyFn<Box>, templateKey: string, section: string, vks: VK[]) =>
        f(templateKey, ({ rect, fontSize, color, textAlign }) => ({
            name: templateKey,
            ...rect,
            children: [
                makeText(section, fontSize, color, textAlign),
                boxContent(
                    { ...rect, y: rect.y + sectionTitleHeight },
                    makeLayoutVertical(rect.width, sectionValueHeight,
                        mapOption(vks, renderVK(f)),
                    ),
                ),
            ],
        }));


const renderLogo =
    (f: ApplyFn<Box>) =>
        f('logo', ({ rect }) => ({
            ...rect,
            children: [
                boxContent(rect, makeImage(assets['print-image-logo'])),
            ],
        }));

const render3D =
    (f: ApplyFn<Box>) =>
        f('illu', ({ rect }) =>
            scopeOption()
                .let('buildings', getBuildings())
                .let('roofs', getRoofs().fold(emptyRoofs, roofs => some(roofs)))
                .let('camera', ({ buildings }) => getCamera(buildings))
                .let('src', ({ camera, roofs, buildings }) => perspective(camera, buildings, roofs))
                .foldL(
                    () => boxEmpty(),
                    scope => boxContent(rect, makeImage(scope.src), makeImage(assets['print-image-mask']))));


const renderCreationDate =
    (f: ApplyFn<Box>) =>
        f('creation-date', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                makeText(`${getLabel('date')} ${formatDate(new Date())}`, fontSize, color),
            ],
        }));

const renderURL =
    (f: ApplyFn<Box>) =>
        f('url', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                makeText(
                    `${getLabel('url')} ${getCapakey().fold('--', c => getLabel('base-url') + c)}`, fontSize, color),
            ],
        }));

const renderGainPV =
    (f: ApplyFn<Box>, value: number) =>
        f('gain', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                makeText(`${getLabel('gainPV')} ${withEuro(value)}`, fontSize, color),
            ],
        }));

const renderGainThermal =
    (f: ApplyFn<Box>, value: number) =>
        f('gain', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                makeText(`${getLabel('gainThermal')} ${withEuro(value)}`, fontSize, color),
            ],
        }));


export const renderPDF =
    () => {
        const pdf = createContext('portrait', 'a4');

        const boxes: Box[] = [];
        const apply = applySpec(template, 200);

        renderAddress(apply, `${streetName()} ${streetNumber()}`, `${tr('in')} ${locality()}`)
            .map(b => boxes.push(b));

        const roofData: VK[] = [
            [withM2(totalArea()), 'solTotalSurface'],
            [withM2(getObstacleArea()), 'obstacleEstimation'],
            [withM2(usableRoofArea()), 'solUsableRoofArea'],
        ];

        let energyData: VK[] = [
            [withKWhY(getOutputPv('annualProduction')), 'solProductionPanels'],
            [withKWhY(getOutputPv('annualConsumption')), 'solHomeConsumption'],
            [withPercent(getOutputPv('autonomy') * 100), 'solarAutonomy'],
            [withTCO2Y(getOutputPv('savedCO2emissions') / 1000 / 10, 1), 'gainEnvironment'],
        ];

        let installData: VK[] = [
            [getPanelUnits().toString(), 'solNumberOfPanels'],
            [tr('__empty__'), pvTechnologyLabel()],
            [withM2(getOutputPv('maxArea')), 'solInstallationSurface'],
            [withKWc(getOutputPv('power'), 1), 'solTotalPower'],
            [withYear(25), 'solInstallationLifeTime'],
        ];
        let financeData: VK[] = [
            [withEuro(getOutputPv('installationCost')), 'buyingPrice'],
            [withEuro(getOutputPv('CVAmountYear25')), 'gainGreenCertif25Y'],
            [withEuro(getOutputPv('selfConsumptionAmountYear25')), 'gainElecInvoice25Y'],
            [withEuro(getOutputPv('totalGain25Y') - getOutputPv('installationCost')), 'gainTotal25Y'],
            [withYear(getOutputPv('returnTime')), 'returnTime'],
        ];

        const legendData: LegendItem[] = [
            [tr('orientationGreat'), areaExcellent(), '#8db63c'],
            [tr('orientationGood'), areaMedium(), '#ebe316'],
            [tr('unusable'), areaLow(), '#006f90'],
        ];

        let labels = [
            'header',
            'footer',
            'contact-title',
            'contact-intro',
            'contact-0',
            'contact-0.1',
            'contact-0.2',
            'contact-0.3',
            'contact-1',
            'contact-1.1',
            'contact-1.2',
            'finance-title',
            'finance-0',
            'finance-1',
        ];

        if (getSystem() === 'photovoltaic') {
            labels = labels.concat([
                'title-pv',
                'certif-title',
                'certif-body',
                'finance-2',
                'finance-3',
            ]);

            renderGainPV(apply, getOutputPv('totalGain10Y'))
                .map(b => boxes.push(b));
        }
        else { // thermal
            labels = labels.concat(['title-thermal']);

            energyData = [
                [withKWhY(getOutputThermal('annualProduction')), 'solSolarProdYear'],
                [withKWhY(getOutputThermal('annualConsumption')), 'solSolarConsumptionYear'],
                [withPercent(getOutputThermal('autonomyRate') * 100), 'solSolarRateArea'],
                [withTCO2Y(getOutputThermal('savedCO2emissions') / 1000 / 10, 1), 'gainEnvironment'],
            ];

            installData = [
                ['2', 'solNumberOfPanels'],
                [withM2(4.5, 1), 'surface'],
                [withLiter(300), 'solWaterStorage'],
                ['', '__empty__'],
            ];
            financeData = [
                [withEuro(getOutputThermal('installationCost')), 'buyingPrice'],
                [withEuro(getOutputThermal('grant')), 'bonus'],
                [withEuro(getOutputThermal('thermalGain25')), 'gainEnergyInvoice25Y'],
                [withYear(getOutputThermal('returnTime')), 'returnTime'],
                ['', '__empty__'],
            ];


            renderGainThermal(apply, getOutputThermal('grant') + getOutputThermal('thermalGain10'))
                .map(b => boxes.push(b));
        }

        const separators = [10, 35, 187, 274];

        renderSection(apply, 'section-roof', tr('solMyRooftop'), roofData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-energy', tr('solMyEnergy'), energyData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-install', tr('solMyInstallation'), installData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-finance', tr('solMyFinance'), financeData)
            .map(b => boxes.push(b));

        renderLegend(apply, legendData)
            .map(b => boxes.push(b));

        renderLogo(apply)
            .map(b => boxes.push(b));

        renderCreationDate(apply)
            .map(b => boxes.push(b));
        renderURL(apply)
            .map(b => boxes.push(b));

        labels.forEach(l => renderLabel(apply, l).map(b => boxes.push(b)));
        separators.forEach(s => renderSeperator(apply, s).map(b => boxes.push(b)));

        render3D(apply).map(b => boxes.push(b));

        paintBoxes(pdf, boxes);
        pdf.save(`summary.pdf`);
    };
