
import * as debug from 'debug';

import { DIV, SPAN, INPUT, H1 } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import tr from 'sdi/locale';

import map from '../map';
import { geocoderResponse, geocoderInput } from '../../queries/map';
import { IUgWsAddress, IUgWsResult, queryGeocoder } from 'sdi/ports/geocoder';
import { updateGeocoderTerm, updateGeocoderResponse } from '../../events/map';
import { fetchKey } from '../../remote/index';
import { navigatePreview } from '../../events/route';
import { setAddress } from '../../events/simulation';
import { setLayout } from '../../events/app';

const logger = debug('sdi:solar');

const updateAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateGeocoderTerm(e.target.value);
};

const searchAddress = () => {
    geocoderInput()
        .foldL(
            () => updateGeocoderResponse(null),
            ({ addr, lang }) => {
                queryGeocoder(addr, lang)
                    .then(updateGeocoderResponse);

            });
};

const addressToString = (a: IUgWsAddress) =>
    `${a.street.name} ${a.number}, ${a.street.postCode} ${a.street.municipality}`;


const renderGeocoderInput =
    () => INPUT({
        className: 'locate-input',
        type: 'text',
        name: 'adress',
        placeholder: tr('solSolarGeocode'),
        onChange: updateAddress,
        onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (isENTER(e)) {
                searchAddress();
            }
        },
    });

const renderGeocoderButton =
    () => DIV({ className: 'btn-analyse', onClick: searchAddress },
        SPAN({ className: 'sun' }),
        tr('solResearch'));

const renderGeocoderInputWrapper =
    (...n: React.ReactNode[]) => DIV({ className: 'input-wrapper' }, ...n);

const renderGeocoderResults =
    (results: IUgWsResult[]) => {
        return results.map(({ point, address }, key) => {
            // const coords: [number, number] = [result.point.x, result.point.y];
            return DIV({ className: 'adress-result', key },
                DIV({ className: 'select-icon' }),
                DIV({
                    onClick: () => {
                        setAddress(address);
                        updateGeocoderResponse(null);
                        fetchKey(point.x, point.y)
                            .then(({ capakey }) => navigatePreview(capakey))
                            .catch((err: string) => {
                                logger(`Could not fetch a capakey: ${err}`);
                            });
                    },
                }, addressToString(address)));
        });
    };

// const renderClearResults =
//     () => DIV({
//         className: 'btn-reset geocoder-clear',
//         onClick: clearGeocoderResponse,
//     }, tr('solSearchAnotherAdress'));

const renderGeocoderResultsWrapper =
    (...n: React.ReactNode[]) =>
        DIV({ className: 'geocoder-wrapper' },
            H1({}, tr('searchResult')),
            ...n);

const renderGeocoder =
    (): React.ReactNode[] =>
        geocoderResponse()
            .fold(
                [renderGeocoderInputWrapper(renderGeocoderInput(), renderGeocoderButton())],
                ({ result }) => [
                    renderGeocoderInputWrapper(
                        renderGeocoderInput(), renderGeocoderButton()),
                    renderGeocoderResultsWrapper(renderGeocoderResults(result)),
                ]);


const pitch =
    () =>
        DIV({ className: 'locate-pitch' },
            DIV({}, tr('solLocatePitchStr1')),
            DIV({ className: 'pitch-bold' }, tr('solLocatePitchStr2')),
            DIV({},
                SPAN({}, tr('solLocatePitchStr3a')),
                SPAN({ className: 'pitch-bold' }, tr('solLocatePitchStr3b'))),
            DIV({}, tr('solLocatePitchStr4')),
            DIV({}, tr('solLocatePitchStr5')),
        );


const illu =
    () =>
        DIV({ className: 'locate-illu' });

const pitchWrapper =
    () =>
        DIV({ className: 'locate-pitch-wrapper' },
            pitch(),
            illu(),
        );


const goToMap =
    () =>
        DIV({ className: 'locate-goto-map' },
            DIV({}, tr('solOrSelectBuilding')),
            DIV({
                className: 'map-button',
                onClick: () => setLayout('Locate:Map'),
            }, tr('solOnMap')),
        );

const goToSearch =
    () =>
        DIV({ className: 'locate-goto-search' },
            DIV({
                className: 'map-button',
                onClick: () => setLayout('Locate:Geocoder'),
            }, tr('geocode')),
        );


const searchWrapper =
    () =>
        DIV({ className: 'locate-geocode' },
            DIV({},
                SPAN({}, tr('solCalculateStrPart1')),
                SPAN({ className: 'pitch-bold' }, tr('solSolarPotential')),
                SPAN({}, tr('solCalculateStrPart2'))),
            ...renderGeocoder(),
        );



const wrapperTop =
    () =>
        DIV({ className: 'wrapper-top' },
            pitchWrapper(),
            searchWrapper(),
            goToMap(),
        );


const render =
    (withWrapper: boolean) => {
        if (withWrapper) {
            return DIV({ className: 'locate-box' },
                map(),
                wrapperTop());
        }
        return DIV({ className: 'locate-box' }, map(), goToSearch());
    };

export default render;


logger('loaded');
