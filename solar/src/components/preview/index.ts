import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { context } from '../context';
import { actionChange, actionInfo } from '../action';
import { summary as summaryPv } from '../summary/summary-pv';
import { summary as summaryThermal } from '../summary/summary-thermal';
import { getMaxPower, getSystem } from '../../queries/simulation';
import { navigateDetail } from '../../events/route';
import { getCapakey } from '../../queries/app';
import { buildingAdress, toggleWithInfo } from '../item-factory';
import { setSystem } from '../../events/simulation';


import { renderPDF } from '../summary/print';

const printBtn =
    () => DIV({
        className: 'solar-btn print',
        onClick: () => renderPDF(),
    },
        DIV({ className: 'solar-inner-btn' },
            tr('solPrintStr3'),
        ));


const toggleSystem = toggleWithInfo(
    () => getSystem() === 'photovoltaic',
    v => v ? setSystem('photovoltaic') : setSystem('thermal'));

const action =
    () =>
        DIV({ className: 'actions' },
            actionChange(),
            actionInfo());


const summary =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return summaryPv();
            case 'thermal': return summaryThermal();
        }
    };


const goToSettings =
    () => DIV({
        className: 'solar-btn',
        onClick: () => getCapakey().map(navigateDetail),
    },
        DIV({ className: 'solar-inner-btn' },
            tr('solAdjustStr1'),
            ' ',
            tr('solAdjustStr2')),
    );

const actionContact =
    () =>
        DIV({ className: 'solar-btn' },
            DIV({ className: 'solar-inner-btn' },
                tr('solContactStr1'), ' ', tr('solContactStr2')),
        );

const sidebar =
    () =>
        DIV({ className: 'sidebar' },
            summary(),
            goToSettings(),
            printBtn(),
            actionContact());

const sidebarNoPreview =
    () =>
        DIV({ className: 'sidebar' },
            DIV({ className: 'sol-no-sol' },
                buildingAdress(),
                DIV({ className: 'sol-no-sol-msg' }, tr('solNoSol'))),
        );





const content =
    () =>
        DIV({ className: 'content' },
            context(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater', 'solTogglePV', 'solToggleThermal'),
            sidebar(),
            action());

const contentNoPreview =
    () =>
        DIV({ className: 'content' },
            context(),
            toggleSystem('solPhotovoltaic', 'solSolarWaterHeater', 'solTogglePV', 'solToggleThermal'),
            sidebarNoPreview(),
            action());


const renderPreview =
    () =>
        DIV({ className: 'solar-main-and-right-sidebar' },
            content(),
        );


const renderNoPreview =
    () =>
        DIV({ className: 'solar-main-and-right-sidebar' },
            contentNoPreview(),
        );


const render =
    () => {
        if (getMaxPower() >= 1) {
            return renderPreview();
        }
        return renderNoPreview();
    };


export default render;
