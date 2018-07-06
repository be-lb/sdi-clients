import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';



const kv =
    (key: MessageKey) => DIV({ className: 'kv' },
        SPAN({ className: 'key' }, tr(key)),
        SPAN({ className: 'value' }, '$value'));



const switchThermal =
    () =>
        DIV({ className: 'switch-thermal' },
            DIV({}, tr('solarPV')),
            DIV({ className: 'switch-icon' }),
            DIV({}, tr('solarThermal')));



const wrapperOrtho =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu' }, '$ortho'),
            DIV({ className: 'back-to-map' }, tr('backToMap')));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu' }, '$plan'),
            DIV({ className: 'roof-area' },
                tr('roofTotalArea'),
                SPAN({}, '$m2')));

const sumArea =
    () =>
        DIV({ className: 'summary-area' },
            DIV({ className: 'area-barchart' }),
            DIV({ className: 'area-kv-wrapper' },
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
                    SPAN({ className: 'key' }, tr('orientationGreat'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
                    SPAN({ className: 'key' }, tr('orientationGood'))),
                DIV({ className: 'kv' },
                    SPAN({ className: 'value' }, '$value : '),
                    SPAN({ className: 'key' }, tr('unusable'))),
            ));

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu' }, '$3D'),
            sumArea());


const context =
    () =>
        DIV({ className: 'context' },
            wrapperOrtho(),
            wrapperPlan(),
            wrapper3D());



const sumAdress =
    () =>
        DIV({ className: 'adress' },
            H1({ className: 'street-name' }, '$streetName $streetNumber'),
            H1({ className: 'locality' },
                SPAN({}, tr('in')),
                SPAN({}, ' $locality')));

const sumPotentialRank =
    () =>
        DIV({ className: 'potential-rank' },
            DIV({ className: 'this-building' }, tr('thisBuildingGotA')),
            DIV({ className: 'potential-rank-value' }, '$SolarPotential'));


const sumPotentialValues =
    () =>
        DIV({ className: 'potential-values' },
            kv('buyingPrice'),
            kv('gainGreenCertif'),
            kv('gainElecInvoice10Y'),
            kv('gainEnvironment'));





const summary =
    () =>
        DIV({ className: 'sidebar' },
            switchThermal(),
            sumAdress(),
            sumPotentialRank(),
            sumPotentialValues(),
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
        DIV({ className: 'main-and-right-sidebar preview-box' },
            DIV({},
                context(),
                action()),
            summary(),
        );


export default render;
