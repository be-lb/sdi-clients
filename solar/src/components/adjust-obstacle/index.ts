import { DIV } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';


const obstacleItem =
    (label: MessageKey, icon: string) => DIV({ className: 'obstacle-item' },
        DIV({ className: 'obstacle-icon' + ' ' + icon }),
        DIV({ className: 'obstacle-label' }, tr(label)));




export const calcObstacle =
    () =>
        DIV({ className: 'adjust-item obstacle' },
            DIV({ className: 'adjust-item-title' }, '1. ' + tr('installationObstacle') + ' : '),
            DIV({ className: 'adjust-item-widget' },
                obstacleItem('velux', 'icon-velux'),
                obstacleItem('dormerWindow', 'icon-dormer'),
                obstacleItem('flatRoofWindow', 'icon-window'),
                obstacleItem('existingSolarPannel', 'icon-panel'),
                obstacleItem('chimneyAir', 'icon-cheminey-air'),
                obstacleItem('chimneySmoke', 'icon-cheminey-smoke'),
                obstacleItem('terraceInUse', 'icon-terrass'),
                obstacleItem('lift', 'icon-lift')),
        );







