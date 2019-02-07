/*
*  Copyright (C) 2019 Atelier Cartographique <contact@atelier-cartographique.be>
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

import { ClassAttributes, AllHTMLAttributes } from 'react';
import { BUTTON, DIV, SPAN } from './elements';

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'data-tooltip'?: string;
        'data-tooltip-position'?: string;
    }
}


export type TooltipPosition = 'left' | 'right' | 'bottom' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const tooltip =
    (pos: TooltipPosition) =>
        <T extends HTMLElement>(ctor: React.HTMLFactory<T>) =>
            <Attrs = ClassAttributes<HTMLElement> & AllHTMLAttributes<HTMLElement>>(content: string, attrs: Attrs, ...children: React.ReactNode[]) => {
                const updatedAttributes: Attrs = Object.assign({}, attrs, {
                    'data-tooltip-position': pos as string,
                    'data-tooltip': content,
                });
                return ctor(updatedAttributes, ...children);
            };


export const tooltipLeft = tooltip('left');
export const tooltipRight = tooltip('right');
export const tooltipTop = tooltip('top');
export const tooltipTopRight = tooltip('top-right');
export const tooltipTopLeft = tooltip('top-left');
export const tooltipBottom = tooltip('bottom');
export const tooltipBottomRight = tooltip('bottom-right');
export const tooltipBottomLeft = tooltip('bottom-left');

export const buttonTooltipLeft = tooltipLeft(BUTTON);
export const buttonTooltipRight = tooltipRight(BUTTON);
export const buttonTooltipTop = tooltipTop(BUTTON);
export const buttonTooltipTopRight = tooltipTopRight(BUTTON);
export const buttonTooltipTopLeft = tooltipTopLeft(BUTTON);
export const buttonTooltipBottom = tooltipBottom(BUTTON);
export const buttonTooltipBottomRight = tooltipBottomRight(BUTTON);
export const buttonTooltipBottomLeft = tooltipBottomLeft(BUTTON);

export const divTooltipLeft = tooltipLeft(DIV);
export const divTooltipRight = tooltipRight(DIV);
export const divTooltipTop = tooltipTop(DIV);
export const divTooltipTopRight = tooltipTopRight(DIV);
export const divTooltipTopLeft = tooltipTopLeft(DIV);
export const divTooltipBottom = tooltipBottom(DIV);
export const divTooltipBottomRight = tooltipBottomRight(DIV);
export const divTooltipBottomLeft = tooltipBottomLeft(DIV);

export const spanTooltipLeft = tooltipLeft(SPAN);
export const spanTooltipRight = tooltipRight(SPAN);
export const spanTooltipTop = tooltipTop(SPAN);
export const spanTooltipTopRight = tooltipTopRight(SPAN);
export const spanTooltipTopLeft = tooltipTopLeft(SPAN);
export const spanTooltipBottom = tooltipBottom(SPAN);
export const spanTooltipBottomRight = tooltipBottomRight(SPAN);
export const spanTooltipBottomLeft = tooltipBottomLeft(SPAN);
