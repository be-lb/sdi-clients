import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';


const obstacleItem =
    (label: MessageKey, icon: string) => DIV({ className: 'obstacle-item' },
        DIV({ className: 'obstacle-icon' + ' ' + icon }),
        DIV({ className: 'obstacle-label' }, tr(label)));

const obstacleItemAndInput =
    (label: MessageKey, icon: string) => DIV({ className: 'obstacle-item' },
        DIV({ className: 'obstacle-icon' + ' ' + icon + ' active' }),
        DIV({ className: 'obstacle-label' }, tr(label)),
        DIV({ className: 'obstacle-input' },
            DIV({ className: 'obstacle-input-minus' }),
            DIV({ className: 'obstacle-input-value' }, '$n'),
            DIV({ className: 'obstacle-input-plus' })));




export const calcObstacle =
    () =>
        DIV({ className: 'adjust-item obstacle' },
            DIV({ className: 'adjust-item-title' }, '1. ' + tr('installationObstacle') + ' : '),
            DIV({ className: 'adjust-item-widget' },
                obstacleItemAndInput('velux', 'icon-velux'),
                obstacleItem('dormerWindow', 'icon-dormer'),
                obstacleItem('flatRoofWindow', 'icon-window'),
                obstacleItem('existingSolarPannel', 'icon-panel'),
                obstacleItem('chimneyAir', 'icon-cheminey-air'),
                obstacleItem('chimneySmoke', 'icon-cheminey-smoke'),
                obstacleItem('terraceInUse', 'icon-terrace'),
                obstacleItem('lift', 'icon-lift')),
        );







