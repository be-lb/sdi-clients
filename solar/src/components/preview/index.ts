import { DIV, SPAN, H1 } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';



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
            DIV({ className: 'illu ortho' },
                DIV({ className: 'map-pin top' },
                    DIV({ className: 'pin-head' }, '$n'),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            DIV({ className: 'back-to-map' }, tr('backToMap')));

const wrapperPlan =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu plan' },
                DIV({ className: 'map-pin middle' },
                    DIV({ className: 'pin-head' }, '$n'))),
            DIV({ className: 'roof-area' },
                tr('roofTotalArea'),
                SPAN({}, '$m2')));

const barChart =
    () =>
        DIV({ className: 'barchart' },
            DIV({
                className: 'great',
                width: '%value'
            }, '$area'),
            DIV({
                className: 'good',
                width: '%value'
            }, '$area'),
            DIV({
                className: 'unusable',
                width: '%value'
            }, '$area'),
        );

const wrapper3D =
    () =>
        DIV({ className: 'wrapper-illu' },
            DIV({ className: 'illu volume' },
                DIV({ className: 'map-pin right' },
                    DIV({ className: 'pin-end' }),
                    DIV({ className: 'pin-body' }),
                    DIV({ className: 'pin-end' }))),
            barChart());


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
            kv('gainElecInvoice'),
            kv('gainEnvironment'),
            DIV({ className: 'note' }, tr('estim10Y'))
        );

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



const summary =
    () =>
        DIV({ className: 'sidebar' },
            switchThermal(),
            sumAdress(),
            sumPotentialRank(),
            sumPotentialValues(),
            sumArea(),
        );



const action =
    () =>
        DIV({ className: 'actions' },
            DIV({ className: 'action-settings' },
                H1({}, tr('personalize')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-contact' },
                H1({}, tr('contactInstallator')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-change' },
                H1({}, tr('changeMyHabits')),
                DIV({ className: 'action-info' }, 'test'),
            ),
            DIV({ className: 'action-print' },
                H1({}, tr('changeMyHabits')),
                DIV({ className: 'action-info' }, 'test')));



const render =
    () =>
        DIV({ className: 'main-and-right-sidebar preview-box' },
            DIV({ className: 'content' },
                context(),
                action()),
            summary(),
        );


export default render;
