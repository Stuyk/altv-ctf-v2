import * as alt from 'alt-client';
import * as native from 'natives';
import { drawMarker } from '../utility/marker';
import { drawText3D } from '../utility/text';
import { distance } from '../../shared/vector';

const validKeys = ['blueFlagPos', 'redFlagPos', 'redFlagHolder', 'blueFlagHolder'];

const MAX_NAMETAG_DISTANCE = 35;
const MAX_NAMETAG_SIZE = 0.8;
const MIN_NAMETAG_SIZE = 0.4;

let bluePos: alt.Vector3;
let redPos: alt.Vector3;

let blueHolder: alt.Player;
let redHolder: alt.Player;

function handleFlagState(key: string, value: alt.Vector3 | alt.Player) {
    if (!validKeys.find((x) => x === key)) {
        return;
    }

    if (value instanceof alt.Player) {
        if (key === 'redFlagHolder') {
            redHolder = value;
        }

        if (key === 'blueFlagHolder') {
            blueHolder = value;
        }

        return;
    }

    if (value instanceof alt.Vector3) {
        const newPos = new alt.Vector3(value);

        if (key === 'redFlagPos') {
            redPos = newPos;
        }

        if (key === 'blueFlagPos') {
            bluePos = newPos;
        }

        return;
    }
}

function drawFlag(type: 'red' | 'blue', text: string, pos: alt.Vector3, color: alt.RGBA) {
    let actualPos = pos;
    if (type === 'red' && typeof redHolder !== 'undefined') {
        actualPos = redHolder.pos.add(0, 0, 1.5);
    }

    if (type === 'blue' && typeof blueHolder !== 'undefined') {
        actualPos = blueHolder.pos.add(0, 0, 1.5);
    }

    drawMarker(1, actualPos, new alt.Vector3(0.1, 0.1, 25), color);

    const dist = distance(alt.Player.local.pos, pos);
    if (dist > MAX_NAMETAG_DISTANCE) {
        return;
    }

    const percentage = dist / MAX_NAMETAG_DISTANCE;
    let scale = MAX_NAMETAG_SIZE - percentage * MAX_NAMETAG_SIZE;

    if (scale < MIN_NAMETAG_SIZE) {
        scale = MIN_NAMETAG_SIZE;
    }

    drawText3D({ text, pos: actualPos.add(0, 0, 2), color: new alt.RGBA(255, 255, 255, 200), scale });
}

function handleFlags() {
    native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);

    if (typeof redPos !== 'undefined') {
        drawFlag('red', 'Red Flag', redPos, new alt.RGBA(255, 0, 0, 200));
    }

    if (typeof bluePos !== 'undefined') {
        drawFlag('blue', 'Blue Flag', bluePos, new alt.RGBA(0, 50, 255, 200));
    }
}

alt.everyTick(handleFlags);
alt.on('globalSyncedMetaChange', handleFlagState);
