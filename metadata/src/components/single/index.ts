import { DIV, H1, INPUT, TEXTAREA } from '../elements';
import tr from '../../locale';



const render =
    () => {
        return (
            DIV({ className: 'metadata-editor' },
                H1({}, tr('metadataEditor')),

                DIV({ className: 'meta-wrapper' },
                    DIV({ className: 'app-col-wrapper meta-fr' },
                        DIV({ className: 'app-col-header' }, tr('metaFrench')),
                        DIV({ className: 'app-col-main' },
                            INPUT({ type: 'text', placeholder: 'titre' }),
                            TEXTAREA({ rows: 5, placeholder: 'résumé' }))),
                    DIV({ className: 'app-col-wrapper meta-nl' },
                        DIV({ className: 'app-col-header' }, tr('metaDutch')),
                        DIV({ className: 'app-col-main' },
                            INPUT({ type: 'text', placeholder: 'titel' }),
                            TEXTAREA({ rows: 5, placeholder: 'overzicht' }))),
                    DIV({ className: 'app-col-wrapper meta-common' },
                        DIV({ className: 'app-col-header' }, tr('metaCommon')),
                        DIV({ className: 'app-col-main' },
                            DIV({ className: 'keywords-wrapper' }, 'le truc des keywords'),
                            DIV({ className: 'responsible-person' },
                                DIV({ className: 'label' }, tr('responsiblePerson')),
                                INPUT({ type: 'text', value: '$UserName' }))))),

                DIV({ className: 'meta-footer' },
                    DIV({ className: 'btn-table' }, tr('layerList')),
                    DIV({ className: 'btn-validate' }, tr('save')))))
    };

export default render;
