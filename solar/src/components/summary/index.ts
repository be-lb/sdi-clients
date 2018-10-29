import { summaryDetailedPhotovoltaic } from './details-pv';
import { summaryDetailedThermal } from './details-thermal';

import { getSystem } from '../../queries/simulation';


export const summaryDetailed =
    () => {
        switch (getSystem()) {
            case 'photovoltaic': return summaryDetailedPhotovoltaic();
            case 'thermal': return summaryDetailedThermal();
        }
    };



