import { DIV } from 'sdi/components/elements';

import {
    SelectRowHandler,
    baseTable,
    tableQueries,
    tableEvents,
} from 'sdi/components/table';
import {
    queryK,
    dispatchK,
} from 'sdi/shape';

import {
    // getKeywordList,
    isSelectedKeyword,
} from '../../queries/metadata';
import {
    removeKeyword,
    addKeyword,
} from '../../events/metadata';
import appEvents from '../../events/app';
import { getKeywordsSource } from '../../queries/metadata';


const onRowSelect: SelectRowHandler =
    (row) => {
        const id = row.from as string;
        const isSelected = isSelectedKeyword(id);
        if (isSelected) {
            removeKeyword(id)
        }
        else {
            addKeyword(id)
        }
        appEvents.setLayout('Single');
    };


const tq = queryK('component/table/keywords');
const te = dispatchK('component/table/keywords');

const base = baseTable(tableQueries(tq, getKeywordsSource), tableEvents(te));

const renderTable = base({
    className: 'keyword-select-wrapper',
    onRowSelect,
});




export const renderSelectKeyword =
    () => {
        // const choice =
        //     getKeywordList()
        //         .filter(kw => !isSelectedKeyword(kw.id))
        //         .map(k => DIV({
        //             key: k.id,
        //             onClick: () => isSelectedKeyword(k.id) ? removeKeyword(k.id) : addKeyword(k.id),
        //         }, fromRecord(k.name)));

        return (
            DIV({ className: 'keywords-wrapper' },
                renderTable()));
    };
