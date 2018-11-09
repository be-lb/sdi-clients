import { DIV, BR, A } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionChange, actionInfo } from '../action';
import { disclaimer, contactLinks, urbisReward, createdBy } from '../footer-infos';
import { summary as summaryPv } from '../summary/summary-pv';
import { summary as summaryThermal } from '../summary/summary-thermal';
import { getMaxPower, getSystem } from '../../queries/simulation';
import { navigateDetail } from '../../events/route';
import { getCapakey } from '../../queries/app';
import { buildingAdress, toggleWithInfo } from '../item-factory';
import { setSystem } from '../../events/simulation';


import { renderPDF } from '../summary/print';




const actionStepAdjust =
    () => DIV({
        className: 'action action-step',
        onClick: () => getCapakey().map(navigateDetail),
    },
        DIV({ className: 'step-number' }, '1'),
        DIV({ className: 'step-label' },
            tr('solAdjustStr1'),
            BR({}),
            tr('solAdjustStr2')));

const actionStepPrint =
    () => DIV({
        className: 'action action-step',
        onClick: () => renderPDF(),
    },
        DIV({ className: 'step-number' }, '2'),
        DIV({ className: 'step-label' }, tr('solPrintStr1'), BR({}), tr('solPrintStr2')));

const actionStepContact =
    () => A({
        href: switchLinkPVTH(),
        target: '_blank',
    },
        DIV({ className: 'action action-step' },
            DIV({ className: 'step-number' }, '3'),
            DIV({ className: 'step-label' },
                tr('solContactStr1'), BR({}), tr('solContactStr2')),
        ));

const switchLinkPVTH =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return tr('solLinkInstallateurPV');
            case 'thermal': return tr('solLinkInstallateurTH');
        }
    };


const toggleSystem = toggleWithInfo(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));

const action =
    () =>
        DIV({ className: 'actions' },
            actionStepAdjust(),
            actionStepPrint(),
            actionStepContact(),
        );


const summary =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return summaryPv();
            case 'thermal': return summaryThermal();
        }
    };


const sidebar =
    () =>
        DIV({ className: 'sidebar' },
            summary(),
            DIV({ className: 'sidebar-tools' },
                toggleSystem('solPhotovoltaic', 'solSolarWaterHeater', 'solTogglePV', 'solToggleThermal'),
                DIV({ className: 'sidebar-action-wrapper' },
                    actionChange(),
                    actionInfo(),
                ),
            ));





const sidebarNoSol =
    () =>
        DIV({ className: 'sidebar' },
            DIV({ className: 'sol-no-sol' },
                buildingAdress(),
                DIV({ className: 'sol-no-sol-msg' },
                    DIV({}, tr('solNoSolSTR1')),
                    DIV({}, tr('solNoSolSTR2')),
                    DIV({},
                        ` ${tr('solNoSolSTR3')} (`,
                        A({ href: tr('solHeatPumpLink') }, tr('solHeatPumpLabel')),
                        `, `,
                        A({ href: tr('solBuyGreenEnergyLink') }, tr('solBuyGreenEnergyLabel')),
                        `, `,
                        A({ href: tr('solSharedRoofLink') }, tr('solSharedRoof')),
                        `, ${tr('solNoSolSTR4')} `,
                        A({ href: tr('solLinkContactBE') }, tr('solLinkContactBELabel')),
                        ` ${tr('solNoSolSTR5')} `,
                        A({ href: tr('solHomegradeLink') }, tr('solHomegradeLabel')),
                        ` ${tr('solNoSolSTR6')} `,
                        A({ href: tr('solFacilitatorLink') }, tr('solFacilitatorLabel')),
                        ` ${tr('solNoSolSTR7')}`,
                    ),
                ),
            ),
        );

const contentFooter =
    () =>
        DIV({ className: 'footer-infos' },
            contactLinks(),
            disclaimer(),
            urbisReward(),
            createdBy(),
        );




const content =
    () =>
        DIV({ className: 'content' },
            context(),
            sidebar(),
            action(),
            contentFooter());

const contentNoPreview =
    () =>
        DIV({ className: 'content' },
            context(),
            sidebarNoSol(),
            contentFooter());




const render =
    () => DIV({ className: 'solar-main-and-right-sidebar' },
        getMaxPower() >= 1 ?
            content() :
            contentNoPreview(),
    );



export default render;
