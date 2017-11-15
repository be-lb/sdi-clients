
import * as debug from 'debug';
// import { DIV } from 'sdi/components/elements';
import { baseTable, SelectRowHandler } from 'sdi/components/table';

import { tableAliasEvents, buildForm } from '../../events/alias';
import { tableAliasQueries } from '../../queries/alias';

const logger = debug('sdi:alias/table');

const base = baseTable(
    tableAliasQueries,
    tableAliasEvents,
);


const selectRow: SelectRowHandler =
    row => buildForm(row.from as string);

// const selectCell: SelectCellHandler =
//     (row, index) => {
//         if (index === 4) {
//         }
//     }

const table = base({
    className: 'xxx',
    onRowSelect: selectRow,
    // onCellSelect: selectCell,
});


// const render =
//     () => table();

export default table;

logger('loaded');
