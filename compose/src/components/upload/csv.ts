
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

import { DIV, INPUT } from 'sdi/components/elements';
import tr from 'sdi/locale';

const render =
    () => {
        return (
            DIV({ className: 'upload-widget csv' },
                DIV({ className: 'upload-title' }, 'CSV'),
                DIV({ className: 'input-wrapper' },
                    INPUT({ type: 'file', name: '', value: '', accept: '.csv, text/csv' })),
                DIV({ className: 'input-wrapper options' },
                    DIV({ className: 'checkbox' }, tr('skipFirstLine'))),
                DIV({ className: 'input-wrapper separator' },
                    DIV({ className: 'upload-label' }, tr('separatedBy')),
                    DIV({ className: 'radio' }, tr('comma')),
                    DIV({ className: 'radio' }, tr('semicolon')),
                    DIV({ className: 'radio' }, tr('tab')),
                    DIV({ className: 'radio' }, tr('space'))),
                DIV({ className: 'input-wrapper text-delimiter' },
                    DIV({ className: 'upload-label' }, tr('textDelimiter')),
                    DIV({ className: 'radio' }, tr('quotationMark')),
                    DIV({ className: 'radio' }, tr('apostrophe'))),
                DIV({ className: 'input-wrapper lat-lon' },
                    DIV({ className: 'input-wrapper' },
                        DIV({ className: 'input-label' }, tr('setLatitude')),
                        INPUT({ type: 'number', name: '', value: '', placeholder: 'columnNumber' })),
                    DIV({ className: 'input-wrapper' },
                        DIV({ className: 'input-label' }, tr('setLongitude')),
                        INPUT({ type: 'number', name: '', value: '', placeholder: 'columnNumber' }))),
                DIV({ className: 'btn-upload' }, tr('upload')))
        );
    }

export default render;