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
    | 'amountBorrowed'
    | 'analyse'
    | 'annualConsumptionKWh'
    | 'annualMaintenance'
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
    | 'autoproduction'
    | 'backToMap'
    | 'boiler'
    | 'browseMaps'
    | 'buyingPrice'
    | 'cancel'
    | 'changeBackgroundMap'
    | 'changeMyHabits'
    | 'charts'
    | 'chimneyAir'
    | 'chimneySmoke'
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
    | 'consumption'
    | 'comma'
    | 'contactInstallator'
    | 'confirm'
    | 'confirmDelete'
    | 'connect'
    | 'connectionSDI'
    | 'copy'
    | 'createAlias'
    | 'cursorLocalisation'
    | 'dashboard'
    | 'datas'
    | 'dataType'
    | 'dayConsumption'
    | 'displayLabel'
    | 'dormerWindow'
    | 'downloadCSV'
    | 'draft'
    | 'durationYear'
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
    | 'energy'
    | 'estim10Y'
    | 'existingSolarPannel'
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
    | 'finance'
    | 'flatRoofWindow'
    | 'fontColor'
    | 'fontSize'
    | 'fullscreen'
    | 'gainGreenCertif'
    | 'gainElecInvoice'
    | 'gainEnvironment'
    | 'gainTotal25Y'
    | 'geocode'
    | 'geometryType'
    | 'go'
    | 'gpsTracker'
    | 'heatPump'
    | 'highValue'
    | 'hotWaterDuringDay'
    | 'identifier'
    | 'imageGeneratingPreview'
    | 'imagePreview'
    | 'imageUploading'
    | 'in'
    | 'infoChoice'
    | 'infoReorder'
    | 'inspireCompliant'
    | 'installation'
    | 'installationObstacle'
    | 'installationPrice'
    | 'installBatteries'
    | 'internal'
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
    | 'lift'
    | 'lineColor'
    | 'lineWidth'
    | 'links'
    | 'loadingData'
    | 'loan'
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
    | 'monocristal'
    | 'monocristalHR'
    | 'monthlyPayment'
    | 'move-down'
    | 'move-up'
    | 'myApps'
    | 'myMaps'
    | 'newLayer'
    | 'newMap'
    | 'noResults'
    | 'north'
    | 'obstacleEstimation'
    | 'offsetX'
    | 'offsetY'
    | 'originalTitle'
    | 'orientationGreat'
    | 'orientationGood'
    | 'panelIntegration'
    | 'password'
    | 'personalize'
    | 'piechartRadius'
    | 'piechartScale'
    | 'pointColor'
    | 'pointLabelHelp'
    | 'pointOfContact'
    | 'polycristal'
    | 'power'
    | 'preview'
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
    | 'reduceConsumption'
    | 'relatedMapsLabel'
    | 'remove'
    | 'removeMap'
    | 'replaceFR'
    | 'replaceNL'
    | 'resetLegend'
    | 'responsibleAndContact'
    | 'responsibleOrganisation'
    | 'responsiblePerson'
    | 'returnTime'
    | 'rowNumberColTitle'
    | 'roofTotalArea'
    | 'save'
    | 'saving'
    | 'search'
    | 'searchAtlas'
    | 'selectLayer'
    | 'sellingGreenCertifPrice'
    | 'sellingPrice'
    | 'semicolon'
    | 'separatedBy'
    | 'setLatitude'
    | 'setLongitude'
    | 'settings'
    | 'share'
    | 'shareWithView'
    | 'sheet'
    | 'sheetList'
    | 'size'
    | 'solar'
    | 'solarAutonomy'
    | 'solarPV'
    | 'solarThermal'
    | 'space'
    | 'skipFirstLine'
    | 'start'
    | 'startGPS'
    | 'startDate'
    | 'stop'
    | 'studio'
    | 'style'
    | 'styleGroupAdd'
    | 'styleGroupDefaultName'
    | 'styleGroupRemove'
    | 'styleGroupSelectedItemsCount'
    | 'surface'
    | 'switch'
    | 'switchLabel'
    | 'switchLang'
    | 'switchMarker'
    | 'tab'
    | 'technoType'
    | 'templateEditorExplanation'
    | 'temporalReference'
    | 'terraceInUse'
    | 'term'
    | 'textDelimiter'
    | 'textFormat'
    | 'textStyle'
    | 'thesaurus'
    | 'thisBuildingGotA'
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
    | 'unusable'
    | 'upload'
    | 'uploadDatas'
    | 'uploadShpInfos'
    | 'usableArea'
    | 'usePattern'
    | 'userName'
    | 'VAT'
    | 'VAT21'
    | 'VAT6'
    | 'VAT0'
    | 'validate'
    | 'valuesCovered'
    | 'velux'
    | 'view'
    | 'viewLayer'
    | 'visible'
    | 'webServiceUrl'
    | 'widgets'
    | 'wmsLegendHide'
    | 'wmsLegendDisplay'
    | 'wmsSwitch'
    | 'yearConsumption'
    | 'yearProduction'
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
        en: 'All',
    },

    add: {
        fr: 'Ajouter',
        nl: 'Toevoegen',
        en: 'Add',
    },

    address: {
        fr: 'Adresse',
        nl: 'Adres',
        en: 'Adress',
    },

    addInterval: {
        fr: 'Ajouter un intervale',
        nl: 'Interval toevoegen',
        en: 'Add an interval',
    },

    addLayer: {
        fr: 'Ajouter',
        nl: 'Toevoegen',
        en: 'Add',
    },

    attributesTable: {
        fr: 'Table attributaire',
        nl: 'Attributentabel',
        en: 'Attribute table',
    },

    attachedFiles: {
        fr: 'Documents',
        nl: 'Documenten',
        en: 'Documents',
    },

    attachmentAdd: {
        fr: 'Ajouter document',
        nl: 'Document toevoegen',
        en: 'Add document',
    },

    attachmentUpload: {
        fr: 'Upload',
        nl: 'Uploaden',
        en: 'Upload',
    },

    attachmentUploadActive: {
        fr: 'Uploading',
        nl: 'Bezig met uploaden',
        en: 'Uploading',
    },

    attachmentName: {
        fr: 'Nom du lien',
        nl: 'Naam van het link',
        en: 'Link name',
    },

    attachmentUrl: {
        fr: 'URL du lien',
        nl: 'URL van het link',
        en: 'Link URL',
    },

    browseMaps: {
        fr: 'Feuilleter des cartes',
        nl: 'Verken de kaarten',
        en: 'Browse maps',
    },

    cancel: {
        fr: 'Annuler',
        nl: 'Annuleer',
        en: 'Cancel',
    },

    charts: {
        fr: 'Graphiques',
        nl: 'Grafieken',
        en: 'Charts',
    },

    clear: {
        fr: 'Supprimer',
        nl: 'Verwijderen',
        en: 'Delete',
    },

    close: {
        fr: 'Fermer',
        nl: 'Sluiten',
        en: 'Close',
    },

    colorOpacity: {
        fr: 'Opacité',
        nl: 'Opaciteit',
        en: 'Opacity',
    },
    colorSaturation: {
        fr: 'Saturation',
        nl: 'Verzadiging',
        en: 'Saturation',
    },
    colorLightness: {
        fr: 'Luminosité',
        nl: 'Helderheid',
        en: 'Lightness',
    },

    connect: {
        fr: 'Connecter',
        nl: 'Inloggen',
        en: 'Connect',
    },

    copy: {
        fr: 'Copier',
        nl: 'Kopiëren',
        en: 'Copy',
    },

    datas: {
        fr: 'Données',
        nl: 'Gegevens',
        en: 'Datas',
    },

    editFeatureTemplate: {
        fr: 'Éditer la fiche individuelle',
        nl: 'Bewerk de individuele fiche',
        en: 'Edit feature view',
    },

    featureTemplateEditor: {
        fr: 'Éditeur de fiche individuelle',
        nl: 'Individuele fiche bewerken',
        en: 'Feature view editor',
    },

    featureTemplateEditorReset: {
        fr: 'Réinitialiser la fiche individuelle',
        nl: 'Reset individuele fiche',
        en: 'Reset feature view',
    },

    featureViewTypeDefault: {
        fr: 'Standard',
        nl: 'Standaard',
        en: 'Default',
    },

    featureViewTypeTemplate: {
        fr: 'Template',
        nl: 'Template',
        en: 'Template',
    },

    featureViewTypeConfig: {
        fr: 'Configurable',
        nl: 'Instelbaar',
        en: 'Configuration',
    },

    featureViewTypeTimeserie: {
        fr: 'Bar chart',
        nl: 'Staafdiagram',
        en: 'Bar chart',
    },

    featureViewTypePieChart: {
        fr: 'Diagramme circulaire',
        nl: 'Taartdiagram',
        en: 'Pie chart',
    },

    featureViewUnvalidTemplate: {
        fr: 'Template invalide',
        nl: 'Ongeldige template',
        en: 'Invalid template',
    },

    dataType: {
        fr: 'Type de données',
        nl: 'Gegevenstype',
        en: 'Datas type',
    },

    displayLabel: {
        fr: 'Afficher le titre de la colonne',
        nl: 'Geef naam van de kolom weer',
        en: 'Display column title',
    },

    textFormat: {
        fr: 'Format du text',
        nl: 'Tekst formaat',
        en: 'Text format',
    },

    textStyle: {
        fr: 'Style du texte',
        nl: 'Tekst stijl',
        en: 'Text style',
    },

    editLegend: {
        fr: 'Éditer',
        nl: 'Bewerken',
        en: 'Edit',
    },

    editMap: {
        fr: 'Éditer',
        nl: 'Bewerken',
        en: 'Edit',
    },

    editLayer: {
        fr: 'Éditer',
        nl: 'Bewerken',
        en: 'Edit',
    },

    embed: {
        fr: 'Inclure dans votre site web',
        nl: 'Integreer in uw website',
        en: 'Embed in your web site',
    },

    emptyDescription: {
        fr: 'Description',
        nl: 'Beschrijving',
        en: 'Description',
    },

    emptyMapDescription: {
        fr: 'Description de la carte',
        nl: 'Kaartbeschrijving',
        en: 'Map description',
    },

    emptyTitle: {
        fr: 'Titre',
        nl: 'Titel',
        en: 'Title',
    },

    emptyMapTitle: {
        fr: 'Titre de la carte',
        nl: 'Kaarttitel',
        en: 'Map title',
    },

    export: {
        fr: 'Export',
        nl: 'Exporteer',
        en: 'Export',
    },

    extentBegin: {
        fr: 'Début',
        nl: 'Begin',
        en: 'Begining',
    },

    extentEnd: {
        fr: 'Fin',
        nl: 'Einde',
        en: 'End',
    },


    featureInfos: {
        fr: 'Informations sur l\'élément',
        nl: 'Informatie van het element',
        en: 'Feature informations',
    },

    go: {
        fr: 'Aller',
        nl: 'Ga',
        en: 'Go',
    },

    geocode: {
        fr: 'Chercher une adresse',
        nl: 'Zoek een adres',
        en: 'Search an adress',
    },

    gpsTracker: {
        fr: 'Tracker GPS',
        nl: 'GPS tracker',
        en: 'GPS tracker',
    },

    imageGeneratingPreview: {
        fr: 'Création de la prévisualisation',
        nl: 'Voorvertoning genereren',
        en: 'Generating preview',
    },

    imagePreview: {
        fr: 'Aperçu',
        nl: 'Voorvertoning',
        en: 'Preview',
    },

    imageUploading: {
        fr: 'Uploading',
        nl: 'Afbeelding wordt geupload',
        en: 'Uploading',
    },

    lastModified: {
        fr: 'Dernière mise à jour le ',
        nl: 'Laatste wijziging ',
        en: 'Last update on ',
    },

    login: {
        fr: 'Se connecter',
        nl: 'Inloggen',
        en: 'Sign in',
    },

    logout: {
        fr: 'Se déconnecter',
        nl: 'Uitloggen',
        en: 'Logout',
    },

    location: {
        fr: 'Localisation',
        nl: 'Plaatsbepaling',
        en: 'Location',
    },

    locationHelp: {
        fr: 'Les coordonnées doivent être encodées dans le système Lambert Belge 72 (EPSG:31370)',
        nl: 'Coördinaten moeten worden geëncodeerd in het Belgische Lambert systeem 72 (EPSG: 31370)',
        en: 'Coordinates must be encoded in Belgian Lambert 72 system (EPSG:31370)',
    },

    mapLegend: {
        fr: 'Légende',
        nl: 'Legende',
        en: 'Legend',
    },

    mapTools: {
        fr: 'Outils',
        nl: 'Tools',
        en: 'Tools',
    },

    mapDatas: {
        fr: 'Couches',
        nl: 'Lagen',
        en: 'Layers',
    },

    mapRefList: {
        fr: 'Cartes',
        nl: 'Kaarten',
        en: 'Maps',
    },

    rowNumberColTitle: {
        fr: '#',
        nl: '#',
        en: '#',
    },

    save: {
        fr: 'Sauvegarder',
        nl: 'Opslaan',
        en: 'Save',
    },

    search: {
        fr: 'Recherche',
        nl: 'Zoeken',
        en: 'Search',
    },

    searchAtlas: {
        fr: 'Chercher dans l\'atlas',
        nl: 'Zoek in de atlas',
        en: 'Search in atlas',
    },

    start: {
        fr: 'Démarrer',
        nl: 'Beginnen',
        en: 'Start',
    },

    stop: {
        fr: 'Arrêter',
        nl: 'Stoppen',
        en: 'Stop',
    },

    timeserieFeatureProperty: {
        fr: 'Attribute',
        nl: 'Attribuut',
        en: 'Attributes',
    },

    timeserieFeaturePropertyNone: {
        fr: 'N\'utilise pas d\'attribut',
        nl: 'Gebruik geen attribuut',
        en: 'Doesn\'t use attribute',
    },

    timeserieURL: {
        fr: 'url',
        nl: 'url',
        en: 'url',
    },

    timeserieConfigError: {
        fr: 'No or malformed configuration for this timeserie',
        nl: 'Fout in het laden van de voorkeuren voor deze grafiek',
        en: 'No or malformed configuration for this timeserie',
    },

    latitude: {
        fr: 'Latitude (Y)',
        nl: 'Breedtegraad (Y)',
        en: 'Latitude (Y)',
    },

    legendBuilder: {
        fr: 'Éditeur de légende',
        nl: 'Legende bewerken',
        en: 'Legend editor',
    },

    legendType: {
        fr: 'Type de légende',
        nl: 'Type legende',
        en: 'Legend type',
    },

    legendTypeSimple: {
        fr: 'Simple',
        nl: 'Enkel symbool',
        en: 'Simple',
    },

    legendTypeDiscrete: {
        fr: 'Catégorisée',
        nl: 'Categorieën',
        en: 'Categorised',
    },

    legendTypeContinuous: {
        fr: 'Continue',
        nl: 'Intervallen',
        en: 'Continuous',
    },

    legendTypeSelect: {
        fr: 'Type de légende',
        nl: 'Type legende',
        en: 'Legend type',
    },

    longitude: {
        fr: 'Longitude (X)',
        nl: 'Lengtegraad (X)',
        en: 'Longitude (X)',
    },

    measure: {
        fr: 'Mesurer',
        nl: 'Meten',
        en: 'Measure',
    },

    measureLength: {
        fr: 'Longueur',
        nl: 'Lengte',
        en: 'Length',
    },

    measureArea: {
        fr: 'Superficie',
        nl: 'Oppervlakte',
        en: 'Area',
    },

    mapEmbed: {
        fr: 'Inclure la carte',
        nl: 'Voeg deze kaart in',
        en: 'Embed map',
    },

    mapEmbedWithView: {
        fr: 'Inclure la vue actuelle de la carte',
        nl: 'Voeg de huidige weergave van de kaart in',
        en: 'Embed current view',
    },

    mapInfoAddIllustration: {
        fr: 'Sélectionnez une image',
        nl: 'Selecteer een afbeelding',
        en: 'Select an image',
    },

    mapInfoChangeIllustration: {
        fr: 'Sélectionnez une autre image',
        nl: 'Selecteer een andere afbeelding',
        en: 'Select another image',
    },

    mapLink: {
        fr: 'Partager un lien vers la carte',
        nl: 'Deel een link naar deze kaart',
        en: 'Share a link to the map',
    },

    mapLinkWithView: {
        fr: 'Partager un lien vers la vue actuelle de la carte',
        nl: 'Deel een link naar de huidige kaartweergave',
        en: 'Share a link to the current view of the map',
    },

    remove: {
        fr: 'Supprimer',
        nl: 'Verwijder',
        en: 'Remove',
    },

    removeMap: {
        fr: 'Supprimer cette carte',
        nl: 'Verwijder deze kaart',
        en: 'Delete this map',
    },

    share: {
        fr: 'Partager',
        nl: 'Delen',
        en: 'Share',
    },

    shareWithView: {
        fr: 'Partager avec le niveau de zoom et le centrage actuel.',
        nl: 'Delen met het huidige zoomniveau en middelpunt.',
        en: 'Share with zoom level and actual center',
    },

    switchLang: {
        fr: 'NL',
        nl: 'FR',
        en: 'the interface is not trilingiual yet :)',
    },

    styleGroupAdd: {
        fr: 'Ajouter une catégorie',
        nl: 'Categorie toevoegen',
        en: 'Add a category',
    },

    styleGroupDefaultName: {
        fr: 'Catégorie sans titre',
        nl: 'Categorie zonder titel',
        en: 'Category without title',
    },

    styleGroupSelectedItemsCount: {
        fr: 'Éléments séléctionné',
        nl: 'Geselecteerde rijen',
        en: 'Selected item',
    },

    styleGroupRemove: {
        fr: 'Supprimer la catégorie',
        nl: 'Categorie verwijderen',
        en: 'Delete category',
    },

    validate: {
        fr: 'Valider',
        nl: 'Bevestigen',
        en: 'Validate',
    },

    visible: {
        fr: 'Visibilité',
        nl: 'Zichtbaarheid',
        en: 'Visibility',
    },

    webServiceUrl: {
        fr: 'URL d\'un webservice',
        nl: 'URL voor een webservice',
        en: 'Web service URL',
    },

    wmsSwitch: {
        fr: 'Fond de carte',
        nl: 'Achtergrond',
        en: 'Background map',
    },

    loadingData: {
        fr: 'Chargement des données',
        nl: 'Data wordt geladen',
        en: 'Loading datas',
    },

    valuesCovered: {
        fr: 'match',
        nl: 'match',
        en: 'match',
    },

    highValue: {
        fr: 'Valeur haute (exclue)',
        nl: 'Bovengrens (uitgesloten)',
        en: 'High value (excluded)',
    },

    lowValue: {
        fr: 'Valeur basse (incluse)',
        nl: 'Ondergrens (ingesloten)',
        en: 'Low value (included)',
    },

    map: {
        fr: '{n, plural, =0 {Carte} =1 {Carte} other {Cartes}}',
        nl: '{n, plural, =0 {Kaart} =1 {Kaart} other {Kaarten}}',
        en: '{n, plural, =0 {Map} =1 {Map} other {Maps}}',
        parameters: { n: 1 },
    },

    layer: {
        fr: '{n, plural, =0 {Couche} =1 {Couche} other {Couches}}',
        nl: '{n, plural, =0 {Laag} =1 {Laag} other {Lagen}}',
        en: '{n, plural, =0 {Layer} =1 {Layer} other {Layers}}',
        parameters: { n: 1 },
    },

    lineWidth: {
        fr: 'Épaisseur du filet (px)',
        nl: 'Lijnbreedte (px)',
        en: 'Stroke width (px)',
    },

    lineColor: {
        fr: 'Couleur du filet',
        nl: 'Lijnkleur',
        en: 'Stroke color',
    },

    fillColor: {
        fr: 'Couleur de remplissage',
        nl: 'Vulkleur',
        en: 'Fill color',
    },

    pointColor: {
        fr: 'Couleur du pictogramme',
        nl: 'Kleur van het pictogram',
        en: 'Pictogram color',
    },

    confirm: {
        fr: 'Confirmer',
        nl: 'Bevestigen',
        en: 'Confirm',
    },

    confirmDelete: {
        fr: 'Confirmer la suppression ?',
        nl: 'Bevestig de verwijdering ?',
        en: 'Confirm delete ?',
    },

    propName: {
        fr: 'Nom d\'attribut',
        nl: 'Naam van het attribuut',
        en: 'Attribute name',
    },

    propNameForLabel: {
        fr: 'Colonne à utiliser pour le label',
        nl: 'Kolom om het label op te baseren',
        en: 'Column to be used as a label',
    },

    fontColor: {
        fr: 'Couleur du texte',
        nl: 'Letterkleur van label',
        en: 'Text color',
    },

    fontSize: {
        fr: 'Corps du texte (px)',
        nl: 'Lettergrootte van label (px)',
        en: 'Text size (px)',
    },

    switchLabel: {
        fr: 'Label',
        nl: 'Label',
        en: 'Label',
    },

    switchMarker: {
        fr: 'Icône',
        nl: 'Icoon',
        en: 'Icon',
    },

    legendInfoHeader: {
        fr: 'Informations et réglages',
        nl: 'Informatie en instellingen',
        en: 'Informations and settings',
    },

    style: {
        fr: 'Réglage des styles',
        nl: 'Instellen van stijlen',
        en: 'Styles settings',
    },

    legendItems: {
        fr: 'Classification',
        nl: 'Classificatie',
        en: 'Classification',
    },

    resetLegend: {
        fr: 'Réinitialiser la légende',
        nl: 'Reset legende',
        en: 'Reset legend',
    },

    newLayer: {
        fr: 'Nouvelle couche',
        nl: 'Nieuwe laag',
        en: 'New layer',
    },

    newMap: {
        fr: 'Nouvelle carte',
        nl: 'Nieuwe kaart',
        en: 'New map',
    },

    selectLayer: {
        fr: 'Sélection de couche',
        nl: 'Kies een laag',
        en: 'Layer selection',
    },

    responsibleAndContact: {
        fr: 'Organisation responsable',
        nl: 'Verantwoordelijke organisatie',
        en: 'Responsible organisation',
    },

    responsiblePerson: {
        fr: 'Personne responsable',
        nl: 'Verantwoordelijke persoon',
        en: 'Responsible individual',
    },

    size: {
        fr: 'Taille (px)',
        nl: 'Grootte (px)',
        en: 'Size (px)',
    },

    codePoint: {
        fr: 'Code de caractère',
        nl: 'Tekencode',
        en: 'Character code',
    },

    legendItemAdd: {
        fr: 'Ajouter un élément de légende',
        nl: 'Legende item toevoegen',
        en: 'Add a legend item',
    },

    labelPostion: {
        fr: 'Position du label',
        nl: 'Plaats van het label',
        en: 'Label position',
    },

    columnPicker: {
        fr: 'Sélecteur de colonne',
        nl: 'Kolomkiezer',
        en: 'Column selector',
    },

    columnPickerMessage: {
        fr: 'Sélectionnez une colonne pour construire la légende.',
        nl: 'Selecteer een kolom om de legende te maken.',
        en: 'Select a column to build a legend',
    },

    templateEditorExplanation: {
        fr: 'Template. The template will be updated on blur. Variable: <%= attribute_name %>. Or between <% %> plain javascript.',
        nl: 'Template. The template will be updated on blur. Variable: <%= attribute_name %>. Or between <% %> plain javascript.',
        en: 'Template. The template will be updated on blur. Variable: <%= attribute_name %>. Or between <% %> plain javascript.',
    },

    dashboard: {
        fr: 'Tableau de bord',
        nl: 'Dashboard',
        en: 'Dashboard',
    },

    addToLegend: {
        fr: 'Ajouter à la légende',
        nl: 'Toevoegen aan legende',
        en: 'Add to legend',
    },

    infoChoice: {
        fr: 'Choix des informations',
        nl: 'Keuze van de informatie',
        en: 'Chose informations',
    },

    infoReorder: {
        fr: 'Organisation des informations',
        nl: 'Ordening van de informatie',
        en: 'Ordering informations',
    },

    addTerm: {
        fr: 'Ajouter un terme',
        nl: 'Een woord toevoegen',
        en: 'Add term',
    },

    noResults: {
        fr: 'Pas de résultat',
        nl: 'Geen resultaten',
        en: 'No results',
    },

    pointLabelHelp: {
        fr: 'Réglages des labels pour l\'ensemble de la couche',
        nl: 'Instellingen van alle labels in de laag',
        en: 'Label settings for the whole layer',
    },

    timeserieTemplateURL: {
        fr: 'Un gabarit d\'URL pointant vers une ressource produisant une série temporelle de la forme "http://exemple.com/ts/\\{columnName\\}.json".',
        nl: 'Een template voor de URL die verwijst naar de gegevensbron voor het maken van een tijdreeks. Gebruik de volgende vorm: "http://voorbeeld.com/ts/\\{kolomNaam\\}.json".',
        en: 'URL template pointing to a timeserie ressource "http://exemple.com/ts/\\{columnName\\}.json".',
    },

    timeserieReference: {
        fr: 'Valeur de référence',
        nl: 'Referentiewaarde',
        en: 'Reference value',
    },

    viewLayer: {
        fr: 'Visualiser la couche',
        nl: 'Toon de laag',
        en: 'View layer',
    },

    columns: {
        fr: 'Colonnes',
        nl: 'Kolommen',
        en: 'Column',
    },

    widgets: {
        fr: 'Widgets',
        nl: 'Widgets',
        en: 'Widgets',
    },

    piechartScale: {
        fr: 'Échelle',
        nl: 'Schaal',
        en: 'Scale',
    },

    piechartRadius: {
        fr: 'Rayon',
        nl: 'Straal',
        en: 'Radius',
    },

    label: {
        fr: 'Label',
        nl: 'Label',
        en: 'Label',
    },

    autoClass: {
        fr: 'Création automatique de classes',
        nl: 'Automatische selectie van klassen',
        en: 'Autoamtic classes generation',
    },

    offsetX: {
        fr: 'Offset X',
        nl: 'Offset X',
        en: 'Offset X',
    },

    offsetY: {
        fr: 'Offset Y',
        nl: 'Offset Y',
        en: 'Offset Y',
    },

    skipFirstLine: {
        fr: 'Ne pas prendre en compte la première ligne',
        nl: 'Houden geen rekening met de eerste lijn',
        en: 'Do not take the first line',
    },

    separatedBy: {
        fr: 'Séparateur',
        nl: 'Separator',
        en: 'Separator',
    },

    textDelimiter: {
        fr: 'Délimiteur de texte',
        nl: 'Scheidingsteken van tekst',
        en: 'Text delimiter',
    },

    comma: {
        fr: 'Virgule',
        nl: 'Komma',
        en: 'Comma',
    },

    semicolon: {
        fr: 'Point virgule',
        nl: 'Puntkomma',
        en: 'Semicolon',
    },

    tab: {
        fr: 'Tabulation',
        nl: 'Tab',
        en: 'Tab',
    },

    space: {
        fr: 'Espace',
        nl: 'Spatie',
        en: 'Space',
    },

    quotationMark: {
        fr: 'Guillemet',
        nl: 'Aanhalingsteken',
        en: 'Quotation mark',
    },

    apostrophe: {
        fr: 'Apostrophe',
        nl: 'Apostrof',
        en: 'Apostrophe',
    },

    columnNumber: {
        fr: 'N° de colonne',
        nl: 'Kolomnummer',
        en: 'Column number',
    },

    setLatitude: {
        fr: 'Latitude (Y)',
        nl: 'Breedtegraad (Y)',
        en: 'Latitude (Y)',
    },

    setLongitude: {
        fr: 'Longitude (X)',
        nl: 'Lengtegraad (X)',
        en: 'Longitude (X)',
    },

    uploadShpInfos: {
        fr: 'Veuillez séléctionner les quatre fichiers requis composant le shapefile.',
        nl: 'Selecteer de vier nodige bestanddelen van de shapefile.',
        en: 'Please select the four requiered files composing the shapefile.',
    },

    upload: {
        fr: 'Upload',
        nl: 'Uploaden',
        en: 'Uppload',
    },

    uploadDatas: {
        fr: 'Upload de données',
        nl: 'Upload van de gegevens',
        en: 'Datas upload',
    },

    metadataEditor: {
        fr: 'Édition des métadonnées',
        nl: 'Metadata bewerken',
        en: 'Metadatas editor',
    },

    sheetList: {
        fr: 'Liste des fiches',
        nl: 'Lijst van de fiches',
        en: 'Sheet list',
    },

    metaCommon: {
        fr: 'Métadonnées bilingues',
        nl: 'Tweetalige metadata',
        en: 'Métadonées bilingues',
    },

    metaFrench: {
        fr: 'Métadonnées françaises',
        nl: 'Franse metadata',
        en: 'French metadata',
    },

    metaDutch: {
        fr: 'Métadonnées Néerlandaises',
        nl: 'Nederlandse metadata',
        en: 'Dutch metadata',
    },

    title: {
        fr: 'Titre',
        nl: 'Titel',
        en: 'Title',
    },

    geometryType: {
        fr: 'Geométrie',
        nl: 'Geometrie',
        en: 'Geometry',
    },

    layerId: {
        fr: 'Identifiant de la ressource',
        nl: 'Bronidentificatie',
        en: 'Resource ID',
    },

    layerInfo: {
        fr: 'Informations',
        nl: 'Informatie',
        en: 'Informations',
    },

    temporalReference: {
        fr: 'Référence temporelle',
        nl: 'Tijdelijke referentie',
        en: 'Temporal reference',
    },

    pointOfContact: {
        fr: 'Point de contact',
        nl: 'Contactpunt',
        en: 'Point of contact',
    },

    responsibleOrganisation: {
        fr: 'Organisation responsable',
        nl: 'Verantwoordelijke organisatie',
        en: 'Responsible organisation',
    },

    draft: {
        fr: 'Brouillon',
        nl: 'Ontwerp',
        en: 'Draft',
    },

    published: {
        fr: 'Publié',
        nl: 'Gepubliceerd',
        en: 'Published',
    },

    publish: {
        fr: 'Publier',
        nl: 'Publiceren',
        en: 'Publish',
    },

    publicationStatus: {
        fr: 'État de publication',
        nl: 'Status van publicatie',
        en: 'Publication state',
    },

    saving: {
        fr: 'Mise à jour des données',
        nl: 'Gegevens bijwerken',
        en: 'Updating datas',
    },

    identifier: {
        fr: 'Identifiant',
        nl: 'Identifier',
        en: 'Identifier',
    },

    keywords: {
        fr: 'Mots clés',
        nl: 'Trefwoorden',
        en: 'Keyword',
    },

    topics: {
        fr: 'Thème',
        nl: 'Thema',
        en: 'Topic',
    },

    unpublish: {
        fr: 'Dépublier',
        nl: 'Unpublish',
        en: 'Unpublish',
    },

    myMaps: {
        fr: 'Mes cartes',
        nl: 'Mijn kaarten',
        en: 'My maps',
    },

    atlas: {
        fr: 'Atlas',
        nl: 'Atlas',
        en: 'Atlas',
    },

    atlasEnv: {
        fr: 'Atlas de l\'environnement',
        nl: 'Milieu-Atlas',
        en: 'Environnement atlas',
    },

    userName: {
        fr: 'Nom d\'utilisateur',
        nl: 'Gebruikersnaam',
        en: 'User name',
    },

    password: {
        fr: 'Mot de passe',
        nl: 'Wachtwoord',
        en: 'Password',
    },

    connectionSDI: {
        fr: 'Connection',
        nl: 'Verbinding',
        en: 'Connection',
    },

    alias: {
        fr: 'Alias',
        nl: 'Alias',
        en: 'Alias',
    },

    mapList: {
        fr: 'Liste des cartes',
        nl: 'kaartlijst',
        en: 'Maps list',
    },

    studio: {
        fr: 'Studio',
        nl: 'Studio',
        en: 'Studio',
    },

    metadata: {
        fr: 'Métadonnées',
        nl: 'Metadata',
        en: 'Metadatas',
    },

    myApps: {
        fr: 'Outils et applications',
        nl: 'Tools en apps',
        en: 'Tools and applications',
    },

    thesaurus: {
        fr: 'Thesaurus',
        nl: 'Thesaurus',
        en: 'Thesaurus',
    },

    term: {
        fr: 'Terme',
        nl: 'Term',
        en: 'Term',
    },

    replaceFR: {
        fr: 'Alias FR',
        nl: 'Alias FR',
        en: 'Alias FR',
    },

    replaceNL: {
        fr: 'Alias NL',
        nl: 'Alias NL',
        en: 'Alias NL',
    },

    aliasDictonary: {
        fr: 'Dictionnaire des alias',
        nl: 'Woordenboek van aliassen',
        en: 'Alias dictionary',
    },

    createAlias: {
        fr: 'Créer un nouvel alias',
        nl: 'Maak een nieuw alias aan',
        en: 'Create a new alias',
    },

    columnID: {
        fr: 'Identifiant de colonne',
        nl: 'Kolom naam',
        en: 'Column ID',
    },

    extractFeatures: {
        fr: 'Forage',
        nl: 'Boren',
        en: 'Extract',
    },

    links: {
        fr: 'Liens',
        nl: 'Links',
        en: 'Links',
    },

    extractSearch: {
        fr: 'Recherche par forage',
        nl: 'Boren onderzoek',
        en: 'Extract search',
    },

    extractOn: {
        fr: 'Intersection avec la zone visible',
        nl: 'Intersectie met het weergegeven gebied',
        en: 'Intersection with visible zone',
    },

    extractOff: {
        fr: 'Tous les éléments',
        nl: 'Alle elementen',
        en: 'All items',
    },

    changeBackgroundMap: {
        fr: 'Changer de fond de carte',
        nl: 'Wijzig de achtergrond',
        en: 'Change background map',
    },

    zoomIn: {
        fr: 'Zoomer',
        nl: 'Zoomen',
        en: 'Zoom in',
    },

    zoomOut: {
        fr: 'Dézoomer',
        nl: 'Uitzoomen',
        en: 'Zoom out',
    },

    north: {
        fr: 'Nord',
        nl: 'Noord',
        en: 'North',
    },

    fullscreen: {
        fr: 'Plein écran',
        nl: 'Volledig scherm',
        en: 'Full screen',
    },

    translate: {
        fr: 'Traduire',
        nl: 'Vertalen',
        en: 'Translate',
    },

    switch: {
        fr: 'Changer',
        nl: 'Omschakelen',
        en: 'Switch',
    },

    edit: {
        fr: 'Éditer',
        nl: 'Bewerk',
        en: 'Edit',
    },

    'toggle-off': {
        fr: 'Désactiver',
        nl: 'Deactiveren',
        en: 'Toggle off',
    },

    'toggle-on': {
        fr: 'Activer',
        nl: 'Activeren',
        en: 'Toggle on',
    },

    'move-down': {
        fr: 'Redescendre',
        nl: 'Naar beneden verplaatsen',
        en: 'Move down',
    },

    'move-up': {
        fr: 'Remonter',
        nl: 'Naar boven verplaatsen',
        en: 'Move up',
    },

    view: {
        fr: 'Visiblité',
        nl: 'Zichtbaarheid',
        en: 'Visibility',
    },

    settings: {
        fr: 'Réglages',
        nl: 'Instellingen',
        en: 'Settings',
    },

    filter: {
        fr: 'Filtrer',
        nl: 'Filter',
        en: 'Filter',
    },

    startDate: {
        fr: 'Date de début',
        nl: 'Startdatum',
        en: 'Start date',
    },

    endDate: {
        fr: 'Date de fin',
        nl: 'Einddatum',
        en: 'End date',
    },

    minZoom: {
        fr: 'Zoom minimal',
        nl: 'Minimale zoom',
        en: 'Zoom min',
    },

    maxZoom: {
        fr: 'Zoom maximal',
        nl: 'Maximale zoom',
        en: 'Zoom max',
    },

    zoomOnFeature: {
        fr: 'Zoomer sur l\'entité',
        nl: 'Zoom in op de entiteit',
        en: 'Zoom to item',
    },

    layerInfoSettings: {
        fr: 'Éditer la fiche individuelle',
        nl: 'Bewerk de individuele fiche',
        en: 'Edit feature view',
    },

    layerInfoSwitchMap: {
        fr: 'Carte',
        nl: 'Kaart',
        en: 'Map',
    },

    layerInfoSwitchTable: {
        fr: 'Table attributaire',
        nl: 'Attributentabel',
        en: 'Attribute table',
    },

    usePattern: {
        fr: 'Hachures',
        nl: 'Arcering',
        en: 'Hatches',
    },

    layerLegendDefaultLabel: {
        fr: 'Étiquette de légende',
        nl: 'Legendelabel',
        en: 'Legend label',
    },

    featureText: {
        fr: 'Texte',
        nl: 'Tekst',
        en: 'Text',
    },

    printMap: {
        fr: 'Imprimer la carte',
        nl: 'Print de kaart',
        en: 'Print map',
    },

    printDownloadingBaseMap: {
        fr: 'Téléchargement du fond de carte',
        nl: 'De achtergrond downloaden',
        en: 'Downloading background map',
    },

    printNotStarted: {
        fr: 'Rendu des couches vectorielles',
        nl: 'Weergave van vectorlagen',
        en: 'Rendering datas',
    },

    printPreparingPDF: {
        fr: 'Génération du PDF',
        nl: 'PDF generatie',
        en: 'PDF generation',
    },

    originalTitle: {
        fr: 'Titre original',
        nl: 'Originele titel',
        en: 'Original title',
    },

    cursorLocalisation: {
        fr: 'Localisation du curseur',
        nl: 'Cursorlocatie',
        en: 'Cursor location',
    },

    preview: {
        fr: 'Aperçu',
        nl: 'Voorvertoning',
        en: 'Preview',
    },


    relatedMapsLabel: {
        fr: 'Cartes Liées',
        nl: 'Gerelateerde kaarten',
        en: 'Related maps',
    },

    downloadCSV: {
        fr: 'Télécharger le fichier CSV',
        nl: 'Download CSV-bestand',
        en: 'Download as CSV file',
    },

    wmsLegendDisplay: {
        fr: 'Montrer la légende du fond de carte',
        nl: 'Toon achtergrondkaartlegenda',
        en: 'Show background legend',
    },

    wmsLegendHide: {
        fr: 'Masquer la légende du fond de carte',
        nl: 'Verberg achtergrondlegenda',
        en: 'Hide background legend',
    },

    inspireCompliant: {
        fr: 'Interne & Catalogue',
        nl: 'Interne & Catalogus',
        en: 'Internal & Catalog',
    },

    internal: {
        fr: 'Interne',
        nl: 'Interne',
        en: 'Internal',
    },

    startGPS: {
        fr: 'Démarrer la localisation GPS',
        nl: 'Start de GPS-locatie',
        en: 'Start GPS location',
    },

    solar: {
        fr: 'Solar',
        nl: 'Solar',
        en: 'Solar',
    },

    analyse: {
        fr: 'Analyser',
        nl: 'Examineren',
        en: 'Analyse',
    },

    backToMap: {
        fr: 'Retour à la carte',
        nl: 'Terug naar de kaart',
        en: 'Back to map',
    },

    roofTotalArea: {
        fr: 'Surface totale de toiture',
        nl: 'Totale dakoppervlakte ',
        en: 'Total rooftop area',
    },

    solarPV: {
        fr: 'Solaire photovoltaïque',
        nl: 'Fotovoltaïsche zonne-energie ',
        en: 'Solar photovoltaic',
    },

    solarThermal: {
        fr: 'Solaire thermique',
        nl: 'Zonthermische',
        en: 'Solar thermal',
    },

    in: {
        fr: 'à',
        nl: 'in',
        en: 'in',
    },

    thisBuildingGotA: {
        fr: 'Ce bâtiment a un :',
        nl: 'Dit gebouw heeft een :',
        en: 'This building got a :',
    },

    buyingPrice: {
        fr: 'Prix d\'achat',
        nl: 'Aankoopprijs',
        en: 'buying price',
    },

    gainGreenCertif: {
        fr: 'Gain Certificats Verts',
        nl: 'Groenestroomcertificaten behalen',
        en: 'Gain Green Certificates',
    },

    gainElecInvoice: {
        fr: 'Gain facture d\'électricité',
        nl: 'Besparing op elektriciteitsrekeningen',
        en: 'Electricity bill savings',
    },

    gainEnvironment: {
        fr: 'Gain environnemental',
        nl: 'Milieubaten',
        en: 'Environmental gain',
    },

    orientationGreat: {
        fr: 'Excellente orientation',
        nl: 'Uitstekende oriëntatie',
        en: 'Excellente orientation',
    },

    orientationGood: {
        fr: 'Bonne orientation',
        nl: 'Goede oriëntatie',
        en: 'Good orientation',
    },

    unusable: {
        fr: 'Non utilisable',
        nl: 'Niet bruikbaar',
        en: 'Not usable',
    },

    personalize: {
        fr: 'Personnaliser',
        nl: 'Personaliseren',
        en: 'personaliseren',
    },

    contactInstallator: {
        fr: 'Contacter un installateur',
        nl: 'Neem contact op met een installateur',
        en: 'Contact an installer',
    },

    changeMyHabits: {
        fr: 'Profiter au maximum de mon installation',
        nl: 'Profiteer optimaal van mijn installatie',
        en: 'Make the most of my installation',
    },

    installationObstacle: {
        fr: 'Obstacles à l\'installation',
        nl: 'Hindernissen voor de installatie',
        en: 'Obstacles to installation',
    },

    consumption: {
        fr: 'Consommation',
        nl: 'Consumerend',
        en: 'Consumption',
    },

    autoproduction: {
        fr: 'Autoproduction',
        nl: 'Zelfgeneratie',
        en: 'Self-generation',
    },

    finance: {
        fr: 'Finance',
        nl: 'Geldwezen',
        en: 'Finance',
    },

    loan: {
        fr: 'Loan',
        nl: 'Leenwoord',
        en: 'Loan',
    },

    installation: {
        fr: 'Installation',
        nl: 'Inbouw',
        en: 'Installation',
    },

    surface: {
        fr: 'Superficie',
        nl: 'Plaats',
        en: 'Area',
    },

    power: {
        fr: 'Puissance',
        nl: 'Mogendheid',
        en: 'Power',
    },

    obstacleEstimation: {
        fr: 'Pourcentage estimé d\'obstacles',
        nl: 'Geschat percentage belemmeringen',
        en: 'Estimated percentage of obstacles',
    },

    energy: {
        fr: 'Énergie',
        nl: 'Energie',
        en: 'Energy',
    },

    yearProduction: {
        fr: 'Production annuelle',
        nl: 'Jaarlijkse productie',
        en: 'Annual production',
    },

    yearConsumption: {
        fr: 'Consommation annuelle',
        nl: 'Jaarlijks verbruik',
        en: 'Annual consumption',
    },

    solarAutonomy: {
        fr: 'Autonomie solaire',
        nl: 'Zonne autonomie',
        en: 'Solar autonomy',
    },

    gainTotal25Y: {
        fr: 'Gains totaux sur 25 ans',
        nl: 'Totale winst over 25 jaar',
        en: 'Total earnings over 25 years',
    },

    returnTime: {
        fr: 'Temps de retour',
        nl: 'Terugverdientijd',
        en: 'Return time',
    },

    reduceConsumption: {
        fr: 'Je diminue ma consommation',
        nl: 'Ik verminder mijn verbruik',
        en: 'I reduce my consumption',
    },

    dayConsumption: {
        fr: 'Je consomme en journée',
        nl: 'Ik gebruik overdag',
        en: 'I use during the day',
    },

    hotWaterDuringDay: {
        fr: 'Eau chaude préparée en journée',
        nl: 'Warm water overdag bereid',
        en: 'Hot water prepared during the day',
    },

    boiler: {
        fr: 'Boiler',
        nl: 'Ketel',
        en: 'Boiler',
    },

    heatPump: {
        fr: 'Pompe à chaleur',
        nl: 'warmtepomp',
        en: 'Heat pump',
    },

    installBatteries: {
        fr: 'J\'installe des batteries',
        nl: 'Ik ben batterijen aan het plaatsen',
        en: 'I install bateries',
    },

    technoType: {
        fr: 'Type de technologie',
        nl: 'Type technologie',
        en: 'Technologie type',
    },

    monocristal: {
        fr: 'Monocristalin',
        nl: 'Monokristallijn',
        en: 'Monocrystalin',
    },

    polycristal: {
        fr: 'Polycristalin',
        nl: 'Polykristallijn',
        en: 'Polycrystalin',
    },

    monocristalHR: {
        fr: 'Monocristalin haut rendement',
        nl: 'Hoog rendement van monokristaline',
        en: 'High efficiency monocrystalin',
    },

    panelIntegration: {
        fr: 'Intégration des panneaux à la toiture',
        nl: 'Integratie van de panelen in het dak',
        en: 'Integration of the panels into the roof',
    },

    annualConsumptionKWh: {
        fr: 'Consomation annuelle (kWh)',
        nl: 'Jaarlijks verbruik (kWh)',
        en: 'Annual consumption (kWh)',
    },

    annualMaintenance: {
        fr: 'Frais d\'entretiens et de monitoring annuel',
        nl: 'Jaarlijkse onderhouds en monitoringkosten',
        en: 'Annual maintenance and monitoring costs',
    },

    sellingPrice: {
        fr: 'Prix de vente de l\'électricité injectée dans le réseau',
        nl: 'Verkoopprijs van aan het net geleverde elektriciteit',
        en: 'Selling price of electricity fed into the grid',
    },

    installationPrice: {
        fr: 'Prix de l\'installation',
        nl: 'Installatie prijs',
        en: 'Installation price',
    },

    VAT: {
        fr: 'TVA',
        nl: 'BTW',
        en: 'VAT',
    },

    VAT21: {
        fr: '21%',
        nl: '21%',
        en: '21%',
    },

    VAT6: {
        fr: '6%',
        nl: '6%',
        en: '6%',
    },

    VAT0: {
        fr: '0%',
        nl: '0%',
        en: '0%',
    },

    sellingGreenCertifPrice: {
        fr: 'Prix de revente des Certificats Verts',
        nl: 'Doorverkoopprijs van Groenestroomcertificaten',
        en: 'Resale price of Green Certificates',
    },

    monthlyPayment: {
        fr: 'Mensualité',
        nl: 'maandelijkse betalingen',
        en: 'Monthly payment',
    },

    durationYear: {
        fr: 'Durée en années',
        nl: 'Looptijd in jaren',
        en: 'Duration in year',
    },

    amountBorrowed: {
        fr: 'Montant emprunté',
        nl: 'Geleend bedrag',
        en: 'Amount borrowed',
    },

    estim10Y: {
        fr: 'Estimation sur 10 ans',
        nl: '10-jarige schatting',
        en: '10-year estimate',
    },

    velux: {
        fr: 'Fenêtre de toit (Velux)',
        nl: 'Dakraam (Velux)',
        en: 'Roof window (Velux)',
    },

    dormerWindow: {
        fr: 'Chien-assis',
        nl: 'Dakkapel',
        en: 'Dormer window',
    },

    flatRoofWindow: {
        fr: 'Fenêtre de toit plat',
        nl: 'Plat dakraam',
        en: 'Flat roof window',
    },

    existingSolarPannel: {
        fr: 'Panneaux solaires existants',
        nl: 'Bestaande zonnepanelen',
        en: 'Existing solar pannels',
    },

    chimneyAir: {
        fr: 'Cheminée de ventilation',
        nl: 'Ventilatieschoorsteen',
        en: 'Ventilation chimney',
    },

    chimneySmoke: {
        fr: 'Cheminée de combustion',
        nl: 'Verbrandingsschoorsteen',
        en: 'Combustion chimney',
    },

    terraceInUse: {
        fr: 'Terrasse en cours d\'utilisation',
        nl: 'Terras in gebruik',
        en: 'Terrace in use',
    },

    lift: {
        fr: 'Ascenseur',
        nl: 'Lift',
        en: 'Lift',
    },

    usableArea: {
        fr: 'Surface utile',
        nl: 'bruikbare ruimte',
        en: 'Usable area',
    },

    sheet: {
        fr: 'Fiche',
        nl: 'Blad',
        en: 'Sheet',
    },

};
