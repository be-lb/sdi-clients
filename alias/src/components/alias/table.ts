
// import { DIV } from 'sdi/components/elements';
import { baseTable, SelectRowHandler } from 'sdi/components/table';

import { tableAliasEvents, buildForm } from '../../events/alias';
import { tableAliasQueries } from '../../queries/alias';

const base = baseTable(
    tableAliasQueries,
    tableAliasEvents,
);


const selectRow: SelectRowHandler =
    row => buildForm(row.from as string);

const table = base({
    className: 'xxx',
    onRowSelect: selectRow,
});


const render =
    () => table();

export default render;
