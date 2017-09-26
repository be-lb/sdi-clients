

/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 


const restServiceURL = 'https://geoservices.irisnet.be/localization/Rest/Localize/getaddresses?';

export interface IUgWsAddress {
    street: {
        name: string;
        postCode: string;
        municipality: string;
        id: string;
    };
    number: string;
}

export interface IUgWsPoint {
    x: number;
    y: number;
}

export interface IUgWsExtent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

export interface IUgWsQualificationText {
    policeNumber: string;
    postCode: string;
    municipality: string;
    streetName: string;
}

export interface IUgWsQualificationCode {
    policeNumber: string;
    postCode: string;
    municipality: string;
    streetName: string;
}

export interface IUgWsResult {
    language: 'fr' | 'nl';
    address: IUgWsAddress;
    adNc: string;
    score: number;
    point: IUgWsPoint;
    extent: IUgWsExtent;
    qualificationText: IUgWsQualificationText;
    qualificationCode: IUgWsQualificationCode;
}

export interface IUgWsResponse {
    result: IUgWsResult[];
    error: boolean;
    status: string;
    version: string;
}


const queryString = (o: { [k: string]: any }) => {
    return Object.keys(o).reduce((a, k) => {
        return `${a}&${k}=${o[k].toString()}`;
    }, '');
};


export const queryService = (address: string, language: 'fr' | 'nl'): Promise<IUgWsResponse> => {
    const qs = queryString({
        spatialReference: '31370',
        language,
        address,
    });

    return (
        fetch(`${restServiceURL}${qs}`)
            .then(response => response.text())
            .then((text) => {
                try {
                    return JSON.parse(text);
                }
                catch (e) {
                    return {
                        result: [],
                        error: true,
                        status: 'FailedToParse',
                        version: '2.0',
                    };
                }
            })
            .then((data: IUgWsResponse) => data)
    );
};
