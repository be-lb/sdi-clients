import { DIV } from '../elements';

const render =
    (child: React.ReactNode) =>
        DIV({ className: 'splash-wrapper' },
            DIV({ className: 'splash-content' }, child),
            DIV({ className: 'splash-spiner' }));

export default render;
