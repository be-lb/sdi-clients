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


import { i, u, l, a, p, MessageRecordIO, MessageRecord, TypeOf } from './io';
import { Type, _A } from 'io-ts/lib';
import { GeometryTypeIO } from './geojson';
import * as io from 'io-ts';


// const Multiplicity1Star = <T>(name: string, ioType: Type<T>): Type<T[]> => {
//     const validate = (value: any, context: ContextEntry[]) => {
//         if (Array.isArray(value) && value.length > 0) {
//             // logger(`${name} is array and length is ${value.length}`);
//             const va = value.reduce<boolean>((acc, v, _idx) => {
//                 if (acc) {
//                     // logger(v);
//                     const e = ioType.validate(v, context);
//                     const vr = e.fold(() => false, () => true);

//                     // logger(`${name}[${_idx}] => ${vr}`);
//                     return vr;
//                 }
//                 return acc;
//             }, true);
//             if (va) {
//                 return io.success(value);
//             }
//         }
//         return io.failure<T[]>(value, context);
//     };

//     return { _A, name, validate };
// };

const DateStringIO: Type<string> = {
    _A,
    name: 'DateString',
    validate(value, context) {
        return (
            io.validate(value, io.string).chain((s) => {
                const n = Date.parse(s);
                if (isNaN(n)) {
                    return io.failure<string>(value, context);
                }
                return io.success(s);
            }));
    },
};



// metadata/2.0/req/common/code-list-value
// const CodeListValueIO = i({
//     list: io.string,
//     listValue: io.string,
//     text: io.string,
// });

// metadata/2.0/req/common/free-text
export const AnchorIO = i({
    href: io.string,
    text: MessageRecordIO,
}, 'AnchorIO');

export const FreeTextIO = u([
    MessageRecordIO,
    AnchorIO,
], 'FreeTextIO');
export type FreeText = TypeOf<typeof FreeTextIO>;
export type Anchor = TypeOf<typeof AnchorIO>;

export const isAnchor = (a: FreeText): a is Anchor => {
    return ('href' in <Anchor>a);
};

export const getMessageRecord = (a: FreeText): MessageRecord => {
    if (isAnchor(a)) {
        return a.text;
    }
    return a;
};

// metadata/2.0/rec/common/fileIdentifier
// const FileIdentifierIO = io.string;

// metadata/2.0/req/common/metadata-language-code
export const MetadataLanguageCodeIO = u([
    l('bg'),
    l('hr'),
    l('cs'),
    l('da'),
    l('nl'),
    l('en'),
    l('et'),
    l('fi'),
    l('fr'),
    l('de'),
    l('el'),
    l('hu'),
    l('ga'),
    l('it'),
    l('lv'),
    l('lt'),
    l('mt'),
    l('pl'),
    l('pt'),
    l('ro'),
    l('sk'),
    l('sl'),
    l('es'),
    l('sv'),
], 'MetadataLanguageCodeIO');

// metadata/2.0/req/common/md-point-of-contact
export const MdPointOfContactIO = i({
    organisationName: FreeTextIO,
    email: io.string,
    contactName: io.string,
}, 'MdPointOfContactIO');
export type MdPointOfContact = TypeOf<typeof MdPointOfContactIO>;

// metadata/2.0/req/common/md-date
export const MdDateIO = DateStringIO;

// metadata/2.0/req/common/resource-title
export const ResourceTitleIO = FreeTextIO;

// metadata/2.0/req/common/resource-abstract
export const ResourceAbstractIO = FreeTextIO;

// metadata/2.0/req/common/responsible-organisation
export const ResponsibleOrganisationIO = io.intersection([
    MdPointOfContactIO,
    i({
        // http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_RoleCode
        roleCode: u([
            l('resourceProvider'),
            l('custodian'),
            l('owner'),
            l('user'),
            l('distributor'),
            l('originator'),
            l('pointOfContact'),
            l('principalInvestigator'),
            l('processor'),
            l('publisher'),
            l('author'),
        ]),
    }),
], 'ResponsibleOrganisationIO');
export type ResponsibleOrganisation = TypeOf<typeof ResponsibleOrganisationIO>;

// metadata/2.0/req/common/temporal-extent
export const TemporalExtentIO = i({
    begin: MdDateIO,
    end: MdDateIO,
}, 'TemporalExtentIO');
export type TemporalExtent = TypeOf<typeof TemporalExtentIO>;

