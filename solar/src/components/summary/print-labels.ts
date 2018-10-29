import { fromRecord } from 'sdi/locale';


const data = [
    ['key', 'fr', 'nl'],
    ['header', 'cartesolaire.brussels', ''],
    ['title-pv', 'Rapport de simulation d’installation photovoltaïque', ''],
    ['title-thermal', 'Rapport de simulation d’installation solaire thermique', ''],
    ['date', 'Rapport émit le ', ''],
    ['url', 'URL du batiment : ', ''],
    ['base-url', 'https://www.cartesolaire.brussels/client/solar/detail/', ''],

    ['contact-title', 'Contacter gratuitement nos conseillers', ''],
    ['contact-intro', 'La carte solaire ne prétend pas être exacte à 100%. Contactez un installateur pour affiner ces résultats, ou demandez des informations complémentaires à nos conseillers.', ''],
    ['contact-0', 'Pour les particuliers :', ''],
    ['contact-0.1', '• www.homegrade.brussels', ''],
    ['contact-0.2', '• info@homegrade.brussels', ''],
    ['contact-0.3', '• n° gratuit : 1810', ''],
    ['contact-1', 'Pour les professionnels :', ''],
    ['contact-1.1', '• n° gratuit : 0800 85 775', ''],
    ['contact-1.2', '• facilitateur@environnement.brussels', ''],
    ['finance-title', 'Formules de financement', ''],
    ['finance-0', '• La plus rentable est de payer soi - même.', ''],
    ['finance-1', '• Contracter un prêt bancaire reste intéressant, plus d’informations sur https://homegrade.brussels/particuliers/pret-vert-bruxellois.', ''],
    ['finance-2', '• Les gains sont moindres, mais toujours présents, via le recours à un Tiers-investisseur.', ''],
    ['finance-3', 'Ce dernier se charge simultanément du financement ET de l’installation.', ''],
    ['certif-title', 'Certificats Verts Bruxellois', ''],
    ['certif-body', 'Votre production solaire est soutenue par l’octroi, garanti par la Région Bruxelles Capitale pendant 10 ans, de certificats verts bruxellois. Leur vente constitue une rentrée financière additionnelle.', ''],
    ['footer', 'L’objectif est de fournir une première estimation du potentiel d’énergie solaire disponible sur les toitures bruxelloises. Les données de ce rapport ont une valeur indicative et n’engagent pas la responsabilité de Bruxelles Environnement. Vous pouvez trouver plus d’informations à propos des méthodes de calcul et les sources de données utilisées sur la plateforme www.cartesolaire.brussels', ''],
];


export const getLabel =
    (k: string): string => {
        const row = data.find(r => r[0] === k);
        if (row === undefined) {
            return k;
        }
        return fromRecord({
            fr: row[1],
            nl: row[2],
            en: '',
        });
    };

/*

*/


