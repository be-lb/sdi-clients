import { DIV, H1, INPUT, TEXTAREA, SPAN } from '../elements';
import tr, { fromRecord } from '../../locale';
import {
    formIsSaving,
    getCurrentDatasetMetadata,
    getMdDescription,
    getMdTitle,
    getTemporalReference,
} from '../../queries/metadata';
import {
    saveMdForm,
    setMdDescription,
    setMdTitle,
} from '../../events/metadata';
import { Inspire, MessageRecord, getMessageRecord } from 'sdi/source';
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


const renderPoc =
    (m: Inspire) => m.metadataPointOfContact.map(poc => DIV({ className: 'point-of-contact' }, SPAN({ className: 'contact-name' }, poc.contactName), SPAN({ className: 'contact-email' }, poc.email), SPAN({ className: 'contact-organisation' }, fromRecord(getMessageRecord(poc.organisationName)))));


const renderCommon =
    (_m: Inspire) => (
        DIV({ className: 'app-col-wrapper meta-common' },
            DIV({ className: 'app-col-header' }, 'FR & NL'),
            DIV({ className: 'app-col-main' },
                DIV({ className: 'keywords-wrapper' }, 'le truc des keywords'))));


const renderAction =
    (_m: Inspire) => (
        DIV({ className: 'meta-action' },
            DIV({ className: 'app-col-main' },
                isNotSaving(saveButton(saveMdForm)).fold(
                    () => DIV({}, tr('saving')),
                    e => e),
                toListButton(() => appEvents.setLayout(AppLayout.List)),
            )));

const labeledString =
    (l: string, v: string) => (
        DIV({ className: 'metadata-label' },
            SPAN({ className: 'label' }, l),
            SPAN({ className: 'value' }, v)));

const labeledNode =
    (l: string, v: React.ReactNode) => (
        DIV({ className: 'metadata-label' },
            SPAN({ className: 'label' }, l), v));

const renderLabeledDatas =
    (m: Inspire) => (
        DIV({ className: 'labeled-datas' },
            labeledString(tr('identifier'), m.id),
            labeledString(tr('layerId'), m.uniqueResourceIdentifier),
            labeledString(tr('geometryType'), m.geometryType),
            labeledString(tr('temporalReference'), getTemporalReference(m.temporalReference)),
            labeledNode(tr('pointOfContact'), renderPoc(m))));

const renderEditor =
    (m: Inspire) => (
        DIV({ className: 'metadata-editor' },
            H1({}, tr('metadataEditor')),
            DIV({ className: 'meta-wrapper' },
                renderLabeledDatas(m),
                renderEdit(m)),
            DIV({ className: 'metadata-actions' },
                renderAction(m))));


const render =
    () => (
        getCurrentDatasetMetadata()
            .fold(
            () => H1({}, `Loading Current Metadata Failed`),
            renderEditor,
        ));


export default render;
