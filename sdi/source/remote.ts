
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
import { some, fromNullable, none } from 'fp-ts/lib/Option';
import { Task } from 'fp-ts/lib/Task';
import { getCSRF } from '../app';

const headers = new Headers();
headers.append('Content-Type', 'application/json');


const defaultFetchOptions =
    (): RequestInit => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        getCSRF().map(csrf => headers.append('X-CSRFToken', csrf));

        return {
            mode: 'cors',
            cache: 'default',
            redirect: 'follow',
            credentials: 'same-origin',
            headers,
        };
    };

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


export const fetchWithoutValidationIO =
    <T>(url: string, getOptions: RequestInit = {}) => {
        const options: RequestInit = {
            method: 'GET',
            ...defaultFetchOptions(),
            ...getOptions,
        };

        return (
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        return response.json() as Promise<T>;
                    }
                    throw new Error(`Network response was not ok.\n[${url}]\n${response.statusText}`);
                })
        );
    };


export const fetchIO =
    <T>(ioType: io.Type<T>, url: string, getOptions: RequestInit = {}) => {
        const options: RequestInit = {
            method: 'GET',
            ...defaultFetchOptions(),
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
                .then(obj => ioType.decode(obj)
                    .fold(onValidationError(ioType), identity))
        );
    };

const makePageType =
    <T>(ioType: io.Type<T>) =>
        io.interface({
            count: io.number,
            next: io.union([io.string, io.null]),
            previous: io.union([io.string, io.null]),
            results: io.array(ioType),
        }, `Page<${ioType.name}>`);

export interface FetchedPage<T> {
    results: T[];
    page: number;
    total: number;
}

const makePage =
    <T>(results: T[], page: number, total: number): FetchedPage<T> => ({
        results, page, total,
    });

class Inc {
    private storedValue = 0;
    step() {
        this.storedValue += 1;
        return this.value();
    }
    value() {
        return this.storedValue;
    }

}


export const fetchPaginatedIO =
    <T>(ioType: io.Type<T>, url0: string, getOptions?: RequestInit) => {
        const pagetType = makePageType(ioType);
        let pageSize = 0;
        let nextUrl = some(`${url0}?page=1`);
        const pageCounter = new Inc();


        const fetchPage =
            () =>
                nextUrl.map(
                    url => fetchIO(pagetType, url, getOptions)
                        .then((r) => {
                            if (pageCounter.value() === 0) {
                                pageSize = r.results.length;
                            }
                            nextUrl = fromNullable(r.next);
                            const frame = makePage<T>(r.results, pageCounter.value(), pageSize > 0 ? r.count / pageSize : 0);
                            pageCounter.step();

                            return frame;
                        })
                        .catch(() => {
                            nextUrl = none;
                            return makePage<T>([], -1, -1);
                        }));

        const loop =
            (f: (a: FetchedPage<T>) => void, end: () => void) =>
                fetchPage()
                    .foldL(
                        end,
                        p => p.then((results) => {
                            f(results);
                            loop(f, end);
                        }));

        return loop;
    };

export const postIO =
    <T, DT>(ioType: io.Type<T>, url: string, data: DT, postOptions: RequestInit = {}) => {
        const options: RequestInit = {
            body: JSON.stringify(data),
            method: 'POST',
            ...defaultFetchOptions(),
            ...postOptions,
        };

        const recType = io.intersection([
            ioType,
            io.interface({ id: io.union([io.string, io.number]) }),
        ]);

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
                        recType.decode(obj)
                            .fold(onValidationError(ioType), identity)
                    );
                })
        );
    };

export const deleteIO =
    (url: string, getOptions: RequestInit = {}) => {
        const options: RequestInit = {
            method: 'DELETE',
            ...defaultFetchOptions(),
            ...getOptions,
        };

        return (
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        return void 0;
                    }
                    throw new Error(`Network response was not ok.\n[${url}]\n${response.statusText}`);
                })
        );
    };



export const taskFetchIO =
    <T>(ioType: io.Type<T>, url: string, getOptions: RequestInit = {}) =>
        new Task(() => fetchIO(ioType, url, getOptions));

