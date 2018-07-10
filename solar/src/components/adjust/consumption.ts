import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';

import { inputItem } from '../item-factory';




// we build the icons next to the title
const icon =
    (rank: string, active: string) =>
        DIV({ className: 'rank-icon' + ' ' + rank + ' ' + active });


const titleAndPicto =
    () => DIV({ className: 'adjust-item-title' },
        '2. ' + tr('consumption'),
        icon('first', ''),
        icon('second', 'active'),
        icon('third', ''),
        icon('fourth', ''),
        icon('fifth', ''),
    );



// Consumption rank selector widget
const selectItem =
    (rank: string, active: string) =>
        DIV({ className: 'select-item' + ' ' + rank + ' ' + active });

const selectWidget =
    () =>
        DIV({ className: 'consumption-select' },
            selectItem('first', ''),
            selectItem('second', 'active'),
            selectItem('third', ''),
            selectItem('fourth', ''),
            selectItem('fifth', ''),
        );


// Note text per selected rank
const rankedNote =
    (rank: string, n: MessageKey, active: string) =>
        DIV({ className: 'rank-note' + ' ' + rank + ' ' + active }, tr(n));


const adjustNote =
    () => DIV({ className: 'adjust-item-note' },
        rankedNote('first', 'solNoteConsRank1', ''),
        rankedNote('second', 'solNoteConsRank2', 'active'),
        rankedNote('third', 'solNoteConsRank3', ''),
        rankedNote('fourth', 'solNoteConsRank4', ''),
        rankedNote('fifth', 'solNoteConsRank5', ''),
    );



export const calcConsumption =
    () =>
        DIV({ className: 'adjust-item consumption' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                selectWidget(),
                inputItem('annualConsumptionKWh', 'annualConsumptionKWh')),
            adjustNote(),
        );




