
import { mapOption } from 'fp-ts/lib/Array';

import { scopeOption } from 'sdi/lib';
import tr from 'sdi/locale';
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
} from 'sdi/print';

import { streetName, streetNumber, getOutputPv, totalArea, getObstacleArea, usableRoofArea, getPanelUnits, pvTechnologyLabel, getBuildings, getRoofs } from '../../queries/simulation';
import { withKWhY, withPercent, withTCO2Y, withM2, withKWc, withYear, withEuroInclVAT, withEuro } from 'sdi/util';
import { some } from 'fp-ts/lib/Option';
import { perspective } from '../context/perspective';
import { getCamera, emptyRoofs } from '../context/index';

const margin = 10;
const pwidth = 210;
// const pheight = 294;


const sectionTitleHeight = 8;
const sectionValueHeight = 4;
const baseSectionRect = { x: 110, y: 0, width: 124, height: sectionTitleHeight };

const template: Template = {
    header: makeSpec({
        rect: { x: margin, y: margin, width: pwidth - (2 * margin), height: 15 },
        fontSize: 32,
    }),
    title: makeSpec({
        rect: { x: margin, y: margin + 15, width: pwidth - (2 * margin), height: 24 },
        fontSize: 32,
    }),
    address: makeSpec({
        rect: { x: margin, y: 54, width: 180, height: 26 },
        fontSize: 32,
    }),
    illu: makeSpec({
        rect: { x: 13, y: 84, width: 84, height: 84 },
        fontSize: 32,
    }),
    'section-roof': makeSpec({
        rect: { ...baseSectionRect, y: 84, height: sectionTitleHeight + (sectionValueHeight * 3) },
        fontSize: 18,
    }),
    'section-energy': makeSpec({
        rect: { ...baseSectionRect, y: 110, height: sectionTitleHeight + (sectionValueHeight * 4) },
        fontSize: 18,
    }),
    'section-install': makeSpec({
        rect: { ...baseSectionRect, y: 140, height: sectionTitleHeight + (sectionValueHeight * 5) },
        fontSize: 18,
    }),
    'section-finance': makeSpec({
        rect: { ...baseSectionRect, y: 172, height: sectionTitleHeight + (sectionValueHeight * 5) },
        fontSize: 18,
    }),
    value: makeSpec({
        rect: { x: 0, y: 0, width: 100, height: 20 },
        fontSize: 10,
    }),
};


const renderAddress =
    (f: ApplyFn<Box>, address: string) =>
        f('address', ({ rect, textAlign, fontSize, color }) => ({
            ...rect,
            children: [
                makeLayoutVertical(rect.width, rect.height / 2, [
                    makeText(address, fontSize, color, textAlign),
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
                        makeText(vk[0], fontSize, color, 'right'),
                    ],
                },
                {
                    x: 27 + 3.5,
                    y: 0,
                    width: 100,
                    height: rect.height,
                    children: [
                        makeText(tr(vk[1]), fontSize, color, 'left'),
                    ],
                },
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
                    scope => boxContent(rect, makeImage(scope.src))));

export const renderPDF =
    () => {
        const pdf = createContext('portrait', 'a4');

        const boxes: Box[] = [];
        const apply = applySpec(template, 200);

        renderAddress(apply, `${streetName()} ${streetNumber()}`)
            .map(b => boxes.push(b));

        const roofData: VK[] = [
            [withM2(totalArea()), 'solTotalSurface'],
            [withM2(getObstacleArea()), 'obstacleEstimation'],
            [withM2(usableRoofArea()), 'solUsableRoofArea'],
        ];

        const energyData: VK[] = [
            [withKWhY(getOutputPv('annualProduction')), 'solProductionPanels'],
            [withKWhY(getOutputPv('annualConsumption')), 'solHomeConsumption'],
            [withPercent(getOutputPv('autonomy') * 100), 'solarAutonomy'],
            [withTCO2Y(getOutputPv('savedCO2emissions') / 1000, 1), 'gainEnvironment'],
        ];

        const installData: VK[] = [
            [getPanelUnits().toString(), 'solNumberOfPanels'],
            [':.', pvTechnologyLabel()],
            [withM2(getOutputPv('maxArea')), 'solInstallationSurface'],
            [withKWc(getOutputPv('power'), 1), 'solTotalPower'],
            [withYear(25), 'solInstallationLifeTime'],
        ];
        const financeData: VK[] = [
            [withEuroInclVAT(getOutputPv('installationCost')), 'buyingPrice'],
            [withEuro(getOutputPv('CVAmountYear25')), 'gainGreenCertif25Y'],
            [withEuro(getOutputPv('selfConsumptionAmountYear25')), 'gainElecInvoice25Y'],
            [withEuro(getOutputPv('totalGain25Y') - getOutputPv('installationCost')), 'gainTotal25Y'],
            [withYear(getOutputPv('returnTime')), 'returnTime'],
        ];

        renderSection(apply, 'section-roof', tr('solMyRooftop'), roofData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-energy', tr('solMyEnergy'), energyData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-install', tr('solMyInstallation'), installData)
            .map(b => boxes.push(b));
        renderSection(apply, 'section-finance', tr('solMyFinance'), financeData)
            .map(b => boxes.push(b));

        render3D(apply).map(b => boxes.push(b));

        paintBoxes(pdf, boxes);
        pdf.save(`summary.pdf`);
    };
