
import { DIV } from 'sdi/components/elements';
import { inputText } from 'sdi/components/input';
import { fromRecord, updateRecordRaw } from 'sdi/locale';
import { IMapInfo } from 'sdi/source';

import { setPrintTitle, resetPrintTitle } from '../../events/app';
import { getPrintTitle, hasPrintTitle } from '../../queries/app';

const renderCheckBox =
    (info: IMapInfo) => {
        if (hasPrintTitle()) {
            return DIV({
                onClick: () => setPrintTitle(getPrintTitle(info))
            }, 'with custom title')
        }
        return DIV({
            onClick: () => resetPrintTitle()
        }, 'without custom title')
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
