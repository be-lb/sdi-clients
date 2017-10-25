
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

import * as debug from 'debug';
import setupNl from './nl';
import setupFr from './fr';
import { messages, MessageKey } from './message-db';
import { getLang } from '../app';
import IntlMessageFormat from 'intl-messageformat';
import { MessageRecord } from '../source';

const logger = debug('sdi:locale');
setupNl();
setupFr();

const rEsc = new RegExp('\\\\', 'g');

export interface Parameters {
    [p: string]: string | number | Date;
}

export const fromRecordTemplated = <T>(r: { fr: T, nl: T }) => {
    const lc = getLang();
    return r[lc];
};

export const fromRecord = (r: MessageRecord, params?: Parameters) => {
    const lc = getLang();
    const template = r[lc].replace(rEsc, '\\\\');
    const imf = new IntlMessageFormat(template, lc);
    return imf.format(params);
};

export const updateRecordRaw = (r: MessageRecord, value: string) => {
    const lc = getLang();
    const n = { ...r };
    n[lc] = value;
    return n;
};

export const fromRecordRaw = (r: MessageRecord) => {
    const lc = getLang();
    return r[lc];
};

export const formatDate = (d: Date) => {
    const lc = getLang();
    const imf = new IntlMessageFormat(`{date_option, date}`, lc);
    return imf.format({ date_option: d });
};

export const formatNumber = (n: number) => {
    const lc = getLang();
    const imf = new IntlMessageFormat(`{number_option, number}`, lc);
    return imf.format({ number_option: n });
};

export const getMessage = (k: MessageKey, params?: Parameters) => {
    const lc = getLang();
    const template = messages[k][lc];
    const imf = new IntlMessageFormat(template, lc);
    if (params) {
        return imf.format(params);
    }

    return imf.format(messages[k].parameters);
};



export default getMessage;

logger('loaded');
