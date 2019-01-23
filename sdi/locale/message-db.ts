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
    | '__empty__'
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
    | 'backToMap'
    | 'boiler'
    | 'bonus'
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
    | 'comma'
    | 'confirm'
    | 'confirmDelete'
    | 'connect'
    | 'connectionSDI'
    | 'consumption'
    | 'contactInstallator'
    | 'consumptionYElectricity'
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
    | 'electricity'
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
    | 'gainElecInvoice'
    | 'gainElecInvoice25Y'
    | 'gainEnergyInvoice'
    | 'gainEnergyInvoice10Y'
    | 'gainEnergyInvoice25Y'
    | 'gainEnvironment'
    | 'gainEnvironment25Y'
    | 'gainGreenCertif'
    | 'gainGreenCertif25Y'
    | 'gainTotal'
    | 'gainTotal25Y'
    | 'gainInvoice25Y'
    | 'geocode'
    | 'geometryType'
    | 'go'
    | 'gpsTracker'
    | 'heat'
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
    | 'loanDuration'
    | 'loanNo'
    | 'loanRate'
    | 'loanYes'
    | 'location'
    | 'locationHelp'
    | 'login'
    | 'logout'
    | 'longitude'
    | 'lowValue'
    | 'map'
    | 'mapData'
    | 'mapDataHelp'
    | 'mapEmbed'
    | 'mapEmbedWithView'
    | 'mapInfoAddIllustration'
    | 'mapInfoChangeIllustration'
    | 'mapLegend'
    | 'mapLink'
    | 'mapLinkWithView'
    | 'mapList'
    | 'mapRefList'
    | 'mapTools'
    | 'maxZoom'
    | 'measure'
    | 'measureArea'
    | 'measureLength'
    | 'metaCommon'
    | 'metadata'
    | 'metadataEditor'
    | 'metadataEditor'
    | 'metaDutch'
    | 'metaFrench'
    | 'minZoom'
    | 'monocristal'
    | 'monocristalHR'
    | 'monthlyPayment'
    | 'moreInfos'
    | 'move-down'
    | 'move-up'
    | 'myApps'
    | 'myMaps'
    | 'newLayer'
    | 'newMap'
    | 'no'
    | 'noResults'
    | 'north'
    | 'obstacleEstimation'
    | 'offsetX'
    | 'offsetY'
    | 'orientationGood'
    | 'orientationGreat'
    | 'originalTitle'
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
    | 'printDownloadingBaseMap'
    | 'printFormatChoice'
    | 'printSmallFormat'
    | 'printBigFormat'
    | 'printMap'
    | 'printMapHelp'
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
    | 'resetValue'
    | 'responsibleAndContact'
    | 'responsibleOrganisation'
    | 'responsiblePerson'
    | 'returnTime'
    | 'roofTotalArea'
    | 'rowNumberColTitle'
    | 'save'
    | 'saving'
    | 'search'
    | 'searchAtlas'
    | 'searchResult'
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
    | 'skipFirstLine'
    | 'solActChangeStr1'
    | 'solActChangeStr2'
    | 'solActChangeStr3'
    | 'solActChangeStr4'
    | 'solActContactStr1'
    | 'solActContactStr2'
    | 'solActContactStr3'
    | 'solActContactStr4'
    | 'solActPrintStr1'
    | 'solActPrintStr2'
    | 'solActSettingStr1'
    | 'solActSettingStr2'
    | 'solActSettingStr3'
    | 'solActSettingStr4'
    | 'solAdjustStr1'
    | 'solAdjustStr2'
    | 'solAndNow'
    | 'solAutoproduction'
    | 'solarAppName'
    | 'solarAutonomy'
    | 'solarPV'
    | 'solarThermal'
    | 'solBackToMap'
    | 'solBuyGreenEnergyLabel'
    | 'solBuyGreenEnergyLink'
    | 'solCalculateStrPart1'
    | 'solCalculateStrPart2'
    | 'solCalculInfoStrPart1'
    | 'solCalculInfoStrPart2'
    | 'solChangeStr1'
    | 'solChangeStr2'
    | 'solContactLabel'
    | 'solContactLinkLabel'
    | 'solContactStr1'
    | 'solContactStr2'
    | 'solConsumed'
    | 'solConsumptionEstimated'
    | 'solCreatorsLabel'
    | 'solDailyConsumption'
    | 'solDedicatedArea'
    | 'solDisclaimerLink'
    | 'solDisclaimerLimit'
    | 'solElectricBoiler'
    | 'solFinanceCost'
    | 'solFacilitatorLabel'
    | 'solFacilitatorLink'
    | 'solFinanceGain'
    | 'solFinanceVAT'
    | 'solGaz'
    | 'solHeatProdSys'
    | 'solHeatPumpLabel'
    | 'solHeatPumpLink'
    | 'solHomeConsumption'
    | 'solHomegradeLink'
    | 'solHomegradeLabel'
    | 'solHotWaterConsumption'
    | 'solIncompleteAdress'
    | 'solInstallationLifeTime'
    | 'solInstallationSurface'
    | 'solInstallMoreMsgSTR1'
    | 'solInstallMoreMsgSTR2'
    | 'solInstallMoreMsgSTR3'
    | 'solLinkContactBE'
    | 'solLinkContactBELabel'
    | 'solLinkDisclaimer'
    | 'solLinkInfoGreenEnergy'
    | 'solLinkInstallateurPV'
    | 'solLinkInstallateurTH'
    | 'solLinkFAQ'
    | 'solLocatePitchStr1'
    | 'solLocatePitchStr2'
    | 'solLocatePitchStr3'
    | 'solLocatePitchStr4'
    | 'solLocatePitchStr5'
    | 'solLocatePitchStr6'
    | 'solLocatePitchStr7'
    | 'solLocatePitchStr8'
    | 'solLocatePitchStr9'
    | 'solMazout'
    | 'solNoCalcSTR1'
    | 'solNoCalcSTR2'
    | 'solNoSolSTR1'
    | 'solNoSolSTR2'
    | 'solNoSolSTR3'
    | 'solNoSolSTR4'
    | 'solNoSolSTR5'
    | 'solNoSolSTR6'
    | 'solNoSolSTR7'
    | 'solLegendConsRank1'
    | 'solLegendConsRank2'
    | 'solLegendConsRank3'
    | 'solLegendConsRank4'
    | 'solLegendConsRank5'
    | 'solLegendConsWaterRank1'
    | 'solLegendConsWaterRank2'
    | 'solLegendConsWaterRank3'
    | 'solLegendConsWaterRank4'
    | 'solLegendConsWaterRank5'
    | 'solLegendConsWaterRank6'
    | 'solMyRooftop'
    | 'solMyInstallation'
    | 'solMyEnergy'
    | 'solMyFinance'
    | 'solNumberOfPanels'
    | 'solOn10Years'
    | 'solOnMap'
    | 'solOptimumInstallation'
    | 'solOptimumInstallationTheoric'
    | 'solOrSelectBuilding'
    | 'solPanels'
    | 'solPanelsPV'
    | 'solPanelsTH'
    | 'solPellet'
    | 'solPhotovoltaic'
    | 'solPrintStr1'
    | 'solPrintStr2'
    | 'solPrintStr3'
    | 'solProduced'
    | 'solProductionPanels'
    | 'solResearch'
    | 'solSearchAnotherAdress'
    | 'solSelectedPannels'
    | 'solSharedRoof'
    | 'solSharedRoofLink'
    | 'solSolarConsumptionYear'
    | 'solSolarGeocode'
    | 'solSolarPanels'
    | 'solSolarPotential'
    | 'solSolarPotentialStr1'
    | 'solSolarPotentialStr2'
    | 'solSolarPotentialStr3'
    | 'solSolarPotentialStr3Thermal'
    | 'solSolarPotentialStr4'
    | 'solSolarPotentialExcellent'
    | 'solSolarPotentialGood'
    | 'solSolarProdYear'
    | 'solSolarRateArea'
    | 'solSolarWaterHeater'
    | 'solSummary10Y'
    | 'solTogglePV'
    | 'solToggleThermal'
    | 'solThermal'
    | 'solTotalPower'
    | 'solTotalSurface'
    | 'solUrbisLabel'
    | 'solUrbisLink'
    | 'solUsableRoofArea'
    | 'solVAT0'
    | 'solVAT21'
    | 'solVAT6'
    | 'solWaterStorage'
    | 'space'
    | 'start'
    | 'startDate'
    | 'startGPS'
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
    | 'technology'
    | 'technoType'
    | 'templateEditorExplanation'
    | 'temporalReference'
    | 'term'
    | 'terraceInUse'
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
    | 'tooltip:info'
    | 'tooltip:legend'
    | 'tooltip:data'
    | 'tooltip:base-map'
    | 'tooltip:print'
    | 'tooltip:ishare'
    | 'tooltip:measure'
    | 'tooltip:locate'
    | 'topics'
    | 'translate'
    | 'unitEuro'
    | 'unitEuroExclVAT'
    | 'unitEuroInclVAT'
    | 'unitEuroKWh'
    | 'unitEuroY'
    | 'unitEuroY10'
    | 'unitEuroY25'
    | 'unitKWc'
    | 'unitKWh'
    | 'unitKWhY'
    | 'unitLiter'
    | 'unitLiterDay'
    | 'unitM2'
    | 'unitPercent'
    | 'unitTonsCO2'
    | 'unitTCO2'
    | 'unitTCO2Y'
    | 'unitTCO2Y25'
    | 'unitTCO2Y10'
    | 'unitYear'
    | 'unpublish'
    | 'unusable'
    | 'upload'
    | 'uploadDatas'
    | 'uploadShpInfos'
    | 'usableArea'
    | 'usePattern'
    | 'userName'
    | 'validate'
    | 'valuesCovered'
    | 'VATinstallation'
    | 'VAT0'
    | 'VAT21'
    | 'VAT6'
    | 'velux'
    | 'view'
    | 'viewLayer'
    | 'visible'
    | 'webServiceUrl'
    | 'widgets'
    | 'wmsLegendDisplay'
    | 'wmsLegendHide'
    | 'wmsSwitch'
    | 'wmsSwitchHelpText'
    | 'yearConsumption'
    | 'yearProduction'
    | 'yes'
    | 'zoomIn'
    | 'zoomOnFeature'
    | 'zoomOut'
    ;




