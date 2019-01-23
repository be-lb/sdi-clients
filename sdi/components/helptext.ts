/*
 *  Copyright (C) 2019 Atelier Cartographique <contact@atelier-cartographique.be>
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

import { DIV } from './elements';

// collapsible version
// 
// export const helpText = (text: string) => (
//     DIV({ className: 'helptext-wrapper' },
//         A({ id: 'hideHelpText', className: 'hideText', href: '#hideHelpText' }, 'more infos'),
//         A({ id: 'showHelpText', className: 'showText', href: '#showHelpText' }, 'collapse infos'),
//         DIV({ className: 'helptext' }, text))
// );



// simple version : 
// 
export const helpText = (text: string) => (
    DIV({ className: 'helptext' }, text)
);
