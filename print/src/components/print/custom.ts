
import { DIV } from 'sdi/components/elements';
import { inputText } from 'sdi/components/input';
import { fromRecord, updateRecordRaw } from 'sdi/locale';
import { IMapInfo } from 'sdi/source';

import { setCustomTitle, resetCustomTitle } from '../../events/app';
import { getTitle, hasCustomTitle } from '../../queries/app';

const renderCheckBox =
    (info: IMapInfo) => {
        if (hasCustomTitle()) {
            return DIV({
                onClick: () => setCustomTitle(getTitle(info))
            }, 'with custom title')
        }
        return DIV({
            onClick: () => resetCustomTitle()
        }, 'without custom title')
    };

const render =
    (info: IMapInfo) =>
        DIV({ className: 'custom-title' },
            renderCheckBox(info),
            inputText(
                () => fromRecord(getTitle(info)),
                t => setCustomTitle(updateRecordRaw(
                    getTitle(info), t))),
        );


export default render;
