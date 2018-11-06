import { fromRecord } from 'sdi/locale';


const data = [
    ['key', 'fr', 'nl'],
    ['header', 'cartesolaire.brussels', 'zonnekaart.brussels'],
    ['title-pv', 'Rapport de simulation d’installation photovoltaïque', 'Simulatierapport voor een fotovoltaïsche installatie'],
    ['title-thermal', 'Rapport de simulation d’installation solaire thermique', 'Simulatierapport voor een thermische installatie'],
    ['date', 'Rapport émit le ', 'Rapport uitgegeven op '],
    ['url', 'URL du batiment : ', 'URL van het gebouw'],
    ['base-url', 'https://www.cartesolaire.brussels/client/solar/detail/', 'https://www.zonnekaart.brussels/client/solar/detail/'],
    ['gainPV', 'Gain net sur 10 ans :', 'Nettowinst op 10 jaar'],
    ['gainThermal', 'Gain sur 10 ans :', 'Winst op 10 jaar'],
    ['contact-title', 'Contacter gratuitement nos conseillers', 'Contacteer gratis onze raadgevers'],
    ['contact-intro', 'La carte solaire ne prétend pas être exacte à 100%. Contactez un installateur pour affiner ces résultats, ou demandez des informations complémentaires à nos conseillers.', 'De zonnekaart geeft geen 100% juiste gegevens. Contacteer een installateur om de resultaten te verfijnen of vraag bijkomende informatie aan onze raadgevers.'],
    ['contact-0', 'Pour les particuliers :', 'Voor de particulieren :'],
    ['contact-0.1', '• www.homegrade.brussels', '• www.homegrade.brussels'],
    ['contact-0.2', '• info@homegrade.brussels', '• info@homegrade.brussels'],
    ['contact-0.3', '• n° gratuit : 1810', '• Gratis n° : 1810'],
    ['contact-1', 'Pour les professionnels :', 'Voor de professionelen :'],
    ['contact-1.1', '• n° gratuit : 0800 85 775', '• Gratis n° : 0800 85 775'],
    ['contact-1.2', '• facilitateur@environnement.brussels', '• facilitateur@leefmilieu.brussels'],
    ['finance-title', 'Formules de financement', 'Financieringmogelijkheden'],
    ['finance-0', '• La plus rentable est de payer soi - même.', '• Het meest winstgevende is om zelf de aankoop te doen.'],
    ['finance-1', '• Contracter un prêt bancaire reste intéressant, plus d’informations sur https://homegrade.brussels/particuliers/pret-vert-bruxellois.', '• Het afsluiting van een lening blijft interessant, meer info via homegrade.brussels/particuliers/pret-vert-bruxellois/?lang=nl'],
    ['finance-2', '• Les gains sont moindres, mais toujours présents, via le recours à un Tiers-investisseur.', 'Via het gebruik van een derde investeerder is het ook mogelijk om winst te maken. (weliswaar minder). '],
    ['finance-3', 'Ce dernier se charge simultanément du financement ET de l’installation.', 'Deze laatste is tegelijk verantwoordelijk voor de financiering en installatie.'],
    ['certif-title', 'Certificats Verts Bruxellois', 'Brusselse groenestroomcertificaten'],
    ['certif-body', 'Votre production solaire est soutenue par l’octroi, garanti par la Région Bruxelles Capitale pendant 10 ans, de certificats verts bruxellois. Leur vente constitue une rentrée financière additionnelle.', 'Uw zonneproductie wordt ondersteund door de gegarandeerde uitgave van Brusselse groenestroomcertificaten via het Brussels Hoofdstedelijk Gewest en dit gedurende 10 jaar. De verkoop hiervan vormt een extra financieel inkomen.'],
    ['footer', 'L’objectif est de fournir une première estimation du potentiel d’énergie solaire disponible sur les toitures bruxelloises. Les données de ce rapport ont une valeur indicative et n’engagent pas la responsabilité de Bruxelles Environnement. Vous pouvez trouver plus d’informations à propos des méthodes de calcul et les sources de données utilisées sur la plateforme www.cartesolaire.brussels', 'De doelstelling is om een eerste inschatting te geven van het potentieel aan zonne-energie dat beschikbaar is op de Brusselse daken. De gegevens binnen dit rapport zijn indicatief en vallen buiten de verantwoordelijkheid van Leefmilieu Brussel. Meer info over de berekeningswijzen en de gebruikte gegevens kan u vinden op het platform www.zonnekaart.brussels.'],
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