// metadata/2.0/req/common/temporal-reference
export const TemporalReferenceIO = u([
    io.intersection([
        i({
            revision: MdDateIO,
        }),
        p({
            publication: MdDateIO,
        }),
        p({
            creation: MdDateIO,
        }),
    ]),
    TemporalExtentIO,
], 'TemporalReferenceIO');
export type TemporalReference = TypeOf<typeof TemporalReferenceIO>;


export const isTemporalExtent = (a: TemporalReference): a is TemporalExtent => {
    return ('begin' in a);
};

/**
 * 3 KEYWORD
 * 
 * If a resource is a spatial data set or spatial data set series, 
 * at least one keyword shall be provided from the general
 * environmental multilingual thesaurus (GEMET) describing 
 * the relevant spatial data theme as defined 
 * in Annex I, II or III to Directive 2007/2/EC.
 */

export const GEMET = {
    'http://inspire.ec.europa.eu/theme/br': {
        fr: 'Conditions atmosphériques',
        nl: 'Biogeografische gebieden',
    },
    'http://inspire.ec.europa.eu/theme/hb': {
        fr: 'Installations de suivi environnemental',
        nl: 'Habitats en biotopen',
    },
    'http://inspire.ec.europa.eu/theme/bu': {
        fr: 'Régions biogéographiques',
        nl: 'Gebouwen',
    },
    'http://inspire.ec.europa.eu/theme/hh': {
        fr: 'Habitats et biotopes',
        nl: 'Menselijke gezondheid en veiligheid',
    },
    'http://inspire.ec.europa.eu/theme/pd': {
        fr: 'Caractéristiques géographiques océanographiques',
        nl: 'Spreiding van de bevolking — demografie',
    },
    'http://inspire.ec.europa.eu/theme/er': {
        fr: 'Bâtiments',
        nl: 'Energiebronnen',
    },
    'http://inspire.ec.europa.eu/theme/hy': {
        fr: 'Dénominations géographiques',
        nl: 'Hydrografie',
    },
    'http://inspire.ec.europa.eu/theme/mr': {
        fr: 'Usage des sols',
        nl: 'Minerale bronnen',
    },
    'http://inspire.ec.europa.eu/theme/sd': {
        fr: 'Sols',
        nl: 'Spreiding van soorten',
    },
    'http://inspire.ec.europa.eu/theme/sr': {
        fr: 'Lieux de production et sites industriels',
        nl: 'Zeegebieden',
    },
    'http://inspire.ec.europa.eu/theme/so': {
        fr: 'Régions maritimes',
        nl: 'Bodem',
    },
    'http://inspire.ec.europa.eu/theme/of': {
        fr: 'Zones à risque naturel',
        nl: 'Oceanografische geografische kenmerken',
    },
    'http://inspire.ec.europa.eu/theme/mf': {
        fr: 'Services d\'utilité publique et services publics',
        nl: 'Meteorologische geografische kenmerken',
    },
    'http://inspire.ec.europa.eu/theme/su': {
        fr: 'Répartition des espèces',
        nl: 'Statistische eenheden',
    },
    'http://inspire.ec.europa.eu/theme/us': {
        fr: 'Unités statistiques',
        nl: 'Nutsdiensten en overheidsdiensten',
    },
    'http://inspire.ec.europa.eu/theme/oi': {
        fr: 'Occupation des terres',
        nl: 'Orthobeeldvorming',
    },
    'http://inspire.ec.europa.eu/theme/cp': {
        fr: 'Systèmes de maillage géographique',
        nl: 'Kadastrale percelen',
    },
    'http://inspire.ec.europa.eu/theme/gn': {
        fr: 'Parcelles cadastrales',
        nl: 'Geografische namen',
    },
    'http://inspire.ec.europa.eu/theme/au': {
        fr: 'Adresses',
        nl: 'Administratieve eenheden',
    },
    'http://inspire.ec.europa.eu/theme/el': {
        fr: 'Réseaux de transport',
        nl: 'Hoogte',
    },
    'http://inspire.ec.europa.eu/theme/ge': {
        fr: 'Altitude',
        nl: 'Geologie',
    },
    'http://inspire.ec.europa.eu/theme/gg': {
        fr: 'Référentiels de coordonnées',
        nl: 'Geografisch rastersysteem',
    },
    'http://inspire.ec.europa.eu/theme/ef': {
        fr: 'Sources d\'énergie',
        nl: 'Milieubewakingsvoorzieningen',
    },
    'http://inspire.ec.europa.eu/theme/am': {
        fr: 'Installations agricoles et aquacoles',
        nl: 'Gebiedsbeheer, gebieden waar beperkingen gelden, gereguleerde gebieden en rapportage-eenheden',
    },
    'http://inspire.ec.europa.eu/theme/af': {
        fr: 'Ortho-imagerie',
        nl: 'Faciliteiten voor landbouw en aquacultuur',
    },
    'http://inspire.ec.europa.eu/theme/ad': {
        fr: 'Etiquette',
        nl: 'Adressen',
    },
    'http://inspire.ec.europa.eu/theme/ac': {
        fr: 'Zones de gestion, de restriction ou de réglementation et unités de déclaration',
        nl: 'Atmosferische omstandigheden',
    },
    'http://inspire.ec.europa.eu/theme/lu': {
        fr: 'Santé et sécurité des personnes',
        nl: 'Landgebruik',
    },
    'http://inspire.ec.europa.eu/theme/tn': {
        fr: 'Sites protégés',
        nl: 'Vervoersnetwerken',
    },
    'http://inspire.ec.europa.eu/theme/nz': {
        fr: 'Ressources minérales',
        nl: 'Gebieden met natuurrisico\'s',
    },
    'http://inspire.ec.europa.eu/theme/pf': {
        fr: 'Répartition de la population — démographie',
        nl: 'Faciliteiten voor productie en industrie',
    },
    'http://inspire.ec.europa.eu/theme/rs': {
        fr: 'Unités administratives',
        nl: 'Systemen voor verwijzing door middel van coördinaten',
    },
    'http://inspire.ec.europa.eu/theme/ps': {
        fr: 'Hydrographie',
        nl: 'Beschermde gebieden',
    },
    'http://inspire.ec.europa.eu/theme/ac-mf': {
        fr: 'Caractéristiques géographiques météorologiques',
        nl: 'Atmospheric Conditions and meteorological geographical features',
    },
    'http://inspire.ec.europa.eu/theme/lc': {
        fr: 'Géologie',
        nl: 'Bodemgebruik',
    },
};
// export const KeywordIO = io.keyof(GEMET);
export const KeywordIO = i({
    id: io.string,
    code: io.string,
    name: MessageRecordIO,
    thesaurus: io.string,
}, 'KeywordIO');
export type Keyword = TypeOf<typeof KeywordIO>;

