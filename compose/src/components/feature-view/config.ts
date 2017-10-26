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

import { ReactNode } from 'react';

import { getLang } from 'sdi/app';
import { formatNumber } from 'sdi/locale';
import { DIV, A, IMG } from 'sdi/components/elements';
import { RowConfig, StringConfig, URLConfig, ImageConfig, ConfigWithLabel, BooleanConfig, NumberConfig, withLabel } from 'sdi/source';

import queries from '../../queries/feature-config';
import appQueries from '../../queries/app';
import piechart from './piechart';
import timeserie from './timeserie';

interface NotNullProperties {
    [key: string]: any;
}


const renderString =
    (props: NotNullProperties, row: StringConfig) => {
        const val = props[row.propName];
        return DIV({
            className: `type-${row.type} level-${row.options.level} style-${row.options.style}`,
        }, `${val}`);
    };

const renderNumber =
    (props: NotNullProperties, row: NumberConfig) => {
        const val = props[row.propName];
        return DIV({
            className: `type-${row.type} level-${row.options.level} style-${row.options.style}`,
        }, formatNumber(val));
    };

const renderBoolean =
    (props: NotNullProperties, row: BooleanConfig) => {
        const val = props[row.propName];
        return DIV({
            className: `type-${row.type} level-${row.options.level} style-${row.options.style}`,
        }, `${val}`);
    };

const renderUrl =
    (props: NotNullProperties, row: URLConfig) => {
        const val = props[row.propName];
        return A({
            className: `type-${row.type} level-${row.options.level} style-${row.options.style}`,
            href: `${val}`,
            target: '_blank',
        }, `${val}`);
    };

const renderImage =
    (props: NotNullProperties, row: ImageConfig) => {
        const val = props[row.propName];
        return IMG({
            className: `type-image`,
            src: `${val}`,
        });
    };



const renderConfiguredRowLabel =
    (row: ConfigWithLabel) => (
        DIV({ className: 'feature-field-label' },
            appQueries.getAlias(row.propName)));


const renderConfiguredRowBody =
    (props: NotNullProperties, row: RowConfig) => {
        const className = 'feature-field-body';
        switch (row.type) {
            case 'string': return DIV({ className }, renderString(props, row));
            case 'number': return DIV({ className }, renderNumber(props, row));
            case 'boolean': return DIV({ className }, renderBoolean(props, row));
            case 'url': return DIV({ className }, renderUrl(props, row));
            case 'image': return DIV({ className }, renderImage(props, row));
            case 'piechart': return DIV({ className }, piechart(props, row));
            case 'timeserie': return DIV({ className }, timeserie(props, row));
        }
        return DIV({ className });
    };

const renderConfiguredRow =
    (props: NotNullProperties) =>
        (row: RowConfig) => {
            const className = 'feature-field';
            const elements: ReactNode[] = [];
            if (withLabel(row)) {
                if (row.options.withLabel) {
                    elements.push(renderConfiguredRowLabel(row));
                }
            }
            elements.push(renderConfiguredRowBody(props, row));

            return DIV({ className }, ...elements);
        };

const render =
    () => {
        const feature = appQueries.getCurrentFeature();
        const lc = getLang();
        const config = queries.getConfig();
        const lines: ReactNode[] = [];
        if (config && feature) {
            const props = feature.properties;
            const rows = config.rows.filter(r => r.lang === lc);
            if (props) {
                return (
                    DIV({ className: 'feature-view config' },
                        rows.map(renderConfiguredRow(props)))
                );
            }
        }

        return (
            DIV({ className: 'feature-view config' },
                ...lines)
        );
    };

export default render;
