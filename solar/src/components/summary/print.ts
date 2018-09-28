
import { mapOption } from 'fp-ts/lib/Array'

import tr from 'sdi/locale';
import { Template, createContext, Box, paintBoxes, makeSpec, applySpec, ApplyFn, makeLayoutVertical, makeText, makeLayoutHorizontal } from 'sdi/print';

import { streetName, streetNumber, getOutputPv } from '../../queries/simulation';
import { withKWhY, withPercent, withTCO2Y } from 'sdi/util';

const template: Template = {
    address: makeSpec({
        rect: { x: 15, y: 15, width: 180, height: 26 },
        fontSize: 32,
    }),
    'section-roof': makeSpec({
        rect: { x: 15, y: 30, width: 124, height: 200 },
        fontSize: 18,
    }),
    value: makeSpec({
        rect: { x: 0, y: 0, width: 60, height: 20 },
        fontSize: 12,
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


type VK = [string, string];

const renderVK =
    (f: ApplyFn<Box>) => (vk: VK) =>
        f('value', ({ rect, fontSize, color }) => ({
            ...rect,
            children: [
                makeLayoutHorizontal(rect.width / 2, rect.height, [
                    makeText(vk[0], fontSize, color, 'right'),
                    makeText(vk[1], fontSize, color, 'left'),
                ])],
        }));

const renderRoof =
    (f: ApplyFn<Box>, section: string, vks: VK[]) =>
        f('section-roof', ({ rect, fontSize, color, textAlign }) => ({
            ...rect,
            children: [
                makeText(section, fontSize, color, textAlign),
                makeLayoutVertical(rect.width, rect.height / vks.length,
                    mapOption(vks, renderVK(f)),
                ),
            ],
        }));


export const renderPDF =
    () => {
        const pdf = createContext('portrait', 'a4');
        const boxes: Box[] = [];
        const apply = applySpec(template, 200);

        renderAddress(apply, `${streetName()} ${streetNumber()}`)
            .map(b => boxes.push(b));

        const roofData: VK[] = [
            [withKWhY(getOutputPv('annualProduction')), tr('solProductionPanels')],
            [withKWhY(getOutputPv('annualConsumption')), tr('solHomeConsumption')],
            [withPercent(getOutputPv('autonomy') * 100), tr('solarAutonomy')],
            [withTCO2Y(getOutputPv('savedCO2emissions') / 1000, 1), tr('gainEnvironment')],
        ];

        renderRoof(apply, tr('solMyRooftop'), roofData)
            .map(b => boxes.push(b));


        paintBoxes(pdf, boxes);
        pdf.save(`summary.pdf`);
    };
