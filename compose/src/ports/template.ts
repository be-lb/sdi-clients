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
// import { Map } from 'immutable';
const logger = debug('sdi:template');

const _isObject = function (obj: any) {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const _has = function (obj: any, key: string) {
    return obj != null && hasOwnProperty.call(obj, key);
};

const nativeKeys = Object.keys;

const _keys = function (obj: any) {
    if (!_isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    const keys = [];
    for (const key in obj) if (_has(obj, key)) keys.push(key);
    return keys;
};

const createEscaper = function (map: any) {
    const escaper = function (match: any) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    const source = '(?:' + _keys(map).join('|') + ')';
    const testRegexp = RegExp(source);
    const replaceRegexp = RegExp(source, 'g');
    return function (string: string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};

const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;',
};

// Certain characters need to be escaped so that they can be put into a
// string literal.
const escapes = {
    '\'': '\'',
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029',
};

type EscapeChar = '\'' | '\\' | '\r' | '\n' | '\u2028' | '\u2029';

const escaper = /\\|'|\r|\n|\u2028|\u2029/g;

const escapeChar = function (match: EscapeChar) {
    return '\\' + escapes[match];
};

const makeFunction = (source: string) => {
    try {
        return (new Function('obj', '_escape', source));
    }
    catch (e) {
        e.source = source;
        throw e;
    }
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
export default (text: string) => {

    const settings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
    };

    // Combine delimiters into one regular expression via alternation.
    const matcher = RegExp([
        settings.escape.source,
        settings.interpolate.source,
        settings.evaluate.source,
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    let index = 0;
    let source = '__p+=\'';

    text.replace(matcher,
        (match: string,
            escape: string | undefined,
            interpolate: string | undefined,
            evaluate: string | undefined,
            offset: number) => {

            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += '\'+\n((__t=(' + escape + '))===null?\'\':_escape(__t))+\n\'';
            }
            else if (interpolate) {
                source += '\'+\n((__t=(obj[\'' + interpolate.trim() + '\'] ))===null?\'\':__t)+\n\'';
            }
            else if (evaluate) {
                source += '\';\n' + evaluate + '\n__p+=\'';
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
    source += '\';\n';

    source = 'with(obj||{}){\n' + source + '}\n';

    source = 'var __t,__p=\'\',__j=Array.prototype.join,' +
        'print=function(){__p+=__j.call(arguments,\'\');};\n' +
        source + 'return __p;\n';

    logger(source);
    const render = makeFunction(source);

    const template = function (data: { [key: string]: any }): string {
        const _escape = createEscaper(escapeMap);
        return render(data, _escape);
    };

    // Provide the compiled source as a convenience for precompilation.
    // template.source = 'function(obj){\n' + source + '}';

    return template;
};

logger('loaded');
