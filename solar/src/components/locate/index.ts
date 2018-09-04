
import * as debug from 'debug';

import { DIV, SPAN, INPUT } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import tr from 'sdi/locale';

import map from '../map';
import { geocoderResponse, geocoderInput } from '../../queries/map';
import { IUgWsAddress, IUgWsResult, queryGeocoder } from 'sdi/ports/geocoder';
import { updateGeocoderTerm, updateGeocoderResponse } from '../../events/map';
import { fetchKey } from '../../remote/index';
import { navigatePreview } from '../../events/route';
import { setAddress } from '../../events/simulation';

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
    () => DIV({ className: 'btn-analyse' },
        SPAN({
            className: 'sun',
            onClick: searchAddress,
        }),
        tr('solResearch'));

const renderGeocoderInputWrapper =
    (...n: React.ReactNode[]) => DIV({ className: 'input-wrapper' }, ...n);

const renderGeocoderResults =
    (results: IUgWsResult[]) => {
        return results.map(({ point, address }, key) => {
            // const coords: [number, number] = [result.point.x, result.point.y];
            return DIV({ className: 'adress-result', key },
                SPAN({
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

// const renderGeocoderResultsWrapper =
//     (...n: React.ReactNode[]) =>
//         DIV({ className: 'geocoder-wrapper' }, renderClearResults(), ...n);

const renderGeocoder =
    () =>
        geocoderResponse()
            .fold(
                renderGeocoderInputWrapper(renderGeocoderInput(), renderGeocoderButton()),
                ({ result }) => renderGeocoderInputWrapper(
                    renderGeocoderInput(),
                    renderGeocoderButton(),
                    renderGeocoderResults(result)));

const wrapperTop =
    () =>
        DIV({ className: 'wrapper-top' },
            DIV({ className: 'locate-pitch' },
                SPAN({}, tr('solHowMuchOf')),
                SPAN({ className: 'pitch-bold' }, tr('electricity')),
                DIV({}, tr('solOrOf'), SPAN({ className: 'pitch-bold' }, tr('heat'))),
                DIV({}, tr('solPossibleToProduce')),
                DIV({}, tr('solByRoof')),
                DIV({}, tr('solAtBxl'))),
            DIV({ className: 'locate-geocode' },
                DIV({},
                    SPAN({}, tr('solCalculateStrPart1')),
                    SPAN({ className: 'pitch-bold' }, tr('solSolarPotential')),
                    SPAN({}, tr('solCalculateStrPart2'))),
                renderGeocoder(),
                DIV({}, tr('solOrSelectBuildingOnMap'))));


const render =
    () =>
        DIV({ className: 'locate-box' },
            wrapperTop(),
            map());

export default render;


logger('loaded');
