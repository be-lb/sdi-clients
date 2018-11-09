import { DIV } from 'sdi/components/elements';
import { getNote, NoteKey } from '../../queries/simulation';

export const note =
    (k: NoteKey) => DIV({
        className: 'adjust-item-note',
        dangerouslySetInnerHTML: {
            __html: getNote(k),
        },
    });
