
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
 
import * as io from 'io-ts';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

const stringify = (value: any): string => {
    return typeof value === 'function' ? io.getFunctionName(value) : JSON.stringify(value);
};

const getContextPath = (context: io.Context): string => {
    return context.map(({ key, type }) => `${key}: ${type.name}`).join('/');
};

const getMessage = (value: any, context: io.Context): string => {
    return `Invalid value ${stringify(value)} supplied to ${getContextPath(context)}`;
};


const onValidationError =
    <T>(ioType: io.Type<T>) =>
        (errors: io.ValidationError[]) => {
            const msg = errors.map(e => getMessage(e.value, e.context));
            console.group(`Validation Failed: ${ioType.name}`);
            msg.forEach(m => console.log(m));
            console.groupEnd();
            throw (new Error(`${ioType.name} failed validation`));
        };

const identity = <T>(a: T) => a;


export const fetchIO =
    <T>(ioType: io.Type<T>, url: string, getOptions: RequestInit = {}) => {
        const options: RequestInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            redirect: 'follow',
            ...getOptions,
        };

        return (
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(`Network response was not ok.\n[${url}]\n${response.statusText}`);
                })
                .then((obj) => {
                    return (
                        io.validate(obj, ioType)
                            .fold(onValidationError(ioType), identity)
                    );
                })
        );
    };

export const postIO =
    <T, DT>(ioType: io.Type<T>, url: string, data: DT, postOptions: RequestInit = {}) => {
        const options: RequestInit = {
            body: JSON.stringify(data),
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            redirect: 'follow',
            headers,
            ...postOptions,
        };

        return (
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(`Network response was not ok.\n[${url}]\n${response.statusText}`);
                })
                .then((obj) => {
                    return (
                        io.validate(obj, ioType)
                            .fold(onValidationError(ioType), identity)
                    );
                })
        );
    };

