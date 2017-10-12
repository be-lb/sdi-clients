import { DIV, H1, INPUT, TEXTAREA } from '../elements';
import tr from '../../locale';
import {
    formIsSaving,
    getCurrentDatasetMetadata,
    getMdDescription,
    getMdTitle,
} from '../../queries/metadata';
import {
    saveMdForm,
    setMdDescription,
    setMdTitle,
} from '../../events/metadata';
import { Inspire, MessageRecord } from 'sdi/source';
import button from '../button';
import appEvents from '../../events/app';
import { AppLayout } from '../../shape';
import { fromPredicate } from 'fp-ts/lib/Either';


export interface MdForm {
    title: MessageRecord;
    description: MessageRecord;
    saving: boolean;
}

const toListButton = button('table', 'sheetList');
const saveButton = button('validate', 'save');

const defaultMessage = () => ({ fr: '', nl: '' });

export const defaultMdFormState =
    (): MdForm => ({
        title: defaultMessage(),
        description: defaultMessage(),
        saving: false,
    });


type TextGetter = () => string;
type TextSetter = (a: string) => void;

const isNotSaving = fromPredicate<void, React.ReactNode>(() => !formIsSaving(), () => { });


const renderInputText =
    (label: string, get: TextGetter, set: TextSetter) => {
        const defaultValue = get();
        const update = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            INPUT({
                defaultValue,
                placeholder: label,
                type: 'text',
                onChange: update,
            })
        );
    };

const renderTextArea =
    (label: string, get: TextGetter, set: TextSetter) => {
        const defaultValue = get();
        const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newVal = e.currentTarget.value;
            set(newVal);
        };
        return (
            TEXTAREA({
                defaultValue,
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
    (_m: Inspire) => (
        DIV({ className: 'meta-action' },
            DIV({ className: 'app-col-main' },
                isNotSaving(saveButton(saveMdForm)).fold(
                    () => DIV({}, tr('saving')),
                    e => e
                ),
                toListButton(() => appEvents.setLayout(AppLayout.List)),
            )));


const renderEditor =
    (m: Inspire) => (
        DIV({ className: 'metadata-editor' },
            H1({}, tr('metadataEditor')),
            DIV({ className: 'metadata-id sheet-title' }, m.id),
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
