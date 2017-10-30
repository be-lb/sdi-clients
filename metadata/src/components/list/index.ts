import { DIV, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import metadata from '../table/metadata';


const render =
    () => {
        return DIV({
            className: 'metadata-list',
        },
            H1({}, tr('sheetList')),
            metadata());
    };

export default render;
