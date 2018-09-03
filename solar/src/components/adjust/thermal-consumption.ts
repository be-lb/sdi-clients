import { DIV, SPAN } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { annualConsumption } from '../../queries/simulation';
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


const notes: { [k in rank]: MessageKey } = {
    first: 'solNoteConsRank1',
    second: 'solNoteConsRank2',
    third: 'solNoteConsRank3',
    fourth: 'solNoteConsRank4',
    fifth: 'solNoteConsRank5',
    sixth: 'solNoteConsRank5',
};

const setConsumption = setInputF('annualConsumptionKWh');

// we build the icons next to the title
const icon =
    (rank: rank) =>
        DIV({ className: `rank-icon  ${rank}  ${isActive(rank) ? 'active' : ''}` });


const titleAndPicto =
    () => DIV({ className: 'adjust-item-header' },
        DIV({ className: 'adjust-item-title' },
            '1. ' + tr('solHotWaterConsumption')),
        icon('first'),
        icon('second'),
        icon('third'),
        icon('fourth'),
        icon('fifth'),
        icon('sixth'),
    );

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
        DIV({ className: 'consumption-select' },
            selectItem('first'),
            selectItem('second'),
            selectItem('third'),
            selectItem('fourth'),
            selectItem('fifth'),
            selectItem('sixth'),
        );


// Note text per selected rank
const rankedNote =
    (rank: rank) =>
        DIV({
            className: `rank-note ${rank} ${isActive(rank) ? 'active' : ''}`,
        }, tr(notes[rank]));



const adjustNote =
    () => DIV({ className: 'adjust-item-note' },
        rankedNote('first'),
        rankedNote('second'),
        rankedNote('third'),
        rankedNote('fourth'),
        rankedNote('fifth'),
        rankedNote('sixth'),
    );



export const calcConsumptionThermal =
    () =>
        DIV({ className: 'adjust-item consumption thermal' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                inputItem('solDailyConsumption', 'annualConsumptionKWh', SPAN({ className: 'unit' }, tr('unitLiterDay'))),
            ),
            adjustNote(),
        );



