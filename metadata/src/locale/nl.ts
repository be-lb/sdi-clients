

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
    const s = String(n).split('.');
    const v0 = !s[1];
    if (ord) {
        return 'other';
    }
    return n === 1 && v0 ? 'one' : 'other';
};
export default () => {

    IntlMessageFormat.addLocaleData({
        locale: 'nl',
        pluralRuleFunction: plural,
    });


    IntlMessageFormat.addLocaleData({ locale: 'nl-AW', parentLocale: 'nl' });
    IntlMessageFormat.addLocaleData({ locale: 'nl-BE', parentLocale: 'nl' });
    IntlMessageFormat.addLocaleData({ locale: 'nl-BQ', parentLocale: 'nl' });
    IntlMessageFormat.addLocaleData({ locale: 'nl-CW', parentLocale: 'nl' });
    IntlMessageFormat.addLocaleData({ locale: 'nl-SR', parentLocale: 'nl' });
    IntlMessageFormat.addLocaleData({ locale: 'nl-SX', parentLocale: 'nl' });
};
