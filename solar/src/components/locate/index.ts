
import * as debug from 'debug';

import { DIV, SPAN, INPUT } from 'sdi/components/elements';
import { isENTER } from 'sdi/components/keycodes';
import tr from 'sdi/locale';

import map from '../map';
import { toggle } from '../item-factory';
import { geocoderResponse, geocoderInput } from '../../queries/map';
import { IUgWsAddress, IUgWsResult, queryGeocoder } from 'sdi/ports/geocoder';
import { updateGeocoderTerm, updateGeocoderResponse } from '../../events/map';
import { fetchKey } from '../../remote/index';
import { navigatePreview } from '../../events/route';

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

            })
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
            className: 'bolt',
            onClick: searchAddress,
        }),
        tr('solResearch'));

const renderGeocoderResults =
    (results: IUgWsResult[]) => {
        return results.map(({ point, address }, key) => {
            // const coords: [number, number] = [result.point.x, result.point.y];
            return DIV({ className: 'adress-result', key },
                SPAN({
                    onClick: () => {
                        updateGeocoderResponse(null);
                        fetchKey(point.x, point.y)
                            .then(({ capakey }) => navigatePreview(capakey))
                            .catch((err: string) => {
                                logger(`Could not fetch a capakey: ${err}`)
                                // viewEvents.updateMapView({
                                //     dirty: 'geo',
                                //     center: coords,
                                //     zoom: 12,
                                // });
                            })
                    },
                }, addressToString(address)));
        });
    };

const renderGeocoderWrapper =
    (...n: React.ReactNode[]) => DIV({ className: 'input-wrapper' }, ...n);

const renderGeocoder =
    () =>
        geocoderResponse()
            .fold(
                renderGeocoderWrapper(renderGeocoderInput(), renderGeocoderButton()),
                ({ result }) => renderGeocoderWrapper(renderGeocoderResults(result)));

const wrapperTop =
    () =>
        DIV({ className: 'wrapper-top' },
            DIV({ className: 'locate-pitch' },
                SPAN({ className: 'bolt' }),
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
                toggle('solarThermal', 'solarPV'),
                renderGeocoder(),
                DIV({}, tr('solOrSelectBuildingOnMap'))));


const render =
    () =>
        DIV({ className: 'locate-box' },
            wrapperTop(),
            map());

export default render;


logger('loaded')
