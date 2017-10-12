import { DIV, H1, INPUT, TEXTAREA } from '../elements';
import tr from '../../locale';
import { getMdTitle, getMdDescription, getCurrentDatasetMetadata } from '../../queries/metadata';
import { setMdTitle, setMdDescription } from '../../events/metadata';
import { Inspire, MessageRecord } from 'sdi/source';
import button from '../button';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape';

export interface MdForm {
    title: MessageRecord;
    description: MessageRecord;
}

const toListButton = button('navigate', 'sheetList');

const defaultMessage = () => ({ fr: '', nl: '' });

export const defaultMdFormState =
    (): MdForm => ({
        title: defaultMessage(),
        description: defaultMessage(),
    });


type TextGetter = () => string;
type TextSetter = (a: string) => void;


const renderInputText =
    (label: string, get: TextGetter, set: TextSetter) => {
        const value = get();
        const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            INPUT({
                value,
                placeholder: label,
                type: 'text',
                onChange: update,
            })
        );
    };

const renderTextArea =
    (label: string, get: TextGetter, set: TextSetter) => {
        const value = get();
        const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            TEXTAREA({
                value,
                placeholder: label,
                onChange: update,
            })
        );
    };





const renderEdit =
    (m: Inspire) => (DIV({ className: 'meta-edit' },
        DIV({ className: 'app-col-wrapper meta-fr' },
            DIV({ className: 'app-col-header' }, 'FR'),
            DIV({ className: 'app-col-main' },
                renderInputText('Titre',
                    getMdTitle('fr'), setMdTitle('fr')),
                renderTextArea('Résumé',
                    getMdDescription('fr'), setMdDescription('fr')))),
        DIV({ className: 'app-col-wrapper meta-nl' },
            DIV({ className: 'app-col-header' }, 'NL'),
            DIV({ className: 'app-col-main' },
                renderInputText('Titel',
                    getMdTitle('nl'), setMdTitle('nl')),
                renderTextArea('Overzicht',
                    getMdDescription('nl'), setMdDescription('nl')))),
        renderCommon(m)
    ));


const renderCommon =
    (_m: Inspire) => (
        DIV({ className: 'app-col-wrapper meta-common' },
            DIV({ className: 'app-col-header' }, 'FR & NL'),
            DIV({ className: 'app-col-main' },
                DIV({ className: 'keywords-wrapper' }, 'le truc des keywords'),
                DIV({ className: 'responsible-person' },
                    DIV({ className: 'label' }, tr('responsiblePerson')),
                    INPUT({ type: 'text', value: '$UserName' })))));


const renderAction =
    (m: Inspire) => (
        DIV({ className: 'meta-action' },
            DIV({ className: 'sheet-title' }, m.id),
            DIV({ className: 'app-col-main' },
                DIV({ className: 'btn-validate' }, tr('save')),
                DIV({ className: 'btn-table' },
                    toListButton(() => appEvents.setLayout(AppLayout.List))),
                DIV({}, 'save should display a message...'))));


const renderEditor =
    (m: Inspire) => (
        DIV({ className: 'metadata-editor' },
            H1({}, tr('metadataEditor')),

            DIV({ className: 'meta-wrapper' },
                renderEdit(m),
                renderAction(m))));


const render =
    () => (
        getCurrentDatasetMetadata()
            .fold(
            () => H1({}, `Loading Current Metadata Failed`),
            renderEditor,
        ));


export default render;
