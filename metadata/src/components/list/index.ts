import { DIV } from '../elements';
import metadata from '../table/metadata';


const render =
    () => {
        return DIV({
            className: 'metadata-list',
        }, metadata());
    };

export default render;
