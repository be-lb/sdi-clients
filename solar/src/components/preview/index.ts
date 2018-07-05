import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';


const switchThermal =
    () =>
        DIV({ className: 'switch-thermal' },
            DIV({ className: 'illu-ortho' }, tr('solarPV')),
            DIV({ className: 'switch-icon' }),
            DIV({ className: 'illu-ortho' }, tr('solarThermal')));


const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-ortho' },
            DIV({ className: 'illu-ortho' }, 'ortho'),
            DIV({ className: 'back-to-map' }, tr('backToMap')));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-plan' },
            DIV({ className: 'illu-plan' }, 'plan'),
            DIV({ className: 'roof-area' },
                tr('roofTotalArea'),
                SPAN({}, '$m2')));

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-3D' },
            DIV({ className: 'illu-3D' }, '3D'));


const summaryAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, '$streetName $streetNumber'),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ' $locality')));

const summaryPotentialRank =
    () =>
        DIV({ className: 'potential-rank' },
            DIV({ className: 'this-building' }, tr('thisBuildingGotA')),
            DIV({ className: 'potential-rank-value' }, '$SolarPotential'));


const summaryPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            DIV({ className: 'potential-kv' },
                SPAN({ className: 'potential-key' }, tr('buyingPrice')),
                SPAN({ className: 'potential-value' }, ' $value')),
            DIV({ className: 'potential-kv' },
                SPAN({ className: 'potential-key' }, tr('gainGreenCertif')),
                SPAN({ className: 'potential-value' }, ' $value')),
            DIV({ className: 'potential-kv' },
                SPAN({ className: 'potential-key' }, tr('gainElecInvoice10Y')),
                SPAN({ className: 'potential-value' }, ' $value')),
            DIV({ className: 'potential-kv' },
                SPAN({ className: 'potential-key' }, tr('gainEnvironment')),
                SPAN({ className: 'potential-value' }, ' $value')));



const summaryArea =
    () =>
        DIV({ className: 'summary-area' },
            DIV({ className: 'area-barchart' }),
            DIV({ className: 'area-kv-wrapper' },
                DIV({ className: 'area-kv' },
                    SPAN({ className: 'area-value' }, '$value : '),
                    SPAN({ className: 'area-key' }, tr('orientationGreat'))),
                DIV({ className: 'area-kv' },
                    SPAN({ className: 'area-value' }, '$value : '),
                    SPAN({ className: 'area-key' }, tr('orientationGood'))),
                DIV({ className: 'area-kv' },
                    SPAN({ className: 'area-value' }, '$value : '),
                    SPAN({ className: 'area-key' }, tr('unusable'))),
            ));

const summary =
    () =>
        DIV({ className: 'wrapper-summary' },
            summaryAdress(),
            summaryPotentialRank(),
            summaryPotentialValues(),
            summaryArea(),
        );


const action =
    () =>
        DIV({ className: 'wrapper-actions' },
            DIV({ className: 'action-settings' }, tr('personalize')),
            DIV({ className: 'action-contact' }, tr('contactInstallator')),
            DIV({ className: 'action-change' }, tr('changeMyHabits')),
            DIV({ className: 'action-print' }, 'download PDF'),
        );




const render =
    () =>
        DIV({ className: 'preview-box' },
            switchThermal(),
            wrapperOrtho(),
            wrapperPlan(),
            wrapper3D(),
            summary(),
            action(),
        );


export default render;
