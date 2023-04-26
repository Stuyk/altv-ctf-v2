import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events';

alt.log('systems/player.ts');

let interval: number;

function tick() {
    native.restorePlayerStamina(alt.Player.local.scriptID, 100);
}

function applyPower() {
    native.setRunSprintMultiplierForPlayer(alt.Player.local.scriptID, 1.49);
    native.setPedMoveRateOverride(alt.Player.local.scriptID, 10);

    if (typeof interval !== 'undefined') {
        return;
    }

    interval = alt.setInterval(tick, 0);
}

alt.onServer(Events.toClient.applyPlayerChanges, applyPower);
