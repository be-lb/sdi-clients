/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { MessageRecord } from '../source';


/**
 * First declare a key for each message.
 * The idea here is that we make sure that
 * calls to locale.getMessage(k) has k type checked.
 */
export type MessageKey =
    | 'add'
    | 'addInterval'
    | 'addLayer'
    | 'address'
    | 'addTerm'
    | 'addToLegend'
    | 'alias'
    | 'aliasDictonary'
    | 'all'
    | 'apostrophe'
    | 'atlas'
    | 'atlasEnv'
    | 'attachedFiles'
    | 'attachmentAdd'
    | 'attachmentName'
    | 'attachmentUpload'
    | 'attachmentUploadActive'
    | 'attachmentUrl'
    | 'attributesTable'
    | 'autoClass'
    | 'browseMaps'
    | 'cancel'
    | 'changeBackgroundMap'
    | 'charts'
    | 'clear'
    | 'close'
    | 'codePoint'
    | 'colorLightness'
    | 'colorOpacity'
    | 'colorSaturation'
    | 'columnID'
    | 'columnNumber'
    | 'columnPicker'
    | 'columnPickerMessage'
    | 'columns'
    | 'comma'
    | 'confirm'
    | 'confirmDelete'
    | 'connect'
    | 'connectionSDI'
    | 'copy'
    | 'createAlias'
    | 'dashboard'
    | 'datas'
    | 'dataType'
    | 'displayLabel'
    | 'draft'
    | 'edit'
    | 'editFeatureTemplate'
    | 'editLayer'
    | 'editLegend'
    | 'editMap'
    | 'embed'
    | 'emptyDescription'
    | 'emptyMapDescription'
    | 'emptyMapTitle'
    | 'emptyTitle'
    | 'endDate'
    | 'export'
    | 'extentBegin'
    | 'extentEnd'
    | 'extractFeatures'
    | 'extractOff'
    | 'extractOn'
    | 'extractSearch'
    | 'featureInfos'
    | 'featureTemplateEditor'
    | 'featureTemplateEditorReset'
    | 'featureText'
    | 'featureViewTypeConfig'
    | 'featureViewTypeDefault'
    | 'featureViewTypePieChart'
    | 'featureViewTypeTemplate'
    | 'featureViewTypeTimeserie'
    | 'featureViewUnvalidTemplate'
    | 'fillColor'
    | 'filter'
    | 'fontColor'
    | 'fontSize'
    | 'fullscreen'
    | 'geocode'
    | 'geometryType'
    | 'go'
    | 'gpsTracker'
    | 'highValue'
    | 'identifier'
    | 'imageGeneratingPreview'
    | 'imagePreview'
    | 'imageUploading'
    | 'infoChoice'
    | 'infoReorder'
    | 'keywords'
    | 'label'
    | 'labelPostion'
    | 'lastModified'
    | 'latitude'
    | 'layer'
    | 'layerId'
    | 'layerInfo'
    | 'layerInfoSettings'
    | 'layerInfoSwitchMap'
    | 'layerInfoSwitchTable'
    | 'layerLegendDefaultLabel'
    | 'legendBuilder'
    | 'legendInfoHeader'
    | 'legendItemAdd'
    | 'legendItems'
    | 'legendType'
    | 'legendTypeContinuous'
    | 'legendTypeDiscrete'
    | 'legendTypeSelect'
    | 'legendTypeSimple'
    | 'lineColor'
    | 'lineWidth'
    | 'links'
    | 'loadingData'
    | 'location'
    | 'locationHelp'
    | 'login'
    | 'logout'
    | 'longitude'
    | 'lowValue'
    | 'map'
    | 'mapDatas'
    | 'mapEmbed'
    | 'mapEmbedWithView'
    | 'mapInfoAddIllustration'
    | 'mapInfoChangeIllustration'
    | 'mapLegend'
    | 'mapLink'
    | 'mapList'
    | 'mapLinkWithView'
    | 'mapRefList'
    | 'mapTools'
    | 'maxZoom'
    | 'measure'
    | 'measureArea'
    | 'measureLength'
    | 'metadata'
    | 'metaCommon'
    | 'metadataEditor'
    | 'metadataEditor'
    | 'metaDutch'
    | 'metaFrench'
    | 'minZoom'
    | 'move-down'
    | 'move-up'
    | 'myApps'
    | 'myMaps'
    | 'newLayer'
    | 'newMap'
    | 'noResults'
    | 'north'
    | 'offsetX'
    | 'offsetY'
    | 'originalTitle'
    | 'password'
    | 'piechartRadius'
    | 'piechartScale'
    | 'pointColor'
    | 'pointLabelHelp'
    | 'pointOfContact'
    | 'printMap'
    | 'printDownloadingBaseMap'
    | 'printNotStarted'
    | 'printPreparingPDF'
    | 'propName'
    | 'propNameForLabel'
    | 'publicationStatus'
    | 'publish'
    | 'published'
    | 'quotationMark'
    | 'remove'
    | 'removeMap'
    | 'replaceFR'
    | 'replaceNL'
    | 'resetLegend'
    | 'responsibleAndContact'
    | 'responsibleOrganisation'
    | 'responsiblePerson'
    | 'rowNumberColTitle'
    | 'save'
    | 'saving'
    | 'search'
    | 'searchAtlas'
    | 'selectLayer'
    | 'semicolon'
    | 'separatedBy'
    | 'setLatitude'
    | 'setLongitude'
    | 'settings'
    | 'share'
    | 'shareWithView'
    | 'sheetList'
    | 'size'
    | 'skipFirstLine'
    | 'space'
    | 'start'
    | 'startDate'
    | 'stop'
    | 'studio'
    | 'style'
    | 'styleGroupAdd'
    | 'styleGroupDefaultName'
    | 'styleGroupRemove'
    | 'styleGroupSelectedItemsCount'
    | 'switch'
    | 'switchLabel'
    | 'switchLang'
    | 'switchMarker'
    | 'tab'
    | 'templateEditorExplanation'
    | 'temporalReference'
    | 'term'
    | 'textDelimiter'
    | 'textFormat'
    | 'textStyle'
    | 'thesaurus'
    | 'timeserieConfigError'
    | 'timeserieFeatureProperty'
    | 'timeserieFeaturePropertyNone'
    | 'timeserieReference'
    | 'timeserieTemplateURL'
    | 'timeserieURL'
    | 'title'
    | 'toggle-off'
    | 'toggle-on'
    | 'topics'
    | 'translate'
    | 'unpublish'
    | 'upload'
    | 'uploadDatas'
    | 'uploadShpInfos'
    | 'usePattern'
    | 'userName'
    | 'validate'
    | 'valuesCovered'
    | 'view'
    | 'viewLayer'
    | 'visible'
    | 'webServiceUrl'
    | 'widgets'
    | 'wmsSwitch'
    | 'zoomIn'
    | 'zoomOut'
    | 'zoomOnFeature'
    ;




