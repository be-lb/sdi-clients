import { fromPredicate } from 'fp-ts/lib/Either';

import { DIV, H1, INPUT, TEXTAREA, SPAN, NODISPLAY } from 'sdi/components/elements';
import tr, { fromRecord } from 'sdi/locale';
import { Inspire, MessageRecord, getMessageRecord, makeRecord, MessageRecordLang } from 'sdi/source';
import buttonFactory from 'sdi/components/button';
import {
    queryK,
    dispatchK,
} from 'sdi/shape';

import appQueries from '../../queries/app';
import appEvents from '../../events/app';
import {
    formIsSaving,
    getCurrentDatasetMetadata,
    getMdDescription,
    getMdTitle,
    getTemporalReference,
    getKeywords,
    getPersonOfContact,
    // getTopics,
    // getTopicList,
    // isSelectedTopic,
} from '../../queries/metadata';
import {
    saveMdForm,
    setMdDescription,
    setMdTitle,
    removeKeyword,
    // removeTopic,
    // addTopic,
    mdPublish,
    mdDraft,
} from '../../events/metadata';

import { renderSelectKeyword } from './keywords';

export interface MdForm {
    title: MessageRecord;
    description: MessageRecord;
    topics: string[];
    keywords: string[];
    published: boolean;
    saving: boolean;
}

const button = buttonFactory(
    queryK('component/button'), dispatchK('component/button'));
const saveButton = button.make('validate', 'save');
const removeButton = button.make('remove');
const publishButton = button.make('toggle-off');
const unpublishButton = button.make('toggle-on');
const addKeyword = button.make('add', 'add');


export const defaultMdFormState =
    (): MdForm => ({
        title: makeRecord(),
        description: makeRecord(),
        topics: [],
        keywords: [],
        published: false,
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


const renderEditLang =
    (l: MessageRecordLang, title: string, abstract: string, notice?: string) =>
        DIV({ className: `app-col-wrapper meta-${l}` },
            DIV({ className: 'app-col-header' }, `${l}${notice !== undefined ? ` (${notice})` : ''}`),
            DIV({ className: 'app-col-main' },
                DIV({ className: 'label' }, title),
                renderInputText(title,
                    getMdTitle(l), setMdTitle(l)),
                DIV({ className: 'label' }, abstract),
                renderTextArea(abstract,
                    getMdDescription(l), setMdDescription(l))));


const renderEdit =
    (m: Inspire) => {
        const leftPane = (
            appQueries.getLayout() === 'Single' ?
                renderInfo(m) :
                renderCommon(m));
        return (
            DIV({ className: 'meta-edit' },
                leftPane,
                renderEditLang('fr', 'Titre', 'Résumé'),
                renderEditLang('nl', 'Titel', 'Overzicht'),
                renderEditLang('en', 'Title', 'Abstract', 'catalog')));
    };


const renderPoc =
    (m: Inspire) => m.metadataPointOfContact.map(
        id => getPersonOfContact(id).fold(
            NODISPLAY(),
            poc =>
                DIV({ className: 'point-of-contact' },
                    SPAN({ className: 'contact-name' }, poc.contactName),
                    SPAN({ className: 'contact-email' }, poc.email),
                    SPAN({ className: 'contact-organisation' },
                        fromRecord(getMessageRecord(poc.organisationName))))));




const renderCommon =
    (_m: Inspire) => (
        DIV({ className: 'app-col-wrapper meta-common' },
            DIV({ className: 'app-col-header' }, tr('keywords')),
            DIV({ className: 'app-col-main' },
                // renderSelectTopic(),
                renderSelectKeyword())));


const renderAction =
    (_m: Inspire) => (
        DIV({ className: 'meta-action' },
            isNotSaving(saveButton(saveMdForm)).fold(
                () => DIV({ className: 'saving' }, SPAN({ className: 'loader-spinner' }), SPAN({}, tr('saving'))),
                e => e),
        ));

const labeledString =
    (l: string, v: string) => (
        DIV({ className: 'metadata-label' },
            DIV({ className: 'label' }, l),
            DIV({ className: 'value' }, v)));

const labeledNode =
    (l: string, v: React.ReactNode) => (
        DIV({ className: 'metadata-label' },
            DIV({ className: 'label' }, l), v));

const renderPublishState =
    ({ published }: Inspire) => {
        if (published) {
            return DIV({ className: 'toggle' },
                DIV({ className: 'no-active' }, tr('internal')),
                unpublishButton(mdDraft),
                DIV({ className: 'active' }, tr('inspireCompliant')));
        }
        return DIV({ className: 'toggle' },
            DIV({ className: 'active' }, tr('internal')),
            publishButton(mdPublish),
            DIV({ className: 'no-active' }, tr('inspireCompliant')));
    };



const renderKeywords =
    () => DIV({}, ...getKeywords()
        .map(kw => (
            DIV({ className: 'keyword' },
                removeButton(() => removeKeyword(kw.id)),
                SPAN({ className: 'value' }, fromRecord(kw.name))))));

const renderInfo =
    (m: Inspire) => (
        DIV({ className: 'app-col-wrapper metadata-info' },
            DIV({ className: 'app-col-header' }, tr('layerInfo')),
            DIV({ className: 'app-col-main' },
                labeledNode(tr('publicationStatus'), renderPublishState(m)),
                labeledString(tr('layerId'), m.uniqueResourceIdentifier),
                // labeledNode(tr('topics'), renderTopics()),
                labeledNode(tr('keywords'),
                    DIV({}, addKeyword(() => appEvents.setLayout('SingleAndKeywords')),
                        renderKeywords())),
                labeledString(tr('geometryType'), m.geometryType),
                labeledString(tr('temporalReference'), getTemporalReference(m.temporalReference)),
                labeledNode(tr('pointOfContact'), renderPoc(m)),
                labeledString(tr('identifier'), m.id))));



const renderEditor =
    (m: Inspire) => (
        DIV({ className: 'metadata-editor' },
            H1({}, tr('metadataEditor')),
            DIV({ className: 'meta-wrapper' },
                renderEdit(m)),
            DIV({ className: 'metadata-actions' },
                renderAction(m))));


const render =
    () => (
        getCurrentDatasetMetadata()
            .fold(
                H1({}, `Loading Current Metadata Failed`),
                renderEditor,
        ));


export default render;
