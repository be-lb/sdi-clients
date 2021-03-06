
import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { withKWhY } from 'sdi/util';



// import { inputItem } from '../item-factory';
import { annualConsumption } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';
import { note } from './note';


const ranks = {
    first: 600,
    second: 1200,
    third: 2036,
    fourth: 3500,
    fifth: 7500,
};

type Rank = typeof ranks;

type rank = keyof Rank;


const legends: { [k in rank]: MessageKey } = {
    first: 'solLegendConsRank1',
    second: 'solLegendConsRank2',
    third: 'solLegendConsRank3',
    fourth: 'solLegendConsRank4',
    fifth: 'solLegendConsRank5',
};

const setConsumption = setInputF('annualConsumptionKWh');


const titleAndPicto =
    () => DIV({ className: 'adjust-item-header' },
        DIV({ className: 'adjust-item-title' },
            '4. ' + tr('consumptionYElectricity')),
        DIV({ className: 'adjust-picto picto-home-conso' }));

const isActive =
    (rank: rank) =>
        (annualConsumption() < ranks[rank] + 10)
        && (annualConsumption() > ranks[rank] - 10);

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
        DIV({ className: 'adjust-item-widget consumption-select' },
            selectItem('first'),
            selectItem('second'),
            selectItem('third'),
            selectItem('fourth'),
            selectItem('fifth'),
        );


const consumptionValue =
    () => SPAN({ className: 'item-legend legend-output' },
        SPAN({ className: 'output-value' },
            withKWhY(annualConsumption())),
        SPAN({}, tr('solConsumed')),
    );

// Legend text per selected rank
const rankedLegend =
    (rank: rank) =>
        DIV({
            className: `rank-legend ${rank} ${isActive(rank) ? 'active' : ''}`,
        },
            SPAN({},
                `${tr(legends[rank])}, `,
                consumptionValue()),
        );



const adjustLegend =
    () => DIV({ className: 'adjust-item-legend' },
        rankedLegend('first'),
        rankedLegend('second'),
        rankedLegend('third'),
        rankedLegend('fourth'),
        rankedLegend('fifth'),
    );






export const calcConsumption =
    () =>
        DIV({ className: 'adjust-item consumption' },
            titleAndPicto(),
            note('pv_consumption'),
            selectWidget(),
            adjustLegend(),

        );



