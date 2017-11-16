
import { DIV } from 'sdi/components/elements';
import { SelectRowHandler, baseTable, TableDataRow } from 'sdi/components/table';

import { extractTableEvents } from '../../events/map';
import { extractTableQueries } from '../../queries/map';

const onRowSelect: SelectRowHandler =
    (_row: TableDataRow) => {

    };

const base = baseTable(extractTableQueries, extractTableEvents);

const extract = base({
    className: 'feature-extract-wrapper',
    onRowSelect,
});


const render =
    () => (
        DIV({
            className: 'extract-wrapper',
        }, extract()));

export default render;

