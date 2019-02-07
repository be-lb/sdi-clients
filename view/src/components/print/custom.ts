
import { DIV, H3 } from 'sdi/components/elements';
import { inputText } from 'sdi/components/input';
import tr, { fromRecord, updateRecordRaw } from 'sdi/locale';
import { IMapInfo } from 'sdi/source';

import { setPrintTitle, resetPrintTitle } from '../../events/app';
import { getPrintTitle, hasPrintTitle } from '../../queries/app';

const renderCheckBox =
    (info: IMapInfo) => {
        if (hasPrintTitle()) {
            return DIV({
                onClick: () => setPrintTitle(getPrintTitle(info)),
            });
        }
        return DIV({
            onClick: () => resetPrintTitle(),
            className: 'btn-reset reset',
        }, tr('originalTitle'));
    };

const render =
    (info: IMapInfo) =>
        DIV({ className: 'custom-title' },
            H3({}, tr('emptyMapTitle')),
            inputText(
                () => fromRecord(getPrintTitle(info)),
                t => setPrintTitle(updateRecordRaw(
                    getPrintTitle(info), t))),
            renderCheckBox(info),
        );


export default render;
