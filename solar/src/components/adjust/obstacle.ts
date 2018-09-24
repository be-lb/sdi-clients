import { DIV, NODISPLAY } from 'sdi/components/elements';
import tr from 'sdi/locale';
import { MessageKey } from 'sdi/locale/message-db';
import { getObstacle } from '../../queries/simulation';
import { setObstacle } from '../../events/simulation';


export interface Obstacles {
    velux: number;
    dormerWindow: number;
    flatRoofWindow: number;
    // chimneyAir: number;
    chimneySmoke: number;
    terraceInUse: number;
    lift: number;
    existingSolarPannel: number;
}


export type Obstacle = keyof Obstacles;

export const defaulObstacles =
    (): Obstacles => ({
        velux: 0,
        dormerWindow: 0,
        flatRoofWindow: 0,
        // chimneyAir: number;
        chimneySmoke: 0,
        terraceInUse: 0,
        lift: 0,
        existingSolarPannel: 0,
    });

const labels: { [k in Obstacle]: MessageKey } = {
    velux: 'velux',
    dormerWindow: 'dormerWindow',
    flatRoofWindow: 'flatRoofWindow',
    // chimneyAir: number;
    chimneySmoke: 'chimneySmoke',
    terraceInUse: 'terraceInUse',
    lift: 'lift',
    existingSolarPannel: 'existingSolarPannel',
};

const icons: { [k in Obstacle]: string } = {
    velux: 'icon-velux',
    dormerWindow: 'icon-dormer',
    flatRoofWindow: 'icon-window',
    // chimneyAir: 'icon-cheminey-'
    chimneySmoke: 'icon-cheminey-smoke',
    terraceInUse: 'icon-terrace',
    lift: 'icon-lift',
    existingSolarPannel: 'icon-panel',
};

const obstacleItem =
    (on: Obstacle) => DIV({ className: 'obstacle-item' },
        DIV({ className: `obstacle-icon ${icons[on]}` }),
        DIV({ className: 'obstacle-label' }, tr(labels[on])),
        DIV({ className: 'obstacle-input single' },
            DIV({
                className: 'obstacle-input-plus',
                onClick: () => setObstacle(on, 1),
            })));

const obstacleItemActive =
    (on: Obstacle, n: number) => DIV({ className: 'obstacle-item' },
        DIV({ className: `obstacle-icon ${icons[on]} active` }),
        DIV({ className: 'obstacle-label' }, tr(labels[on])),
        DIV({ className: 'obstacle-input' },
            DIV({
                className: 'obstacle-input-minus',
                onClick: () => setObstacle(on, n - 1),
            }),
            DIV({ className: 'obstacle-input-value' }, `${n}`),
            DIV({
                className: 'obstacle-input-plus',
                onClick: () => setObstacle(on, n + 1),
            })));

const renderObstacle =
    (on: Obstacle) => {
        const n = getObstacle(on);
        if (n > 0) {
            return obstacleItemActive(on, n);
        }
        return obstacleItem(on);
    };

export const renderGraphics =
    () => {
        const cats: Obstacle[] = ['velux', 'dormerWindow', 'flatRoofWindow', 'chimneySmoke', 'terraceInUse', 'lift'];

        const elems = cats.map((cat) => {
            const n = getObstacle(cat);
            if (n > 0) {
                return DIV({ className: 'obstacle-graphic-item' },
                    ...(Array(n).fill(DIV({ className: `adjust-picto obstacle-icon ${icons[cat]}` }))));
            }
            return NODISPLAY();
        });

        return DIV({ className: 'obstacle-graphic' }, elems);
    };

export const calcObstacle =
    () =>
        DIV({ className: 'adjust-item obstacle' },
            DIV({ className: 'adjust-item-header' },
                DIV({ className: 'adjust-item-title' },
                    '1. ' + tr('installationObstacle')),
                renderGraphics()),
            DIV({ className: 'adjust-item-widget' },
                DIV({ className: 'obstacle-wrapper' },
                    renderObstacle('velux'),
                    renderObstacle('dormerWindow'),
                    renderObstacle('flatRoofWindow'),
                    // obstacleItem('chimneyAir', 'icon-cheminey-air'),
                    renderObstacle('chimneySmoke'),
                    renderObstacle('terraceInUse'),
                    renderObstacle('lift'),
                    // renderObstacle('existingSolarPannel'),
                )),
        );







