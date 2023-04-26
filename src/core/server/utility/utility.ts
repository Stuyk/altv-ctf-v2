import * as alt from 'alt-server';
import { Events } from '../../shared/events';

alt.onClient(Events.toServer.goToPosition, (player: alt.Player, pos: alt.Vector3) => {
    if (!alt.debug) {
        return;
    }

    player.pos = pos;
});