export type MessageDB = {
    [K in MessageKey]: MessageRecord;
};


/**
 * Messages are ICU formated messages, see guide at
 * http://userguide.icu-project.org/formatparse/messages
 */
export const messages: MessageDB = {
    all: {
        fr: 'Tout',
        nl: 'Alles',
    },

    add: {
        fr: 'Ajouter',
        nl: 'Toevoegen',
    },

    address: {
        fr: 'Adresse',
        nl: 'Adres',
    },

    addInterval: {
        fr: 'Ajouter un intervale',
        nl: 'Interval toevoegen',
    },

    addLayer: {
        fr: 'Ajouter',
        nl: 'Toevoegen',
    },

    attributesTable: {
        fr: 'Table attributaire',
        nl: 'Attributentabel',
    },

    attachedFiles: {
        fr: 'Documents',
        nl: 'Documenten',
    },

    attachmentAdd: {
        fr: 'Ajouter document',
        nl: 'Document toevoegen',
    },

    attachmentUpload: {
        fr: 'Upload',
        nl: 'Uploaden',
    },

    attachmentUploadActive: {
        fr: 'Uploading',
        nl: 'Bezig met uploaden',
    },

    attachmentName: {
        fr: 'Nom du lien',
        nl: 'Naam van het link',
    },

    attachmentUrl: {
        fr: 'URL du lien',
        nl: 'URL van het link',
    },

    browseMaps: {
        fr: 'Feuilleter des cartes',
        nl: 'Verken de kaarten',
    },

    cancel: {
        fr: 'Annuler',
        nl: 'Annuleer',
    },

    charts: {
        fr: 'Graphiques',
        nl: 'Grafieken',
    },

    clear: {
        fr: 'Supprimer',
        nl: 'Verwijderen',
    },

    close: {
        fr: 'Fermer',
        nl: 'Sluiten',
    },

    colorOpacity: {
        fr: 'Opacité',
        nl: 'Opaciteit',
    },
    colorSaturation: {
        fr: 'Saturation',
        nl: 'Verzadiging',
    },
    colorLightness: {
        fr: 'Luminosité',
        nl: 'Helderheid',
    },

    connect: {
        fr: 'Connecter',
        nl: 'Inloggen',
    },

    copy: {
        fr: 'Copier',
        nl: 'kopiëren',
    },

    datas: {
        fr: 'Données',
        nl: 'Gegevens',
    },

    editFeatureTemplate: {
        fr: 'Éditer la fiche individuelle',
        nl: 'Bewerk de individuele fiche',
    },

    featureTemplateEditor: {
        fr: 'Éditeur de fiche individuelle',
        nl: 'Individuele fiche bewerken',
    },

    featureTemplateEditorReset: {
        fr: 'Réinitialiser la fiche individuelle',
        nl: 'Reset individuele fiche',
    },

    featureViewTypeDefault: {
        fr: 'Standaard',
        nl: 'Standaard',
    },

    featureViewTypeTemplate: {
        fr: 'Template',
        nl: 'Template',
    },

    featureViewTypeConfig: {
        fr: 'Configurable',
        nl: 'Instelbaar',
    },

    featureViewTypeTimeserie: {
        fr: 'Bar chart',
        nl: 'Staafdiagram',
    },

    featureViewTypePieChart: {
        fr: 'Pie chart',
        nl: 'Taartdiagram',
    },

    featureViewUnvalidTemplate: {
        fr: 'Template invalide',
        nl: 'Ongeldige template',
    },

    dataType: {
        fr: 'Type de données',
        nl: 'Gegevenstype',
    },

    displayLabel: {
        fr: 'Afficher le titre de la colonne',
        nl: 'Geef naam van de kolom weer',
    },

    textFormat: {
        fr: 'Format du text',
        nl: 'Tekst formaat',
    },

    textStyle: {
        fr: 'Style du texte',
        nl: 'Tekst stijl',
    },

    editLegend: {
        fr: 'Éditer',
        nl: 'Bewerken',
    },

    editMap: {
        fr: 'Éditer',
        nl: 'Bewerken',
    },

    editLayer: {
        fr: 'Éditer',
        nl: 'Bewerken',
    },

    embed: {
        fr: 'Inclure dans votre site web',
        nl: 'Integreer in uw website',
    },

    emptyDescription: {
        fr: 'Description',
        nl: 'Beschrijving',
    },

    emptyMapDescription: {
        fr: 'Description de la carte',
        nl: 'Kaartbeschrijving',
    },

    emptyTitle: {
        fr: 'Titre',
        nl: 'Titel',
    },

    emptyMapTitle: {
        fr: 'Titre de la carte',
        nl: 'Kaarttitel',
    },

    export: {
        fr: 'Export',
        nl: 'Exporteer',
    },

    extentBegin: {
        fr: 'Début',
        nl: 'Begin',
    },

    extentEnd: {
        fr: 'Fin',
        nl: 'Einde',
    },


    featureInfos: {
        fr: 'Informations sur l\'élément',
        nl: 'Informatie van het element',
    },

    go: {
        fr: 'Aller',
        nl: 'Ga',
    },

    geocode: {
        fr: 'Chercher une adresse',
        nl: 'Zoek een adres',
    },

    gpsTracker: {
        fr: 'Tracker GPS',
        nl: 'GPS tracker',
    },

    imageGeneratingPreview: {
        fr: 'Création de la prévisualisation',
        nl: 'Voorvertoning genereren',
    },

    imagePreview: {
        fr: 'Aperçu',
        nl: 'Voorvertoning',
    },

    imageUploading: {
        fr: 'Uploading',
        nl: 'Afbeelding wordt geupload',
    },

    lastModified: {
        fr: 'Dernière mise à jour le ',
        nl: 'Laatste wijziging ',
    },

    login: {
        fr: 'Se connecter',
        nl: 'Inloggen',
    },

    logout: {
        fr: 'Se déconnecter',
        nl: 'Uitloggen',
    },

    location: {
        fr: 'Localisation',
        nl: 'Plaatsbepaling',
    },

    locationHelp: {
        fr: 'Les coordonnées doivent être encodées dans le système Lambert Belge 72 (EPSG:31370)',
        nl: 'Coördinaten moeten worden geëncodeerd in het Belgische Lambert systeem 72 (EPSG: 31370)',
    },

    mapLegend: {
        fr: 'Légende',
        nl: 'Legende',
    },

    mapTools: {
        fr: 'Outils',
        nl: 'Tools',
    },

    mapDatas: {
        fr: 'Couches',
        nl: 'Lagen',
    },

    mapRefList: {
        fr: 'Maps',
        nl: 'Kaarten',
    },

    rowNumberColTitle: {
        fr: '#',
        nl: '#',
    },

    save: {
        fr: 'Sauvegarder',
        nl: 'Opslaan',
    },

    search: {
        fr: 'Recherche',
        nl: 'Zoeken',
    },

    searchAtlas: {
        fr: 'Chercher dans l\'atlas',
        nl: 'Zoek in de atlas',
    },

    start: {
        fr: 'Démarrer',
        nl: 'Beginnen',
    },

    stop: {
        fr: 'Arrêter',
        nl: 'Stoppen',
    },

    timeserieFeatureProperty: {
        fr: 'Attribute',
        nl: 'Attribuut',
    },

    timeserieFeaturePropertyNone: {
        fr: 'N\'utilise pas une attribute',
        nl: 'Gebruik geen attribuut',
    },

    timeserieURL: {
        fr: 'url',
        nl: 'url',
    },

    timeserieConfigError: {
        fr: 'No or malformed configuration for this timeserie',
        nl: 'Fout in het laden van de voorkeuren voor deze grafiek',
    },

    latitude: {
        fr: 'Latitude (Y)',
        nl: 'Breedtegraad (Y)',
    },

    legendBuilder: {
        fr: 'Éditeur de légende',
        nl: 'Legende bewerken',
    },

    legendType: {
        fr: 'Type de légende',
        nl: 'Type legende',
    },

    legendTypeSimple: {
        fr: 'Simple',
        nl: 'Enkel symbool',
    },

    legendTypeDiscrete: {
        fr: 'Catégorisée',
        nl: 'Categorieën',
    },

    legendTypeContinuous: {
        fr: 'Continue',
        nl: 'Intervallen',
    },

    legendTypeSelect: {
        fr: 'Type de légende',
        nl: 'Type legende',
    },

    longitude: {
        fr: 'Longitude (X)',
        nl: 'Lengtegraad (X)',
    },

    measure: {
        fr: 'Mesurer',
        nl: 'Meten',
    },

    measureLength: {
        fr: 'Longueur',
        nl: 'Lengte',
    },

    measureArea: {
        fr: 'Superficie',
        nl: 'Oppervlakte',
    },

    mapEmbed: {
        fr: 'Inclure la carte',
        nl: 'Voeg deze kaart in',
    },

    mapEmbedWithView: {
        fr: 'Inclure la vue actuelle de la carte',
        nl: 'Voeg de huidige weergave van de kaart in',
    },

    mapInfoAddIllustration: {
        fr: 'Sélectionnez une image',
        nl: 'Selecteer een afbeelding',
    },

    mapInfoChangeIllustration: {
        fr: 'Sélectionnez une autre image',
        nl: 'Selecteer een andere afbeelding',
    },

    mapLink: {
        fr: 'Partager un lien vers la carte',
        nl: 'Deel een link naar deze kaart',
    },

    mapLinkWithView: {
        fr: 'Partager un lien vers la vue actuelle de la carte',
        nl: 'Deel een link naar de huidige kaartweergave',
    },

    remove: {
        fr: 'Supprimer',
        nl: 'Verwijder',
    },

    removeMap: {
        fr: 'Supprimer cette carte',
        nl: 'Verwijder deze kaart',
    },

    share: {
        fr: 'Partager',
        nl: 'Delen',
    },

    shareWithView: {
        fr: 'Partager avec le niveau de zoom et le centrage actuel.',
        nl: 'Delen met het huidige zoomniveau en middelpunt.',
    },

    switchLang: {
        fr: 'NL',
        nl: 'FR',
    },

    styleGroupAdd: {
        fr: 'Ajouter une catégorie',
        nl: 'Categorie toevoegen',
    },

    styleGroupDefaultName: {
        fr: 'Catégorie sans titre',
        nl: 'Categorie zonder titel',
    },

    styleGroupSelectedItemsCount: {
        fr: 'Éléments séléctionné',
        nl: 'Geselecteerde rijen',
    },

    styleGroupRemove: {
        fr: 'Supprimer la catégorie',
        nl: 'Categorie verwijderen',
    },

    validate: {
        fr: 'Valider',
        nl: 'Bevestigen',
    },

    visible: {
        fr: 'Visibilité',
        nl: 'Zichtbaarheid',
    },

    webServiceUrl: {
        fr: 'URL d\'un webservice',
        nl: 'URL voor een webservice',
    },

    wmsSwitch: {
        fr: 'Fond de carte',
        nl: 'Achtergrond',
    },

    loadingData: {
        fr: 'Chargement des données',
        nl: 'Data wordt geladen',
    },

    valuesCovered: {
        fr: 'match',
        nl: 'match',
    },

    highValue: {
        fr: 'Valeur haute (exclue)',
        nl: 'Bovengrens (uitgesloten)',
    },

    lowValue: {
        fr: 'Valeur basse (incluse)',
        nl: 'Ondergrens (ingesloten)',
    },

    map: {
        fr: '{n, plural, =0 {Carte} =1 {Carte} other {Cartes}}',
        nl: '{n, plural, =0 {Kaart} =1 {Kaart} other {Kaarten}}',
        parameters: { n: 1 },
    },

    layer: {
        fr: '{n, plural, =0 {Couche} =1 {Couche} other {Couches}}',
        nl: '{n, plural, =0 {Laag} =1 {Laag} other {Lagen}}',
        parameters: { n: 1 },
    },

    lineWidth: {
        fr: 'Épaisseur du filet (px)',
        nl: 'Lijnbreedte (px)',
    },

    lineColor: {
        fr: 'Couleur du filet',
        nl: 'Lijnkleur',
    },

    fillColor: {
        fr: 'Couleur de remplissage',
        nl: 'Vulkleur',
    },

    pointColor: {
        fr: 'Couleur du pictogramme',
        nl: 'Kleur van het pictogram',
    },

    confirm: {
        fr: 'Confirmer',
        nl: 'Bevestigen',
    },

    confirmDelete: {
        fr: 'Confirmer la suppression ?',
        nl: 'Bevestig de verwijdering ?',
    },

    propName: {
        fr: 'Nom d\'attribut',
        nl: 'Naam van het attribuut',
    },

    propNameForLabel: {
        fr: 'Colonne à utiliser pour le label',
        nl: 'Kolom om het label op te baseren',
    },

    fontColor: {
        fr: 'Couleur du texte',
        nl: 'Letterkleur van label',
    },

    fontSize: {
        fr: 'Corps du texte (px)',
        nl: 'Lettergrootte van label (px)',
    },

    switchLabel: {
        fr: 'Label',
        nl: 'Label',
    },

    switchMarker: {
        fr: 'Icône',
        nl: 'Icoon',
    },

    legendInfoHeader: {
        fr: 'Informations et réglages',
        nl: 'Informatie en instellingen',
    },

    style: {
        fr: 'Réglage des styles',
        nl: 'Instellen van stijlen',
    },

    legendItems: {
        fr: 'Classification',
        nl: 'Classificatie',
    },

    resetLegend: {
        fr: 'Réinitialiser la légende',
        nl: 'Reset legende',
    },

    newLayer: {
        fr: 'Nouvelle couche',
        nl: 'Nieuwe laag',
    },

    newMap: {
        fr: 'Nouvelle carte',
        nl: 'Nieuwe kaart',
    },

    selectLayer: {
        fr: 'Sélection de couche',
        nl: 'Kies een laag',
    },

    responsibleAndContact: {
        fr: 'Organisation responsable',
        nl: 'Verantwoordelijke organisatie',
    },

    responsiblePerson: {
        fr: 'Personne responsable',
        nl: 'Verantwoordelijke persoon',
    },

    size: {
        fr: 'Taille (px)',
        nl: 'Grootte (px)',
    },

    codePoint: {
        fr: 'Code de caractère',
        nl: 'Tekencode',
    },

    legendItemAdd: {
        fr: 'Ajouter un élément de légende',
        nl: 'Legende item toevoegen',
    },

    labelPostion: {
        fr: 'Position du label',
        nl: 'Plaats van het label',
    },

    columnPicker: {
        fr: 'Sélecteur de colonne',
        nl: 'Kolomkiezer',
    },

    columnPickerMessage: {
        fr: 'Sélectionnez une colonne pour construire la légende.',
        nl: 'Selecteer een kolom om de legende te maken.',
    },

    templateEditorExplanation: {
        fr: 'Template. The template will be updated on blur. Variable: <%= attribute_name %>. Or between <% %> plain javascript.',
        nl: 'Template. The template will be updated on blur. Variable: <%= attribute_name %>. Or between <% %> plain javascript.',
    },

    dashboard: {
        fr: 'Tableau de bord',
        nl: 'Dashboard',
    },

    addToLegend: {
        fr: 'Ajouter à la légende',
        nl: 'Toevoegen aan legende',
    },

    infoChoice: {
        fr: 'Choix des informations',
        nl: 'Keuze van de informatie',
    },

    infoReorder: {
        fr: 'Organisation des informations',
        nl: 'Ordening van de informatie',
    },

    addTerm: {
        fr: 'Ajouter un terme',
        nl: 'Een woord toevoegen',
    },

    noResults: {
        fr: 'Pas de résultat',
        nl: 'Geen resultaten',
    },

    pointLabelHelp: {
        fr: 'Réglages des labels pour l\'ensemble de la couche',
        nl: 'Instellingen van alle labels in de laag',
    },

    timeserieTemplateURL: {
        fr: 'Un gabarit d\'URL pointant vers une ressource produisant une série temporelle de la forme "http://exemple.com/ts/\\{columnName\\}.json".',
        nl: 'Een template voor de URL die verwijst naar de gegevensbron voor het maken van een tijdreeks. Gebruik de volgende vorm: "http://voorbeeld.com/ts/\\{kolomNaam\\}.json".',
    },

    timeserieReference: {
        fr: 'Valeur de référence',
        nl: 'Referentiewaarde',
    },

    viewLayer: {
        fr: 'Visualiser la couche',
        nl: 'Toon de laag',
    },

    columns: {
        fr: 'Colonnes',
        nl: 'Kolommen',
    },

    widgets: {
        fr: 'Widgets',
        nl: 'Widgets',
    },

    piechartScale: {
        fr: 'Échelle',
        nl: 'Schaal',
    },

    piechartRadius: {
        fr: 'Rayon',
        nl: 'Straal',
    },

    label: {
        fr: 'Label',
        nl: 'Label',
    },

    autoClass: {
        fr: 'Création automatique de classes',
        nl: 'Automatische selectie van klassen',
    },

    offsetX: {
        fr: 'Offset X',
        nl: 'Offset X',
    },

    offsetY: {
        fr: 'Offset Y',
        nl: 'Offset Y',
    },

    skipFirstLine: {
        fr: 'Ne pas prendre en compte la première ligne',
        nl: 'Houden geen rekening met de eerste lijn',
    },

    separatedBy: {
        fr: 'Séparateur',
        nl: 'Separator',
    },

    textDelimiter: {
        fr: 'Délimiteur de texte',
        nl: 'Scheidingsteken van tekst',
    },

    comma: {
        fr: 'Virgule',
        nl: 'Komma',
    },

    semicolon: {
        fr: 'Point virgule',
        nl: 'Puntkomma',
    },

    tab: {
        fr: 'Tabulation',
        nl: 'Tab',
    },

    space: {
        fr: 'Espace',
        nl: 'Spatie',
    },

    quotationMark: {
        fr: 'Guillemet',
        nl: 'Aanhalingsteken',
    },

    apostrophe: {
        fr: 'Apostrophe',
        nl: 'Apostrof',
    },

    columnNumber: {
        fr: 'N° de colonne',
        nl: 'Kolomnummer',
    },

    setLatitude: {
        fr: 'Latitude (Y)',
        nl: 'Breedtegraad (Y)',
    },

    setLongitude: {
        fr: 'Longitude (X)',
        nl: 'Lengtegraad (X)',
    },

    uploadShpInfos: {
        fr: 'Veuillez séléctionner les quatre fichiers requis composant le shapefile.',
        nl: 'Selecteer de vier nodige bestanddelen van de shapefile.',
    },

    upload: {
        fr: 'Upload',
        nl: 'Uploaden',
    },

    uploadDatas: {
        fr: 'Upload de données',
        nl: 'Upload van de gegevens',
    },

    metadataEditor: {
        fr: 'Édition des métadonnées',
        nl: 'Metadata bewerken',
    },

    sheetList: {
        fr: 'Liste des fiches',
        nl: 'Lijst van de fiches',
    },

    metaCommon: {
        fr: 'Métadonnées bilingues',
        nl: 'Tweetalige metadata',
    },

    metaFrench: {
        fr: 'Métadonnées françaises',
        nl: 'Franse metadata',
    },

    metaDutch: {
        fr: 'Métadonnées Néerlandaises',
        nl: 'Nederlandse metadata',
    },

    title: {
        fr: 'Titre',
        nl: 'Titel',
    },

    geometryType: {
        fr: 'Geométrie',
        nl: 'Geometrie',
    },

    layerId: {
        fr: 'Identifiant de la ressource',
        nl: 'Bronidentificatie',
    },

    layerInfo: {
        fr: 'Informations',
        nl: 'Informatie',
    },

    temporalReference: {
        fr: 'Référence temporelle',
        nl: 'Tijdelijke referentie',
    },

    pointOfContact: {
        fr: 'Point de contact',
        nl: 'Contactpunt',
    },

    responsibleOrganisation: {
        fr: 'Organisation responsable',
        nl: 'Verantwoordelijke organisatie',
    },

    draft: {
        fr: 'Brouillon',
        nl: 'Ontwerp',
    },

    published: {
        fr: 'Publié',
        nl: 'Gepubliceerd',
    },

    publish: {
        fr: 'Publier',
        nl: 'Publiceren',
    },

    publicationStatus: {
        fr: 'État de publication',
        nl: 'Status van publicatie',
    },

    saving: {
        fr: 'Mise à jour des données',
        nl: 'Gegevens bijwerken',
    },

    identifier: {
        fr: 'Identifiant',
        nl: 'Identifier',
    },

    keywords: {
        fr: 'Mots clés',
        nl: 'Trefwoorden',
    },

    topics: {
        fr: 'Thème',
        nl: 'Thema',
    },

    unpublish: {
        fr: 'Dépublier',
        nl: 'Unpublish',
    },

    myMaps: {
        fr: 'Mes cartes',
        nl: 'Mijn kaarten',
    },

    atlas: {
        fr: 'Atlas',
        nl: 'Atlas',
    },

    atlasEnv: {
        fr: 'Atlas de l\'environnement',
        nl: 'Milieu-Atlas',
    },

    userName: {
        fr: 'Nom d\'utilisateur',
        nl: 'Gebruikersnaam',
    },

    password: {
        fr: 'Mot de passe',
        nl: 'Wachtwoord',
    },

    connectionSDI: {
        fr: 'Connection',
        nl: 'Verbinding',
    },

    alias: {
        fr: 'Alias',
        nl: 'Alias',
    },

    mapList: {
        fr: 'Liste des cartes',
        nl: 'kaartlijst',
    },

    studio: {
        fr: 'Studio',
        nl: 'Studio',
    },

    metadata: {
        fr: 'Métadonnées',
        nl: 'Metadata',
    },

    myApps: {
        fr: 'Outils et applications',
        nl: 'Tools en apps',
    },

    thesaurus: {
        fr: 'Thesaurus',
        nl: 'Thesaurus',
    },

    term: {
        fr: 'Terme',
        nl: 'Term',
    },

    replaceFR: {
        fr: 'Alias FR',
        nl: 'Alias FR',
    },

    replaceNL: {
        fr: 'Alias NL',
        nl: 'Alias NL',
    },

    aliasDictonary: {
        fr: 'Dictionnaire des alias',
        nl: 'Woordenboek van aliassen',
    },

    createAlias: {
        fr: 'Créer un nouvel alias',
        nl: 'Maak een nieuw alias aan',
    },

    columnID: {
        fr: 'Identifiant de colonne',
        nl: 'Kolom naam',
    },

    extractFeatures: {
        fr: 'Forage',
        nl: 'Boren',
    },

    links: {
        fr: 'Liens',
        nl: 'Links',
    },

    extractSearch: {
        fr: 'Recherche par forage',
        nl: 'Boren onderzoek',
    },

    extractOn: {
        fr: 'Intersection avec la zone visible',
        nl: 'Intersectie met het weergegeven gebied',
    },

    extractOff: {
        fr: 'Tous les éléments',
        nl: 'Alle elementen',
    },

    changeBackgroundMap: {
        fr: 'Changer de fond de carte',
        nl: 'Wijzig de achtergrond',
    },

    zoomIn: {
        fr: 'Zoomer',
        nl: 'Zoomen',
    },

    zoomOut: {
        fr: 'Dézoomer',
        nl: 'Uitzoomen',
    },

    north: {
        fr: 'Nord',
        nl: 'Noord',
    },

    fullscreen: {
        fr: 'Plein écran',
        nl: 'Volledig scherm',
    },

    translate: {
        fr: 'Traduire',
        nl: 'Vertalen',
    },

    switch: {
        fr: 'Changer',
        nl: 'Omschakelen',
    },

    edit: {
        fr: 'Éditer',
        nl: 'Bewerk',
    },

    'toggle-off': {
        fr: 'Désactiver',
        nl: 'Deactiveren',
    },

    'toggle-on': {
        fr: 'Activer',
        nl: 'Activeren',
    },

    'move-down': {
        fr: 'Redescendre',
        nl: 'Naar beneden verplaatsen',
    },

    'move-up': {
        fr: 'Remonter',
        nl: 'Naar boven verplaatsen',
    },

    view: {
        fr: 'Visiblité',
        nl: 'Zichtbaarheid',
    },

    settings: {
        fr: 'Réglages',
        nl: 'Instellingen',
    },

    filter: {
        fr: 'Filtrer',
        nl: 'Filter',
    },

    startDate: {
        fr: 'Date de début',
        nl: 'Startdatum',
    },

    endDate: {
        fr: 'Date de fin',
        nl: 'Einddatum',
    },

    minZoom: {
        fr: 'Zoom minimal',
        nl: 'Minimale zoom',
    },

    maxZoom: {
        fr: 'Zoom maximal',
        nl: 'Maximale zoom',
    },

    zoomOnFeature: {
        fr: 'Zoomer sur l\'entité',
        nl: 'Zoom in op de entiteit',
    },

    layerInfoSettings: {
        fr: 'Éditer la fiche individuelle',
        nl: 'Bewerk de individuele fiche',
    },

    layerInfoSwitchMap: {
        fr: 'Carte',
        nl: 'Kaart',
    },

    layerInfoSwitchTable: {
        fr: 'Table attributaire',
        nl: 'Attributentabel',
    },

    usePattern: {
        fr: 'Hachures',
        nl: 'Arcering',
    },

    layerLegendDefaultLabel: {
        fr: 'Étiquette de légende',
        nl: 'Legendelabel',
    },

    featureText: {
        fr: 'Texte',
        nl: 'Tekst',
    },

    printMap: {
        fr: 'Imprimer la carte',
        nl: 'Print de kaart',
    },

    printDownloadingBaseMap: {
        fr: 'Téléchargement du fond de carte',
        nl: 'De achtergrond downloaden',
    },

    printNotStarted: {
        fr: 'Rendu des couches vectorielles',
        nl: 'Weergave van vectorlagen',
    },

    printPreparingPDF: {
        fr: 'Génération du PDF',
        nl: 'PDF generatie',
    },

    originalTitle: {
        fr: 'Titre original',
        nl: 'Originele titel',
    },
};
