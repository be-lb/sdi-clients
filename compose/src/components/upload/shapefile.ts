
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
            DIV({ className: 'upload-widget shp' },
                DIV({ className: 'upload-title' }, 'Shapefile'),
                DIV({ className: 'upload-infos' }, tr('uploadShpInfos')),
                DIV({ className: 'input-wrapper' },
                    DIV({ className: 'upload-label' }, '.SHP'),
                    INPUT({ type: 'file', name: '', value: '', accept: '.shp, application/octet-stream' })),
                DIV({ className: 'input-wrapper' },
                    DIV({ className: 'upload-label' }, '.SHX'),
                    INPUT({ type: 'file', name: '', value: '', accept: '.shx, application/octet-stream' })),
                DIV({ className: 'input-wrapper' },
                    DIV({ className: 'upload-label' }, '.DBF'),
                    INPUT({ type: 'file', name: '', value: '', accept: '.dbf, application/octet-stream' })),
                DIV({ className: 'input-wrapper' },
                    DIV({ className: 'upload-label' }, '.PRJ'),
                    INPUT({ type: 'file', name: '', value: '', accept: '.prj, application/octet-stream' })),
                DIV({ className: 'btn-upload' }, tr('upload')))
        );
    }

export default render;
