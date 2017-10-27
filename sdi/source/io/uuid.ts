
import * as io from 'io-ts';



const groups = [
    [0, 8],
    [9, 4],
    [14, 4],
    [19, 4],
    [24, 8],
];

const fl = Math.floor;

const splitOffsets = [8, 13, 18, 23];

const toHexList =
    (s: string) =>
        s.split('')
            .reduce<string[]>(
            (acc, c, i) => {
                acc[fl(i / 2)] += c;
                return acc;
            },
            (new Array(fl(s.length / 2)).fill('')));

const condLength = (s: string) => 36 === s.length;

const condSplits = (s: string) => splitOffsets.every(n => '-' === s[n]);

const checkNumber = (s: string) => !Number.isNaN(parseInt(s, 16));



const condGroups = (s: string) => groups.every(([offset, sz]) => toHexList(s.slice(offset, offset + sz)).every(checkNumber));

const v4 = (s: string) => (
    condLength(s) && condSplits(s) && condGroups(s)
);

export const uuid = io.refinement(io.string, v4, 'uuid');
