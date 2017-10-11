import { DIV, H1, INPUT, TEXTAREA } from '../elements';
import tr from '../../locale';



const render =
    () => {
        return (
            DIV({ className: 'metadata-editor' },
                H1({}, tr('metadataEditor')),

                DIV({ className: 'meta-wrapper' },
                    DIV({ className: 'meta-edit' },
                        DIV({ className: 'app-col-wrapper meta-fr' },
                            DIV({ className: 'app-col-header' }, 'FR'),
                            DIV({ className: 'app-col-main' },
                                INPUT({ type: 'text', placeholder: 'titre' }),
                                TEXTAREA({ rows: 5, placeholder: 'résumé' }))),
                        DIV({ className: 'app-col-wrapper meta-nl' },
                            DIV({ className: 'app-col-header' }, 'NL'),
                            DIV({ className: 'app-col-main' },
                                INPUT({ type: 'text', placeholder: 'titel' }),
                                TEXTAREA({ rows: 5, placeholder: 'overzicht' }))),
                        DIV({ className: 'app-col-wrapper meta-common' },
                            DIV({ className: 'app-col-header' }, 'FR & NL'),
                            DIV({ className: 'app-col-main' },
                                DIV({ className: 'keywords-wrapper' }, 'le truc des keywords'),
                                DIV({ className: 'responsible-person' },
                                    DIV({ className: 'label' }, tr('responsiblePerson')),
                                    INPUT({ type: 'text', value: '$UserName' }))))),

                    DIV({ className: 'meta-action' },
                        DIV({ className: 'sheet-title' }, '$layer-ID'),
                        DIV({ className: 'app-col-main' },
                            DIV({ className: 'btn-validate' }, tr('save')),
                            DIV({ className: 'btn-table' }, tr('sheetList')),
                            DIV({}, 'save should display a message...'))))))

    };

export default render;
