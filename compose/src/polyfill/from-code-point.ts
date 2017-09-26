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
 
if (!String.fromCodePoint) {
    const stringFromCharCode = String.fromCharCode;
    const floor = Math.floor;
    const fromCodePoint = (...codePoints: number[]) => {
        const MAX_SIZE = 0x4000;
        const codeUnits: any[] = [];
        let highSurrogate;
        let lowSurrogate;
        let result = '';

        codePoints.map((codePoint, index: number) => {
            if (
                !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
                codePoint < 0 ||              // not a valid Unicode code point
                codePoint > 0x10FFFF ||       // not a valid Unicode code point
                floor(codePoint) !== codePoint // not an integer
            ) {
                throw RangeError('Invalid code point: ' + codePoint);
            }
            if (codePoint <= 0xFFFF) { // BMP code point
                codeUnits.push(codePoint);
            }
            else { // Astral code point; split in surrogate halves
                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                highSurrogate = (codePoint >> 10) + 0xD800;
                lowSurrogate = (codePoint % 0x400) + 0xDC00;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === codePoints.length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        });


        return result;
    };

    String.fromCodePoint = fromCodePoint;
}