export type MessageDB = {
    [K in MessageKey]: MessageRecord;
};


/**
 * Messages are ICU formated messages, see guide at
 * http://userguide.icu-project.org/formatparse/messages
 */
export const messages: MessageDB = {
    __empty__: {
        fr: '',
        nl: '',
        en: '',
    },

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
        fr: 'Outils de géolocalisation',
        nl: 'Gereedschap voor geolokalisatie',
        en: 'Geolocation tools',
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

    mapData: {
        fr: 'Données',
        nl: 'Data',
        en: 'Data',
    },

    mapDataHelp: {
        fr: 'Affichez ou masquez certaines couches, et explorez les données brutes en utilisant la table attributaire.',
        nl: 'Toon of verberg bepaalde lagen en verken de ruwe gegevens met behulp van de attribuutententabel.',
        en: 'Show or hide certain layers, and explore the raw data using the attribute table',
    },

    mapRefList: {
        fr: 'Cartes',
        nl: 'Kaarten',
        en: 'Maps',
    },


    mapList: {
        fr: 'Liste des cartes',
        nl: 'kaartlijst',
        en: 'Maps list',
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

    wmsSwitchHelpText: {
        fr: 'Sélectionnez un des webservices référencés ci-dessous pour changer le fond de carte.',
        nl: 'Selecteer een van de onderstaande webservices om de basiskaart te wijzigen.',
        en: 'Select one of the webservices listed below to change the base map.',
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

    printFormatChoice: {
        fr: 'Choix du format et de l\'orientation',
        nl: 'Keuze van formaat en oriëntatie',
        en: 'Choice of format and orientation',
    },

    printSmallFormat: {
        fr: 'Petit format (A4)',
        nl: 'Klein formaat (A4)',
        en: 'Small format (A4)',
    },

    printBigFormat: {
        fr: 'Grand format (A0)',
        nl: 'Groot formaat (A0)',
        en: 'Large format (A0)',
    },

    printMap: {
        fr: 'Export et impression',
        nl: 'Exporteren en printen',
        en: 'Export and print',
    },

    printMapHelp: {
        fr: 'Exportez la vue actuelle de la carte en un fichier .PDF prêt à imprimer en sélectionnant le format et l\'orientation souhaités.',
        nl: 'Exporteer de huidige kaartweergave als een drukklaar PDF-bestand door het gewenste formaat en oriëntatie te selecteren.',
        en: 'Export the current map view as a print-ready PDF file by selecting the desired format and orientation.',
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

    solarAppName: {
        fr: 'Carte solaire de la Région de Bruxelles-Capitale',
        nl: 'Zonnekaart van het Brussels Hoofdstedelijk Gewest',
        en: 'Brussels solar map',
    },

    analyse: {
        nl: 'Examineren',
        fr: 'Analyser',
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

    buyingPrice: {
        fr: 'Prix d\'achat TVAC',
        nl: 'Aankoopprijs Incl.BTW',
        en: 'buying price Incl. VAT',
    },

    gainGreenCertif: {
        fr: 'Gains certificat vert',
        nl: 'Winst aan groenestroomcertificaten',
        en: 'Gain Green Certificate',
    },

    gainGreenCertif25Y: {
        fr: 'Gains certificat vert (10 ans)',
        nl: 'Winst aan groenestroomcertificaten (10 jaar)',
        en: 'Gain Green Certificate (10 years)',
    },

    gainElecInvoice: {
        fr: 'Gain facture d\'électricité',
        nl: 'Besparing op uw elektriciteitsfactuur',
        en: 'Electricity bill savings',
    },

    gainElecInvoice25Y: {
        fr: 'Gain facture d\'électricité sur 25 ans',
        nl: 'Besparing op uw elektriciteitsfactuur na 25 jaar',
        en: 'Electricity bill savings 25 years',
    },

    gainEnvironment: {
        fr: 'Gain pour l\'environnement',
        nl: 'Winst voor het milieu',
        en: 'Environmental gain',
    },
    gainEnvironment25Y: {
        fr: 'Gain pour l\' environnement sur 25 ans',
        nl: 'Winst voor het milieu over 25 jaar',
        en: 'Environmental gain over 25 years',
    },

    orientationGreat: {
        fr: 'Excellent potentiel',
        nl: 'Uitstekend potentieel',
        en: 'Great potential',
    },

    orientationGood: {
        fr: 'Bon potentiel',
        nl: 'Goed potentieel',
        en: 'Good potential',
    },

    unusable: {
        fr: 'Faible potentiel (exclu du calcul)',
        nl: 'Laag potentieel (niet opgenomen in de berekening)',
        en: 'Low potential (excluded from the calculation)',
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
        fr: 'Contraintes en toiture',
        nl: 'Obstakels op het dak',
        en: 'Roofing constraints',
    },

    consumption: {
        fr: 'Consommation',
        nl: 'Consumerend',
        en: 'Consumption',
    },

    solAutoproduction: {
        fr: 'Gestes d\'auto consommation',
        en: '',
        nl: 'Autoconsumptie verhogen',
    },

    finance: {
        fr: 'Finance',
        nl: 'Geldwezen',
        en: 'Finance',
    },

    loan: {
        fr: 'Emprunt',
        nl: 'Lening',
        en: 'Loan',
    },

    loanDuration: {
        fr: 'Durée du prêt',
        nl: 'Looptijd',
        en: 'Loan duration',
    },

    loanYes: {
        fr: 'Avec emprunt',
        nl: 'Met een lening',
        en: 'With a loan',
    },
    loanNo: {
        fr: 'Sans emprunt',
        nl: 'Zonder een lening',
        en: 'Without a loan',
    },
    loanRate: {
        fr: 'Taux du prêt',
        nl: 'Leningstarief',
        en: 'Loan rate',
    },

    installation: {
        fr: 'Installation',
        nl: 'Installatie',
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
        fr: 'Obstacles estimés',
        nl: 'Vermoedelijke obstakels',
        en: 'Estimated obstacles',
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
        fr: 'Auto consommation',
        nl: 'Autoconsumptie',
        en: '',
    },

    gainTotal25Y: {
        fr: 'Gains nets sur 25 ans',
        nl: 'Nettowinst na 25 jaar',
        en: '',
    },

    gainTotal: {
        fr: 'Gains totaux',
        nl: 'Totale winst',
        en: 'Total earnings',
    },

    returnTime: {
        fr: 'Temps de retour actualisé',
        nl: 'Bijgewerkte terugverdientijd',
        en: 'Return time',
    },

    reduceConsumption: {
        fr: 'Je diminue ma consommation.',
        nl: 'Ik verminder mijn verbruik.',
        en: 'I reduce my consumption.',
    },

    dayConsumption: {
        fr: 'Je consomme en journée.',
        nl: 'Ik verbruik overdag.',
        en: 'I use during the day.',
    },

    hotWaterDuringDay: {
        fr: 'Eau chaude préparée en journée.',
        nl: 'Ik laat mijn water overdag opwarmen.',
        en: 'Hot water prepared during the day.',
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
        fr: 'J\'installe des batteries.',
        nl: 'Ik plaats batterijen.',
        en: 'I install bateries.',
    },

    technoType: {
        fr: 'Type de technologie photovoltaïque',
        nl: 'Type zonnepanelen technologie',
        en: 'Photovoltaic technologie type',
    },

    monocristal: {
        fr: 'Monocristallin',
        nl: 'Monokristallijn',
        en: 'Monocrystalin',
    },

    polycristal: {
        fr: 'Polycristallin',
        nl: 'Polykristallijn',
        en: 'Polycrystalin',
    },

    monocristalHR: {
        fr: 'Monocristallin haut rendement',
        nl: 'Monokristallijn met hoog rendement',
        en: 'High efficiency monocrystalin',
    },

    panelIntegration: {
        fr: 'Intégration des panneaux à la toiture',
        nl: 'Integratie van de panelen in het dak',
        en: 'Integration of the panels into the roof',
    },

    annualConsumptionKWh: {
        fr: 'Consommation annuelle',
        nl: 'Jaarlijks verbruik',
        en: 'Annual consumption',
    },

    solConsumptionEstimated: {
        fr: 'consommés estimés',
        nl: 'geschat verbruikt',
        en: 'consumed estimated',
    },

    annualMaintenance: {
        fr: 'Entretiens et monitoring annuel',
        nl: 'Jaarlijkse onderhouds en monitoring',
        en: 'Annual maintenance and monitoring',
    },

    sellingPrice: {
        fr: 'Vente de l\'électricité injectée dans le réseau',
        nl: 'Verkoopprijs van aan het net geleverde elektriciteit',
        en: 'Price of electricity fed into the grid',
    },

    installationPrice: {
        fr: 'Coût de l\'installation',
        nl: 'installatiekosten',
        en: 'Installation cost',
    },

    VATinstallation: {
        fr: 'TVA installation',
        nl: 'BTW installatie',
        en: 'VAT installation',
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

    solVAT21: {
        fr: '21% - Bâtiment < 10 ans',
        nl: '21% - Gebouw < 10 jaar',
        en: '21% - Building < 10 years',
    },

    solVAT6: {
        fr: '6% - Bâtiment > 10 ans',
        nl: '6% - Gebouw > 10 jaar',
        en: '6% - Building > 10 years',
    },

    solVAT0: {
        fr: '0% - Non residentiel',
        nl: '0% - Niet-residentieel',
        en: '0% - Non residential',
    },

    sellingGreenCertifPrice: {
        fr: 'Revente des certificats verts',
        nl: 'Doorverkoop van groenestroomcertificaten',
        en: 'Resale of Green Certificates',
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
        fr: 'Cheminée',
        nl: 'Schoorsteen',
        en: 'Chimney',
    },

    terraceInUse: {
        fr: 'Terrasse utilisée',
        nl: 'Terras',
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

    yes: {
        fr: 'Oui',
        nl: 'Ja',
        en: 'Yes',
    },

    no: {
        fr: 'Non',
        nl: 'Nee',
        en: 'No',
    },

    heat: {
        fr: 'chaleur ',
        nl: 'warmte ',
        en: 'heat ',
    },

    electricity: {
        fr: 'électricité ',
        nl: 'elektriciteit ',
        en: 'electricity ',
    },

    solLocatePitchStr1: {
        fr: 'Des',
        nl: '',
        en: '',
    },

    solLocatePitchStr2: {
        fr: 'panneaux solaires',
        nl: 'Zonnepanelen',
        en: 'Solar pannels',
    },

    solLocatePitchStr3: {
        fr: 'sur ma toiture ?',
        nl: 'op mijn dak ?',
        en: 'on my roof ?',
    },

    solLocatePitchStr4: {
        fr: 'Une solution avantageuse ',
        nl: 'Een voordelige oplossing ',
        en: 'An advantageous solution ',
    },

    solLocatePitchStr5: {
        fr: 'pour produire de l\'',
        nl: 'om ',
        en: 'to produce',
    },


    solLocatePitchStr6: {
        fr: 'électricité',
        nl: 'elektriciteit',
        en: 'electricity',
    },

    solLocatePitchStr7: {
        fr: 'ou de la ',
        nl: 'of ',
        en: 'or ',
    },

    solLocatePitchStr8: {
        fr: 'chaleur',
        nl: 'warmte',
        en: 'heat',
    },

    solLocatePitchStr9: {
        fr: '',
        nl: ' te produceren',
        en: '',
    },

    solCalculateStrPart1: {
        fr: 'Calculer le ',
        nl: 'Bereken het ',
        en: 'Calculate the',
    },

    solSolarPotential: {
        fr: 'potentiel solaire',
        nl: 'zonnepotentieel',
        en: 'solar potential',
    },

    solSolarPotentialStr1: {
        fr: 'Installation possible de ',
        nl: 'Er is een installatie mogelijk van ',
        en: '',
    },
    solSolarPotentialStr2: {
        fr: 'avec un ',
        nl: 'met een ',
        en: '',
    },
    solSolarPotentialStr3: {
        fr: 'gain net ',
        nl: 'nettowinst ',
        en: '',
    },

    solSolarPotentialStr3Thermal: {
        fr: 'gain ',
        nl: 'winst ',
        en: '',
    },

    solSolarPotentialStr4: {
        fr: 'de ',
        nl: 'van ',
        en: '',
    },

    solSolarPotentialExcellent: {
        fr: 'Excellent potentiel solaire',
        nl: '***',
        en: '***',
    },

    solSolarPotentialGood: {
        fr: 'Bon potentiel solaire ',
        nl: '***',
        en: '***',
    },

    solCalculateStrPart2: {
        fr: 'de ma toiture',
        nl: 'van mijn dak',
        en: 'of my roof',
    },

    solOrSelectBuilding: {
        fr: 'Je sélectionne mon bâtiment',
        nl: 'Ik kies mijn gebouw',
        en: 'Select a building ',
    },

    solOnMap: {
        fr: 'sur la carte',
        nl: 'op de kaart',
        en: 'on the map',
    },

    solSolarGeocode: {
        fr: 'Adresse : rue, numéro, commune',
        nl: 'Adres: straat, nummer, plaats',
        en: 'Address: street, number, town',
    },

    solResearch: {
        fr: 'Chercher',
        nl: 'Zoeken',
        en: 'Search',
    },

    solBackToMap: {
        fr: 'Revenir à la carte',
        nl: 'Terug naar de kaart',
        en: 'Back to map',
    },

    solAndNow: {
        fr: 'Et maintenant ?',
        nl: 'Wat nu ?',
        en: 'Now what ?',
    },

    solActSettingStr1: {
        fr: 'avec les données',
        nl: 'met gedetailleerde',
        en: 'with detailed',
    },

    solActSettingStr2: {
        fr: 'détaillées',
        nl: 'projectgegevens',
        en: 'project data',
    },

    solActSettingStr3: {
        fr: 'du projet',
        nl: 'en bijzonderheden',
        en: 'and specifics',
    },

    solActSettingStr4: {
        fr: 'et ses spécificités',
        nl: '',
        en: '',
    },

    solActContactStr1: {
        fr: 'pour une installation',
        nl: 'voor een optimale',
        en: 'for optimal',
    },

    solActContactStr2: {
        fr: 'optimale',
        nl: 'installatie',
        en: 'installation',
    },

    solActContactStr3: {
        fr: 'et se renseigner',
        nl: 'en informatie',
        en: 'and information',
    },

    solActContactStr4: {
        fr: 'sur les aides potentielles',
        nl: 'over mogelijke hulpmiddelen',
        en: 'on potential aids',
    },

    solActChangeStr1: {
        fr: 'l\'énergie produite',
        nl: 'van de energie',
        en: 'of the energy produced',
    },

    solActChangeStr2: {
        fr: 'par les panneaux',
        nl: 'die de panelen produceren',
        en: 'by the panels',
    },

    solActChangeStr3: {
        fr: 'et optimiser',
        nl: 'en het verbruik',
        en: 'and optimize',
    },

    solActChangeStr4: {
        fr: 'la consommation',
        nl: 'optimaliseren',
        en: 'consumption',
    },

    solActPrintStr1: {
        fr: 'la fiche détaillée',
        nl: 'het gedetailleerde',
        en: 'the detailed',
    },

    solActPrintStr2: {
        fr: 'de l\'analyse',
        nl: 'analyseformulier',
        en: 'analysis sheet',
    },

    solAdjustStr1: {
        fr: 'Je personnalise',
        nl: 'Mijn installatie',
        en: '',
    },

    solAdjustStr2: {
        fr: 'mon installation',
        nl: 'personaliseren',
        en: '',
    },

    solContactStr1: {
        fr: 'Je trouve',
        nl: 'Mijn installateur',
        en: 'Contact',
    },

    solContactStr2: {
        fr: 'un installateur',
        nl: 'vinden',
        en: 'an installer',
    },

    solChangeStr1: {
        fr: 'Tout savoir',
        nl: 'Alles over ',
        en: '',
    },

    solChangeStr2: {
        fr: 'sur l\'énergie verte',
        nl: 'groene energie',
        en: '',
    },

    solPrintStr1: {
        fr: 'Je télécharge',
        nl: 'Mijn rapport',
        en: 'View and',
    },

    solPrintStr2: {
        fr: 'mon rapport',
        nl: 'bekijken',
        en: 'download',
    },

    solPrintStr3: {
        fr: 'Télécharger le rapport',
        nl: 'Download het rapport',
        en: 'Download the report',
    },


    unitEuro: {
        fr: '€',
        nl: '€',
        en: '€',
    },
    unitEuroExclVAT: {
        fr: '€HTVA',
        nl: '€ Excl.BTW',
        en: '€ Excl.VAT',
    },
    unitEuroInclVAT: {
        fr: '€TVAC',
        nl: '€ Incl.BTW',
        en: '€ Incl.VAT',
    },
    unitEuroY: {
        fr: '€/an',
        nl: '€/jaar',
        en: '€/year',
    },
    unitEuroY10: {
        fr: '€ / 10 ans',
        nl: '€ / 10 jaar',
        en: '€ / 10 years',
    },
    unitEuroY25: {
        fr: '€ / 25 ans',
        nl: '€ / 25 jaar',
        en: '€ / 25 years',
    },
    unitEuroKWh: {
        fr: '€/kWh',
        nl: '€/kWh',
        en: '€/kWh',
    },
    unitKWc: {
        fr: 'kWc',
        nl: 'kWp',
        en: 'kWc',
    },
    unitTonsCO2: {
        fr: '{value, plural, =0 {tonne CO2} =1 {tonne CO2} other {tonnes CO2}}',
        nl: '{value, plural, =0 {ton CO2} =1 {ton CO2} other {ton CO2}}',
        en: '{value, plural, =0 {ton CO2} =1 {ton CO2} other {tons CO2}}',
        parameters: {
            value: 1,
        },
    },
    unitTCO2: {
        fr: 'TCO2',
        nl: 'TCO2',
        en: 'TCO2',
    },
    unitTCO2Y: {
        fr: 'TCO2/an',
        nl: 'TCO2/jaar',
        en: 'TCO2/year',
    },
    unitTCO2Y10: {
        fr: 'TCO2 / 10 ans',
        nl: 'TCO2 / 10 jaar',
        en: 'TCO2 / 10 years',
    },
    unitTCO2Y25: {
        fr: 'TCO2 / 25 ans',
        nl: 'TCO2 / 25 jaar',
        en: 'TCO2 / 25 years',
    },
    unitYear: {
        fr: '{value, plural, =0 {an} =1 {an} other {ans}}',
        nl: '{value, plural, =0 {jaar} =1 {jaar} other {jaar}}',
        en: '{value, plural, =0 {years} =1 {year} other {years}}',
        parameters: {
            value: 1,
        },
    },
    unitM2: {
        fr: 'm²',
        nl: 'm²',
        en: 'm²',
    },
    unitPercent: {
        fr: '%',
        nl: '%',
        en: '%',
    },
    unitKWh: {
        fr: 'kWh',
        nl: 'kWh',
        en: 'kWh',
    },
    unitKWhY: {
        fr: 'kWh/an',
        nl: 'kWh/jaar',
        en: 'kWh/year',
    },
    unitLiterDay: {
        fr: 'l/jour',
        nl: 'l/dag',
        en: 'l/day',
    },
    unitLiter: {
        fr: 'l',
        nl: 'l',
        en: 'l',
    },

    solLegendConsRank1: {
        fr: 'Petit consommateur (studio/appartement avec éclairage, réfrigérateur etc.)',
        nl: 'Kleinverbruiker (studio/appartement met verlichting, koelkast enz.)',
        en: 'Small consumer (studio/apartment with lighting, refrigerator etc.)',
    },

    solLegendConsRank2: {
        fr: 'Petite famille (avec machine à laver/lave-vaisselle)',
        nl: 'Klein gezin (met wasmachine/vaatwasser)',
        en: 'Small family (with washing machine/dishwasher)',
    },

    solLegendConsRank3: {
        fr: 'Consommateur médian',
        nl: 'Mediaan verbruiker',
        en: 'Median consumer',
    },

    solLegendConsRank4: {
        fr: 'Ménage moyen',
        nl: 'Gemiddeld huishouden',
        en: 'Average household',
    },

    solLegendConsRank5: {
        fr: 'Gros consommateur',
        nl: 'Grootverbruiker',
        en: ' Large consumer',
    },

    solLegendConsWaterRank1: {
        fr: 'Personne seule ou un ménage très économe (douches rapides plutôt que bains).',
        nl: 'Één persoon of een klein en heel zuinig huishouden (snelle douches in plaats van baden).',
        en: 'Single person or a very economical household (quick showers rather than baths).',
    },

    solLegendConsWaterRank2: {
        fr: 'Petit ménage économe (douches rapides plutôt que bains).',
        nl: 'Klein en zuinig huishouden  (snelle douches in plaats van baden).',
        en: 'Small, economical household (quick showers instead of baths).',
    },

    solLegendConsWaterRank3: {
        fr: 'Famille petite, ou une moyenne et économe (douches rapides plutôt que bains).',
        nl: 'Middelgroot en zuinig huishouden  (snelle douches in plaats van baden).',
        en: 'Small or medium and economical family (quick showers rather than baths).',
    },

    solLegendConsWaterRank4: {
        fr: 'Famille moyenne, ou une grande et économe (douches rapides plutôt que bains).',
        nl: 'Groot en zuinig huishouden (snelle douches in plaats van baden).',
        en: 'Average family or a large and economical family (quick showers rather than baths).',
    },

    solLegendConsWaterRank5: {
        fr: 'Grande famille.',
        nl: 'Groot huishouden.',
        en: 'Big family.',
    },

    solLegendConsWaterRank6: {
        fr: 'Très grande famille.',
        nl: 'Heel groot huishouden.',
        en: 'Very big family.',
    },

    resetValue: {
        fr: 'Réinitialiser',
        nl: 'Reset',
        en: 'Reset values',
    },

    solPhotovoltaic: {
        fr: 'Photovoltaïque',
        nl: 'Zonnepanelen',
        en: 'Photovoltaic',
    },

    solThermal: {
        fr: 'Thermique',
        nl: 'Thermisch',
        en: 'Thermal',
    },

    gainEnergyInvoice: {
        fr: 'Gain facture énergétique',
        nl: 'Besparing op uw energiefactuur',
        en: 'Gain on energy bill',
    },

    gainEnergyInvoice10Y: {
        fr: 'Gain sur ma facture énergétique en 10 ans',
        nl: 'Besparing op uw energiefactuur op 10 jaar',
        en: 'Gain on energy bill over 10 years',
    },

    gainEnergyInvoice25Y: {
        fr: 'Gain sur ma facture énergétique en 25 ans',
        nl: 'Besparing op uw energiefactuur op 25 jaar',
        en: 'Gain on energy bill over 25 years',
    },

    bonus: {
        fr: 'Prime',
        nl: 'Premie',
        en: 'Bonus',
    },

    solHotWaterConsumption: {
        fr: 'Consommation d\'eau chaude',
        nl: 'Warmwaterverbruik',
        en: 'Hot water consumption',
    },

    solGaz: {
        fr: 'Gaz',
        nl: 'Gas',
        en: 'Gas',
    },

    solMazout: {
        fr: 'Mazout',
        nl: 'Stookolie',
        en: 'Fuel oil',
    },

    solElectricBoiler: {
        fr: 'Boiler électrique',
        nl: 'Elektrische boiler',
        en: 'Electric boiler',
    },

    solHeatProdSys: {
        fr: 'Système actuel de production d\'eau chaude',
        nl: 'Huidige warmwaterproductie',
        en: 'Current hot water production system',
    },

    solPellet: {
        fr: 'Chaudière à pellets',
        nl: 'Pellet ketel',
        en: 'Pellet boiler',
    },

    solDailyConsumption: {
        fr: 'Consommation journalière',
        nl: 'Dagelijks verbruik',
        en: 'Daily consumption',
    },

    solSearchAnotherAdress: {
        fr: 'Chercher une nouvelle adresse',
        nl: 'Nieuw adres zoeken',
        en: 'Search for a new address',
    },

    solDedicatedArea: {
        fr: 'Nombre de panneaux souhaités',
        nl: 'Gewenste aantal panelen',
        en: '',
    },

    solFinanceCost: {
        fr: 'Coût financier',
        nl: 'Rentekosten',
        en: 'Financial cost',
    },

    solFinanceGain: {
        fr: 'Gain financier',
        nl: 'Financieel gewin',
        en: 'Financial gain',
    },

    technology: {
        fr: 'Technologie',
        nl: 'Technologie',
        en: 'Technology',
    },

    consumptionYElectricity: {
        fr: 'Consommation annuelle d\'électricité',
        nl: 'Jaarlijks elektriciteitsverbruik',
        en: 'Annual electricity consumption',
    },

    solFinanceVAT: {
        fr: 'Taux de TVA',
        nl: 'BTW tarief',
        en: 'VAT rates',
    },

    solSelectedPannels: {
        fr: 'panneaux photovoltaïques envisagés',
        nl: 'zonnepanelen',
        en: 'photovoltaic panels',
    },

    solOptimumInstallation: {
        fr: 'Puissance maximum de l\'installation selon la technologie choisie',
        nl: 'Maximaal vermogen van de installatie volgens de gekozen technologie',
        en: 'Maximum power of the installation according to the chosen technology',
    },

    solOptimumInstallationTheoric: {
        fr: 'Puissance maximale théorique conseillée pour une installation non-industrielle (12kWc - non accessible dans le cas présent).',
        nl: 'Theoretisch maximaal vermogen aanbevolen voor een niet-industriële installatie (12kWp - niet toegankelijk in dit geval).',
        en: 'Theoretical maximum power recommended for a non-industrial installation (12kWc - not accessible in this case).',
    },

    solNoCalcSTR1: {
        fr: 'Nous sommes désolés mais nous ne pouvons pas fournir de simulation fiable pour votre toiture. Un pourcentage minime (0,5%) des toitures bruxelloises ne peut être analysé pour des raisons techniques indépendantes de notre volonté.',
        nl: 'Het spijt ons, maar we kunnen geen betrouwbare simulatie voor uw dak bieden. Buiten onze wil om kan een minimaal percentage (0,5%) van de Brusselse daken om technische redenen niet worden geanalyseerd.',
        en: '',
    },

    solNoCalcSTR2: {
        fr: 'Cependant, vous pouvez toujours faire appel aux conseillers énergies de la Région pour déterminer si l’installation de panneaux solaires est une piste intéressante pour votre habitation.  Contactez gratuitement un de nos conseillers:',
        nl: 'In dat geval kan u echter altijd een beroep doen op de energieadviseurs van de Regio om te bepalen of de installatie van zonnepanelen een interessante mogelijkheid is voor uw woning. Neem gratis contact op met één van onze adviseurs:',
        en: '',
    },

    solNoSolSTR1: {
        fr: 'Nous n’avons pas trouvé de configuration rentable pour l\’installation de panneaux solaires.',
        nl: 'We hebben geen rentabele configuratie gevonden voor het installeren van zonnepanelen.',
        en: 'We have not found a cost-effective configuration for the installation of solar panels.',
    },

    solNoSolSTR2: {
        fr: 'Mais des alternatives existent si vous souhaitez améliorer la consommation d’énergie de votre bâtiment. ',
        nl: 'Maar er zijn alternatieven als u het energieverbruik van uw gebouw wil verbeteren.',
        en: 'But there are alternatives if you want to improve the energy consumption of your building.',
    },

    solNoSolSTR3: {
        fr: 'Découvrez ces alternatives ',
        nl: 'Ontdek deze alternatieven ',
        en: 'Discover these alternatives ',
    },

    solSharedRoof: {
        fr: 'toitures partagées',
        nl: 'gedeelde daken',
        en: 'shared roofs',
    },

    solSharedRoofLink: {
        fr: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/partagez-votre-toit-bloc-appartements',
        nl: 'https://leefmilieu.brussels/themas/energie/wat-groene-energie/deel-uw-dak-appartementsgebouwen',
        en: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/partagez-votre-toit-bloc-appartements',
    },


    solNoSolSTR4: {
        fr: '…) sur le site de ',
        nl: '…) op de website van ',
        en: '…) on the',
    },


    solNoSolSTR5: {
        fr: ' ou contactez gratuitement un de nos conseillers:',
        nl: ' of neem gratis contact op met één van onze adviseurs:',
        en: ' website or contact one of our consultants free of charge:',
    },

    solNoSolSTR6: {
        fr: ' pour les particuliers ou le ',
        nl: ' voor particulieren of de ',
        en: ' for individuals or the ',
    },

    solNoSolSTR7: {
        fr: 'pour les professionnels.',
        nl: 'voor professionelen.',
        en: 'for professionals.',
    },



    solHeatPumpLabel: {
        fr: 'pompe à chaleur',
        nl: 'warmtepomp',
        en: 'heat pump',
    },
    solHeatPumpLink: {
        fr: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/produire-votre-propre-energie-verte/les-pompes',
        nl: 'https://leefmilieu.brussels/themas/energie/groene-energie/produceer-uw-eigen-groene-energie/warmtepompen',
        en: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/produire-votre-propre-energie-verte/les-pompes',
    },

    solBuyGreenEnergyLabel: {
        fr: 'achat d’énergie verte',
        nl: 'aankoop van groene energie',
        en: 'buying green energy',
    },
    solBuyGreenEnergyLink: {
        fr: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/acheter-de-lenergie-verte',
        nl: 'https://leefmilieu.brussels/themas/energie/groene-energie/groene-energie-kopen',
        en: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte/acheter-de-lenergie-verte',
    },




    solWaterStorage: {
        fr: 'Ballon de stockage',
        nl: 'Inhoud boiler',
        en: 'Storage device',
    },

    solPanels: {
        fr: 'panneaux',
        nl: 'panelen',
        en: 'panels',
    },

    solPanelsPV: {
        fr: 'panneaux photovoltaïques',
        nl: 'zonnepanelen',
        en: 'solar panels',
    },

    solPanelsTH: {
        fr: 'panneaux thermiques',
        nl: 'thermische panelen',
        en: 'thermic panels',
    },

    solSolarProdYear: {
        fr: 'Production solaire',
        nl: 'Totale productie aan warmte van de panelen',
        en: 'Yearly solar production',
    },

    solSolarConsumptionYear: {
        fr: 'Consommation d\'énergie annuelle',
        nl: 'Huishoudelijk verbruik',
        en: 'Yearly energy consumption',
    },

    solSolarRateArea: {
        fr: 'Pourcentage d\'eau chaude sanitaire produite',
        nl: 'Het totaal percentage geproduceerd huishoudelijk warm water',
        en: '',
    },

    solInstallationLifeTime: {
        fr: 'Durée de vie de l\'installation',
        nl: 'Levensduur van de installatie',
        en: 'Installation lifetime',
    },

    solOn10Years: {
        fr: 'sur 10 ans',
        nl: 'op 10 jaar',
        en: 'over 10 years',
    },

    searchResult: {
        fr: 'Résultat de recherche',
        nl: 'Zoekresultaat',
        en: 'Search results',
    },

    solSolarWaterHeater: {
        fr: 'Solaire thermique',
        nl: 'Zonneboiler',
        en: '',
    },

    solSolarPanels: {
        fr: 'Panneaux solaires',
        nl: 'Zonnepanelen',
        en: 'Solar panels',
    },


    solCalculInfoStrPart1: {
        fr: 'FAQ',
        nl: 'Zonnekaart',
        en: 'Frequently asked',
    },

    solCalculInfoStrPart2: {
        fr: 'carte solaire',
        nl: 'FAQ\'s',
        en: 'questions',
    },

    solMyRooftop: {
        fr: 'Ma toiture',
        nl: 'Mijn dak',
        en: '',
    },

    solTotalSurface: {
        fr: 'Surface totale',
        nl: 'Totale oppervlakte',
        en: '',
    },

    solMyInstallation: {
        fr: 'Mon installation',
        nl: 'Mijn installatie',
        en: '',
    },

    solMyEnergy: {
        fr: 'Mon énergie',
        nl: 'Mijn energie',
        en: '',
    },

    solMyFinance: {
        fr: 'Mes finances',
        nl: 'Mijn financiën',
        en: '',
    },

    solUsableRoofArea: {
        fr: 'Surface utilisable',
        nl: 'Bruikbare oppervlakte',
        en: 'Usable area',
    },

    solProductionPanels: {
        fr: 'Production des panneaux',
        nl: 'Productie van de panelen',
        en: '',
    },

    solHomeConsumption: {
        fr: 'Consommation du ménage',
        nl: 'Huishoudelijk verbruik',
        en: '',
    },

    solNumberOfPanels: {
        fr: 'Nombre de panneaux',
        nl: 'Aantal panelen',
        en: '',
    },

    solInstallationSurface: {
        fr: 'Superficie installée',
        nl: 'Geïnstalleerde oppervlakte',
        en: '',
    },

    solTotalPower: {
        fr: 'Puissance totale installée',
        nl: 'Totaal geïnstalleerd vermogen',
        en: '',
    },

    gainInvoice25Y: {
        fr: 'Gain sur ma facture en 25 ans',
        nl: 'Besparing op uw elektriciteitsfactuur na 25 jaar',
        en: '',
    },

    solTogglePV: {
        fr: 'Les panneaux solaires photovoltaïques produisent de l’électricité.',
        nl: 'Zonnepanelen produceren elektriciteit. Ze worden ook fotovoltaïsche panelen genoemd.',
        en: '',
    },

    solToggleThermal: {
        fr: 'Le chauffe-eau solaire produit de l’eau chaude sanitaire via des panneaux thermiques.',
        nl: 'De zonneboiler produceert sanitair warm water via thermische panelen.',
        en: '',
    },

    solDisclaimerLink: {
        fr: 'Ces données sont des estimations et n\'engagent pas la responsabilité de Bruxelles Environnement.',
        nl: 'Deze gegevens zijn schattingen en vallen niet onder de verantwoordelijkheid van Leefmilieu Brussel.',
        en: 'These data are estimates and do not engage the responsibility of Brussels Environment.',
    },


    solContactLabel: {
        fr: 'Pour toute demande d\'information, contactez ',
        nl: 'Voor alle informatie, contacteer ',
        en: 'For any information, contact',
    },

    solLinkContactBELabel: {
        fr: 'Bruxelles Environnement',
        nl: 'Leefmilieu Brussel',
        en: 'Bruxelles Environnement',
    },

    solLinkContactBE: {
        fr: 'https://environnement.brussels/bruxelles-environnement/nous-contacter',
        nl: 'https://leefmilieu.brussels/leefmilieu-brussel/contacteer-ons',
        en: 'https://environnement.brussels/bruxelles-environnement/nous-contacter',
    },

    solLinkFAQ: {
        fr: 'https://environnement.brussels/content/carte-solaire-de-la-region-bruxelloise-faq',
        nl: 'https://leefmilieu.brussels/content/zonnekaart-brussel-faq',
        en: 'https://environnement.brussels/content/carte-solaire-de-la-region-bruxelloise-faq',
    },

    solLinkDisclaimer: {
        fr: 'https://environnement.brussels/content/disclaimer-carte-solaire',
        nl: 'https://leefmilieu.brussels/content/disclaimer-zonnekaart',
        en: 'https://environnement.brussels/content/disclaimer-carte-solaire',
    },

    moreInfos: {
        fr: 'En savoir plus.',
        nl: 'Meer info.',
        en: 'More informations.',
    },

    solContactLinkLabel: {
        fr: 'Contacts et informations :',
        nl: 'Info en contacten :',
        en: 'Information and contacts :',
    },

    solDisclaimerLimit: {
        fr: 'Limite de responsabilité :',
        nl: 'Beperking van aansprakelijkheid :',
        en: 'Limitation of Liability :',
    },


    solLinkInfoGreenEnergy: {
        fr: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte',
        nl: 'https://leefmilieu.brussels/themas/energie/wat-groene-energie',
        en: 'https://environnement.brussels/thematiques/energie/quest-ce-que-lenergie-verte',
    },

    solLinkInstallateurPV: {
        fr: 'https://rescert.be/fr/list?res_category=2',
        nl: 'https://rescert.be/nl/list?res_category=2',
        en: 'https://rescert.be/fr/list?res_category=2',
    },
    solLinkInstallateurTH: {
        fr: 'https://rescert.be/fr/list?res_category=4',
        nl: 'https://rescert.be/nl/list?res_category=4',
        en: 'https://rescert.be/fr/list?res_category=4',
    },


    solProduced: {
        fr: ' produits estimés',
        nl: ' geschat productie',
        en: ' estimated produced',
    },

    solConsumed: {
        fr: ' consommés estimés',
        nl: ' geschat verbruik',
        en: ' estimated consumed',
    },

    solUrbisLabel: {
        fr: 'Orthophotographie, géocodeur et données 3D © ',
        nl: 'Orthofotografie, geocoder en 3D-gegevens © ',
        en: 'Orthophotography, geocoder and 3D data © ',
    },

    solUrbisLink: {
        fr: 'https://cirb.brussels/fr/nos-solutions/urbis-solutions/urbis-data',
        nl: 'https://cibg.brussels/nl/onze-oplossingen/urbis-solutions/urbis-data?set_language=nl',
        en: 'https://bric.brussels/en/our-solutions/urbis-solutions/urbis-data?set_language=en',
    },

    solCreatorsLabel: {
        fr: 'Conception et réalisation : ',
        nl: 'Ontwerp en productie : ',
        en: 'Design and production : ',
    },

    solFacilitatorLabel: {
        fr: 'Facilitateur Bâtiment Durable',
        nl: 'Facilitator Duurzame Gebouwen',
        en: 'Facilitateur Bâtiment Durable',
    },

    solFacilitatorLink: {
        fr: 'https://environnement.brussels/thematiques/batiment/la-gestion-de-mon-batiment/pour-vous-aider/le-facilitateur-batiment-durable',
        nl: 'https://leefmilieu.brussels/themas/gebouwen/het-beheer-van-mijn-gebouw/om-u-te-helpen/facilitator-duurzame-gebouwen',
        en: 'https://environnement.brussels/thematiques/batiment/la-gestion-de-mon-batiment/pour-vous-aider/le-facilitateur-batiment-durable',
    },

    solHomegradeLabel: {
        fr: 'Homegrade',
        nl: 'Homegrade',
        en: 'Homegrade',
    },

    solHomegradeLink: {
        fr: 'https://homegrade.brussels/homegrade/contact/',
        nl: 'https://homegrade.brussels/homegrade/contact/?lang=nl',
        en: 'https://homegrade.brussels/homegrade/contact/',
    },

    solInstallMoreMsgSTR1: {
        fr: 'Vous disposez d’une toiture avec une surface utilisable supérieure à 200 m², et il est très certainement avantageux d’installer plus. Pour plus d’information, consultez le ',
        nl: 'U heeft een dak met een bruikbare oppervlakte van meer dan 200 m² en het is zeker voordelig om meer te installeren. Voor meer informatie, raadpleeg de ',
        en: 'You have a roof with a usable area of more than 200 m², it is certainly advantageous to install more. For more information, consult the ',
    },

    solInstallMoreMsgSTR2: {
        fr: ' ou adressez-vous a un ',
        nl: ' of neem contact op met een  ',
        en: ' or contact an ',
    },

    solInstallMoreMsgSTR3: {
        fr: 'installateur.',
        nl: 'installateur.',
        en: 'installator.',
    },

    solIncompleteAdress: {
        fr: 'Adresse incomplète.',
        nl: 'Onvolledig adres.',
        en: 'Incomplete address.',
    },

    solSummary10Y: {
        fr: 'Résumé sur 10 ans',
        nl: 'Samenvatting over 10 jaar',
        en: 'Summary on 10 years',
    },

    'tooltip:info': {
        fr: 'Informations sur la carte',
        nl: '',
        en: '',
    },

    'tooltip:legend': {
        fr: 'Légende',
        nl: '',
        en: '',
    },

    'tooltip:data': {
        fr: 'Données',
        nl: '',
        en: '',
    },

    'tooltip:base-map': {
        fr: 'Fond de carte',
        nl: '',
        en: '',
    },

    'tooltip:print': {
        fr: 'Export et impression',
        nl: '',
        en: '',
    },

    'tooltip:ishare': {
        fr: 'Partager la carte',
        nl: '',
        en: '',
    },

    'tooltip:measure': {
        fr: 'Faire des mesures',
        nl: '',
        en: '',
    },

    'tooltip:locate': {
        fr: 'Outils de géolocalisation',
        nl: '',
        en: '',
    },

};
