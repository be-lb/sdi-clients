import { PVTechnologyEnum } from 'solar-sim';
import { fromPredicate } from 'fp-ts/lib/Option';

import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';

import { inputSelect } from '../item-factory';
import { pvTechnology, pvTechnologyLabels } from '../../queries/simulation';
import { setInputF } from '../../events/simulation';


const technologies: PVTechnologyEnum[] = ['poly', 'mono', 'mono_high'];

const icon =
    (t: PVTechnologyEnum) =>
        DIV({ className: `rank-icon  active ${t}` });

const condTech =
    fromPredicate((t: PVTechnologyEnum) => t === pvTechnology());

const titleAndPicto =
    () => {
        const icons: React.ReactNode[] = [];
        technologies.map(condTech).forEach(i => i.map(t => icons.push(icon(t))));
        return DIV({ className: 'adjust-item-header' },
            DIV({ className: 'adjust-item-title' },
                '2. ' + tr('technology')), ...icons);
    };


const renderSelect =
    () => {
        const checkBox = inputSelect(pvTechnology, setInputF('pvTechnology'));
        return DIV({ className: 'wrapper-multi-checkbox' },
            DIV({ className: 'multi-checkbox-label' }, tr('technoType') + ' : '),
            DIV({}, ...technologies.map(t => checkBox(pvTechnologyLabels[t], t))));
    };

export const calcTechnology =
    () =>
        DIV({ className: 'adjust-item installation' },
            titleAndPicto(),
            DIV({ className: 'adjust-item-widget' },
                // DIV({ className: 'adjust-picto-wrapper' },
                renderSelect()));




