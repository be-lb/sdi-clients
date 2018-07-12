import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

const pictoCollection =
    () =>
        DIV({ className: 'picto-collection' },
            DIV({ className: 'reduce active' }),
            DIV({ className: 'day' }),
            DIV({ className: 'battery' }),
        );


const selectItem =
    (rank: string) =>
        DIV({ className: 'select-item' + ' ' + rank });

const selectWidget =
    () =>
        DIV({ className: 'autoproduction-select' },
            selectItem('first'),
            selectItem('second active'),
            selectItem('third'),
            selectItem('fourth'),
        );


const notes =
    () =>
        DIV({ className: 'adjust-item-note' },
            DIV({ className: 'reduce active' }, tr('reduceConsumption')),
            DIV({ className: 'day' }, tr('dayConsumption')),
            DIV({ className: 'battery' }, tr('installBatteries')),
        );


export const calcAutoproduction =
    () =>
        DIV({ className: 'adjust-item autoproduction' },
            DIV({ className: 'adjust-item-title' },
                DIV({}, '4. ' + tr('solAutoproduction')),
                pictoCollection()),
            selectWidget(),
            notes(),
        );