// metadata/2.0/req/common/keyword-originating-cv

// metadata/2.0/req/common/group-keywords-by-cv

// metadata/2.0/req/common/limitations-on-public-access
export const ANNEX_D1 = {
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1b': {
        fr: 'public access limited according to Article 13(1)(b) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(b) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1c': {
        fr: 'public access limited according to Article 13(1)(c) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(c) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1a': {
        fr: 'public access limited according to Article 13(1)(a) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(a) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1f': {
        fr: 'public access limited according to Article 13(1)(f) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(f) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1g': {
        fr: 'public access limited according to Article 13(1)(g) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(g) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1d': {
        fr: 'public access limited according to Article 13(1)(d) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(d) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1e': {
        fr: 'public access limited according to Article 13(1)(e) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(e) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1h': {
        fr: 'public access limited according to Article 13(1)(h) of the INSPIRE Directive',
        nl: 'public access limited according to Article 13(1)(h) of the INSPIRE Directive',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess': {
        fr: 'Limitations on public access',
        nl: 'Limitations on public access',
    },
    'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations': {
        fr: 'no limitations to public access',
        nl: 'no limitations to public access',
    },
};

export const LimitationsOnPublicAccessIO = io.keyof(ANNEX_D1);

export type LimitationsOnPublicAccess = TypeOf<typeof LimitationsOnPublicAccessIO>;


// metadata/2.0/req/common/conditions-for-access-and-use
// const OtherConstraintsIO = u([
//     l('noConditionsApply'),
//     l('conditionsUnknown'),
//     FreeTextIO,
// ]);
// const ConditionsForAccessAndUseIO = u([
//     i({
//         access: OtherConstraintsIO,
//     }),
//     i({
//         use: OtherConstraintsIO,
//     }),
// ]);

// metadata/2.0/rec/common/licences

// metadata/2.0/req/common/bounding-box
export const BoundingBoxIO = i({
    west: io.number,
    east: io.number,
    north: io.number,
    south: io.number,
}, 'BoundingBoxIO');
export type BoundingBox = TypeOf<typeof BoundingBoxIO>;

// metadata/2.0/req/common/conformity
// const ConformityIO = u([
//     l('conformant'),
//     l('notConformant'),
//     l('notEvaluated'),
// ]);

// metadata/2.0/req/common/conformity-specification

// metadata/2.0/rec/common/use-anchors-for-specifications

// metadata/2.0/req/common/conformity-degree



// metadata/2.0/req/datasets-and-series/resource-type

// metadata/2.0/req/datasets-and-series/only-one-md-data-identification

// metadata/2.0/req/datasets-and-series/dataset-uid
export const DatasetUIDIO = io.string;

// metadata/2.0/req/datasets-and-series/inspire-theme-keyword

// metadata/2.0/req/datasets-and-series/spatial-resolution

// metadata/2.0/req/datasets-and-series/resource-language

// metadata/2.0/req/datasets-and-series/topic-category
// export const TopicCategoryIO = u([
//     l('farming'),
//     l('biota'),
//     l('boundaries'),
//     l('climatologyMeteorologyAtmosphere'),
//     l('economy'),
//     l('elevation'),
//     l('environment'),
//     l('geoscientificInformation'),
//     l('health'),
//     l('imageryBaseMapsEarthCover'),
//     l('intelligenceMilitary'),
//     l('inlandWaters'),
//     l('location'),
//     l('oceans'),
//     l('planningCadastre'),
//     l('society'),
//     l('structure'),
//     l('transportation'),
//     l('utilitiesCommunication'),
// ], 'TopicCategoryIO');
export const TopicCategoryIO = i({
    id: io.string,
    code: io.string,
    name: MessageRecordIO,
    thesaurus: io.string,
}, 'TopicCategoryIO');
export type TopicCategory = TypeOf<typeof TopicCategoryIO>;

// metadata/2.0/req/datasets-and-series/resource-locator

// metadata/2.0/req/datasets-and-series/one-data-quality-element

// metadata/2.0/req/datasets-and-series/conformity

// metadata/2.0/req/datasets-and-series/lineage



// metadata/2.0/req/isdss/crs

// metadata/2.0/req/isdss/crs-id

// metadata/2.0/req/isdss/temportal-rs

// metadata/2.0/req/isdss/spatial-representation-type

// metadata/2.0/req/isdss/character-encoding

// metadata/2.0/req/isdss/data-encoding

// metadata/2.0/req/isdss/topological-consistency-quantitative-results

// metadata/2.0/req/isdss/topological-consistency-descriptive-results


// metadata/2.0/req/common/root-element

export const InspireIO = io.intersection([
    i({
        // << our little requirement(s)
        id: io.string,
        geometryType: GeometryTypeIO,
        published: io.boolean,
        // >>

        resourceTitle: ResourceTitleIO,

        resourceAbstract: ResourceAbstractIO,

        // resourceType:,

        uniqueResourceIdentifier: DatasetUIDIO, // should be an array though, but we're going to refernce only one layer per md.

        // topicCategory: Multiplicity1Star<TopicCategory>('TopicCategory', TopicCategoryIO),
        // topicCategory: a(TopicCategoryIO),
        topicCategory: a(io.string),

        // keyword: Multiplicity1Star<Keyword>('Keyword', KeywordIO),
        keywords: a(io.string),

        // geographicBoundingBox: Multiplicity1Star<BoundingBox>('BoundingBox', BoundingBoxIO),
        geographicBoundingBox: BoundingBoxIO,

        // temporalReference: Multiplicity1Star<TemporalReference>('TemporalReference', TemporalReferenceIO),
        temporalReference: TemporalReferenceIO,

        // responsibleOrganisation: Multiplicity1Star<ResponsibleOrganisation>('ResponsibleOrganisation', ResponsibleOrganisationIO),
        responsibleOrganisation: a(ResponsibleOrganisationIO),

        // metadataPointOfContact: Multiplicity1Star<MdPointOfContact>('MdPointOfContact', MdPointOfContactIO),
        metadataPointOfContact: a(MdPointOfContactIO),

        metadataDate: MdDateIO,
        // doe not fit with our multilingual environment
        // metadataLanguage: MetadataLanguageCodeIO, 
    }),
    p({
        // resourceLocator:,
        resourceLanguage: a(MetadataLanguageCodeIO),

    }),
], 'InspireIO');

// InspireIO.validate

export type Inspire = TypeOf<typeof InspireIO>;

