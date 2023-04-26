import * as alt from 'alt-client';
import { drawText2D } from '../utility/text';

function tick() {
    let redScore = alt.getSyncedMeta('redScore');
    if (!redScore) {
        redScore = 0;
    }

    let blueScore = alt.getSyncedMeta('blueScore');
    if (!blueScore) {
        blueScore = 0;
    }

    let players = alt.getSyncedMeta('playerCount');
    if (!players) {
        players = 0;
    }

    drawText2D({
        text: `Player Count: ${players}`,
        color: new alt.RGBA(255, 255, 255, 255),
        pos: new alt.Vector2({ x: 0.5, y: 0.02 }),
        scale: 0.5,
    });

    drawText2D({
        text: `~b~${blueScore} ~w~| ~r~${redScore}`,
        color: new alt.RGBA(255, 255, 255, 255),
        pos: new alt.Vector2({ x: 0.5, y: 0.05 }),
        scale: 0.9,
    });
}

alt.everyTick(tick);
