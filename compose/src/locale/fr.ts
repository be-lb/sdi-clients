

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
 
import IntlMessageFormat from 'intl-messageformat';

const plural = (n: number | string, ord: boolean) => {
    if (ord) {
        return n === 1 ? 'one' : 'other';
    }
    return n >= 0 && n < 2 ? 'one' : 'other';
};

export default () => {

    IntlMessageFormat.addLocaleData({
        locale: 'fr',
        pluralRuleFunction: plural,
    });

    IntlMessageFormat.addLocaleData({ locale: 'fr-BE', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-BF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-BI', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-BJ', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-BL', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CA', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CD', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CG', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CH', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CI', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-CM', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-DJ', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-DZ', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-GA', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-GF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-GN', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-GP', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-GQ', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-HT', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-KM', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-LU', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MA', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MC', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MG', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-ML', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MQ', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MR', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-MU', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-NC', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-NE', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-PF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-PM', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-RE', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-RW', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-SC', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-SN', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-SY', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-TD', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-TG', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-TN', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-VU', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-WF', parentLocale: 'fr' });
    IntlMessageFormat.addLocaleData({ locale: 'fr-YT', parentLocale: 'fr' });
};
