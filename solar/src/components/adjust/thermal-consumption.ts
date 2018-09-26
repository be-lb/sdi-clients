import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { getInputF } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { inputItem } from '../item-factory';



// Petit consommateur : 60 l/jour
// Moyen : 90 l/j
// Consommateur médian: 120 l/j
// Ménage moyen: 150 l/j
// Grand ménage: 180 l/j
// Gros consomateur: 210 l/j

const ranks = {
    first: 60,
    second: 90,
    third: 120,
    fourth: 150,
    fifth: 180,
    sixth: 210,
};

type Rank = typeof ranks;

type rank = keyof Rank;


const legends: { [k in rank]: MessageKey } = {
    first: 'solLegendConsWaterRank1',
    second: 'solLegendConsWaterRank2',
    third: 'solLegendConsWaterRank3',
    fourth: 'solLegendConsWaterRank4',
    fifth: 'solLegendConsWaterRank5',
    sixth: 'solLegendConsWaterRank6',
};

const setConsumption = setInputF('thermicLiterByDay');
const getConsumption = getInputF('thermicLiterByDay');

// we build the icons next to the title
const icon =
    (rank: rank) =>
        DIV({ className: `rank-icon  ${rank}  ${isActive(rank) ? 'active' : ''}` });


const titleAndPicto =
    () => DIV({ className: 'adjust-item-header' },
        DIV({ className: 'adjust-item-title' },
            '2. ' + tr('solHotWaterConsumption')),
        icon('first'),
        icon('second'),
        icon('third'),
        icon('fourth'),
        icon('fifth'),
        icon('sixth'),
    );

const isActive =
    (rank: rank) =>
        (getConsumption() < ranks[rank] + 10)
        && (getConsumption() > ranks[rank] - 10);

// Consumption rank selector widget
const selectItem =
    (rank: rank) => {
        if (isActive(rank)) {
            return DIV({ className: `select-item ${rank} active` });
        }
        return DIV({
            className: `select-item ${rank}`,
            onClick: () => setConsumption(ranks[rank]),
        });
    };

const selectWidget =
    () =>
        DIV({ className: 'consumption-select' },
            selectItem('first'),
            selectItem('second'),
            selectItem('third'),
            selectItem('fourth'),
            selectItem('fifth'),
            selectItem('sixth'),
        );


// Legend text per selected rank
const rankedLegend =
    (rank: rank) =>
        DIV({
            className: `rank-legend ${rank} ${isActive(rank) ? 'active' : ''}`,
        }, tr(legends[rank]));



const adjustLegend =
    () => DIV({ className: 'adjust-item-legend' },
        rankedLegend('first'),
        rankedLegend('second'),
        rankedLegend('third'),
        rankedLegend('fourth'),
        rankedLegend('fifth'),
        rankedLegend('sixth'),
    );



export const calcConsumptionThermal =
    () =>
        DIV({ className: 'adjust-item consumption thermal' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                inputItem(
                    'solDailyConsumption',
                    'thermicLiterByDay',
                    SPAN({ className: 'unit' }, tr('unitLiterDay'))),
            ),
            adjustLegend(),
        );



