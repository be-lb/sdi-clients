

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

import { MessageRecord } from 'sdi/source';

/**
 * First declare a key for each message.
 * The idea here is that we make sure that
 * calls to locale.getMessage(k) has k type checked.
 */
export type MessageKey =
    | 'add'
    | 'address'
    | 'atlasEnv'
    | 'attachedFiles'
    | 'attributesTable'
    | 'browseMaps'
    | 'charts'
    | 'close'
    | 'clear'
    | 'connect'
    | 'copy'
    | 'datas'
    | 'embed'
    | 'export'
    | 'featureInfos'
    | 'geocode'
    | 'go'
    | 'gpsTracker'
    | 'lastModified'
    | 'latitude'
    | 'loadingData'
    | 'location'
    | 'locationHelp'
    | 'login'
    | 'longitude'
    | 'mapDatas'
    | 'mapLegend'
    | 'mapRefList'
    | 'mapTools'
    | 'measure'
    | 'measureArea'
    | 'measureLength'
    | 'noResults'
    | 'rowNumberColTitle'
    | 'save'
    | 'search'
    | 'shareWithView'
    | 'start'
    | 'stop'
    | 'switchLang'
    | 'timeserieConfigError'
    | 'validate'
    | 'visible'
    | 'webServiceUrl'
    | 'wmsSwitch'
    | 'share'
    | 'mapLink'
    | 'mapLinkWithView'
    | 'mapEmbed'
    | 'mapEmbedWithView'
    ;



export type MessageDB = {
    [K in MessageKey]: MessageRecord;
};


/**
 * Messages are ICU formated messages, see guide at
 * http://userguide.icu-project.org/formatparse/messages
 */
export const messages: MessageDB = {
    wmsSwitch: {
        fr: 'Fond de carte',
        nl: 'Basiskaart',
    },

    switchLang: {
        fr: 'NL',
        nl: 'FR',
    },

    mapLegend: {
        fr: 'Légende',
        nl: 'Legenda',
    },

    mapTools: {
        fr: 'Outils',
        nl: 'Gereedschap',
    },

    mapDatas: {
        fr: 'Couches',
        nl: 'Laag',
    },

    mapRefList: {
        fr: 'Maps',
        nl: 'Kaarten',
    },

    location: {
        fr: 'Localisation',
        nl: 'Plaats bepalen',
    },

    locationHelp: {
        fr: 'Les coordonnées doivent être encodées dans le système Lambert Belge 72 (EPSG:31370)',
        nl: 'Coördinaten moeten worden gecodeerd in het Belgische Lambert systeem 72 (EPSG: 31370)',
    },

    attributesTable: {
        fr: 'Table attributaire',
        nl: 'Attributentabel',
    },

    charts: {
        fr: 'Graphiques',
        nl: 'Grafieken',
    },

    clear: {
        fr: 'clear',
        nl: 'clear',
    },

    datas: {
        fr: 'Données',
        nl: 'Gegevens',
    },

    export: {
        fr: 'Export',
        nl: 'Exporteer',
    },

    gpsTracker: {
        fr: 'Tracker GPS',
        nl: 'GPS tracker',
    },

    validate: {
        fr: 'OK',
        nl: 'OK',
    },

    login: {
        fr: 'Se connecter',
        nl: 'Log in',
    },

    lastModified: {
        fr: 'Dernière mise à jour le ',
        nl: 'Laatste update ',
    },

    attachedFiles: {
        fr: 'Documents',
        nl: 'Documenten',
    },

    rowNumberColTitle: {
        fr: '#',
        nl: '#',
    },

    close: {
        fr: 'Fermer',
        nl: 'Sluiten',
    },

    search: {
        fr: 'Recherche',
        nl: 'Zoeken',
    },

    browseMaps: {
        fr: 'Feuilleter des cartes',
        nl: 'Blader door de kaarten',
    },

    visible: {
        fr: 'Visibilité',
        nl: 'Zichtbaarheid',
    },

    add: {
        fr: 'Ajouter',
        nl: 'Toevoegen',
    },

    connect: {
        fr: 'Connecter',
        nl: 'Inloggen',
    },

    webServiceUrl: {
        fr: 'URL d\'un webservice',
        nl: 'URL voor een webservice',
    },

    save: {
        fr: 'Sauvegarder',
        nl: 'Opslaan',
    },

    stop: {
        fr: 'Arrêter',
        nl: 'Stoppen',
    },

    start: {
        fr: 'Démarrer',
        nl: 'Beginnen',
    },

    address: {
        fr: 'Adresse',
        nl: 'Adres',
    },

    latitude: {
        fr: 'Latitude',
        nl: 'Breedte',
    },

    longitude: {
        fr: 'Longitude',
        nl: 'Lengte',
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
        fr: 'Une aire',
        nl: 'Een gebied',
    },

    featureInfos: {
        fr: 'Informations sur l\'élément',
        nl: 'Artikel informatie',
    },

    geocode: {
        fr: 'Chercher une adresse',
        nl: 'Zoeken naar een adres',
    },

    share: {
        fr: 'Partager',
        nl: 'Delen',
    },

    embed: {
        fr: 'Inclure dans votre site',
        nl: 'Opnemen in uw site',
    },

    go: {
        fr: 'Aller',
        nl: 'Gaan',
    },

    shareWithView: {
        fr: 'Partager avec le niveau de zoom et le centrage actuel.',
        nl: 'Delen met het huidige zoomniveau.',
    },

    copy: {
        fr: 'Copier',
        nl: 'kopiëren',
    },

    mapEmbed: {
        fr: 'Inclure la carte',
        nl: 'Embed map',
    },

    mapEmbedWithView: {
        fr: 'Inclure la vue actuelle de la carte',
        nl: 'Sluit de huidige weergave van de kaart in',
    },

    mapLink: {
        fr: 'Partager un lien vers la carte',
        nl: 'Delen othing om de kaart',
    },

    mapLinkWithView: {
        fr: 'Partager un lien vers la vue actuelle de la carte',
        nl: 'Deel een link naar de huidige kaartweergave',
    },

    loadingData: {
        fr: 'Chargement des données',
        nl: 'Data wordt geladen',
    },

    timeserieConfigError: {
        fr: 'No or malformed configuration for this timeserie',
        nl: 'Fout in het laden van de voorkeuren voor deze grafiek',
    },

    atlasEnv: {
        fr: 'Atlas de l\'environnement',
        nl: 'Milieu-Atlas',
    },

    noResults: {
        fr: 'Pas de résultat',
        nl: 'Geen resultaten',
    },
};
