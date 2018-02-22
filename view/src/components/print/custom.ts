
import { DIV } from 'sdi/components/elements';
import { inputText } from 'sdi/components/input';
import tr, { fromRecord, updateRecordRaw } from 'sdi/locale';
import { IMapInfo } from 'sdi/source';

import { setPrintTitle, resetPrintTitle } from '../../events/app';
import { getPrintTitle, hasPrintTitle } from '../../queries/app';

const renderCheckBox =
    (info: IMapInfo) => {
        if (hasPrintTitle()) {
            return DIV({
                onClick: () => setPrintTitle(getPrintTitle(info))
            }, tr('modifyTitle'))
        }
        return DIV({
            onClick: () => resetPrintTitle()
        }, tr('unmodifiedTitle'))
    };

const render =
    (info: IMapInfo) =>
        DIV({ className: 'custom-title' },
            renderCheckBox(info),
            inputText(
                () => fromRecord(getPrintTitle(info)),
                t => setPrintTitle(updateRecordRaw(
                    getPrintTitle(info), t))),
        );


export default render;
