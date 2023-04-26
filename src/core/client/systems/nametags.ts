import * as alt from 'alt-client';
import { Events } from '../../shared/events';
import { drawText3D } from '../utility/text';
import { distance } from '../../shared/vector';

alt.log('systems/nametags.ts');

const MAX_NAMETAG_DISTANCE = 10;
const MAX_NAMETAG_SIZE = 0.8;
const MIN_NAMETAG_SIZE = 0.4;

function tick() {
    const players = alt.Player.streamedIn;

    for (let player of players) {
        const name = player.getStreamSyncedMeta('name');
        if (typeof name === 'undefined') {
            continue;
        }

        const dist = distance(alt.Player.local.pos, player.pos);
        if (dist > MAX_NAMETAG_DISTANCE) {
            continue;
        }

        const percentage = dist / MAX_NAMETAG_DISTANCE;
        let scale = MAX_NAMETAG_SIZE - percentage * MAX_NAMETAG_SIZE;

        if (scale < MIN_NAMETAG_SIZE) {
            scale = MIN_NAMETAG_SIZE;
        }

        drawText3D({ text: name, color: new alt.RGBA(255, 255, 255, 200), pos: player.pos.add(0, 0, 1.25), scale });
    }
}

function init() {
    alt.log(`Initialize Name Tags`);
    alt.everyTick(tick);
}

alt.onServer(Events.toClient.startTickEvents, init);
