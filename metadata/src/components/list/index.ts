import { DIV, H1 } from '../elements';
import tr from '../../locale';
import metadata from '../table/metadata';


const render =
    () => {
        return DIV({
            className: 'metadata-list',
        }, H1({}, tr('sheetList')), metadata());
    };

export default render;
