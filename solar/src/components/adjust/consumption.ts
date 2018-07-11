
import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { inputItem } from '../item-factory';
import { annualConsumption } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';



// Petit consommateur(studio / appartement avec éclairage, réfrigérateur etc.) : 600 kWh / an
// Petite famille(avec machine à laver / lave - vaisselle) : 1 200 kWh / an
// Consommateur médian: 2 036 kWh / an
// Ménage moyen: 3 500 kWh / an
// Gros consomateur: 7 500 kWh / an

const ranks = {
    first: 600,
    second: 1200,
    third: 2036,
    fourth: 3500,
    fifth: 7500,
};

type Rank = typeof ranks;

type rank = keyof Rank;


const notes: { [k in rank]: MessageKey } = {
    first: 'solNoteConsRank1',
    second: 'solNoteConsRank2',
    third: 'solNoteConsRank3',
    fourth: 'solNoteConsRank4',
    fifth: 'solNoteConsRank5',
};

const setConsumption = setInputF('annualConsumptionKWh');

// we build the icons next to the title
const icon =
    (rank: rank) =>
        DIV({ className: `rank-icon  ${rank}  ${isActive(rank) ? 'active' : ''}` });


const titleAndPicto =
    () => DIV({ className: 'adjust-item-title' },
        '2. ' + tr('consumption'),
        icon('first'),
        icon('second'),
        icon('third'),
        icon('fourth'),
        icon('fifth'),
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
    );



export const calcConsumption =
    () =>
        DIV({ className: 'adjust-item consumption' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                inputItem('annualConsumptionKWh', 'annualConsumptionKWh'),
            ),
            adjustNote(),
        );



