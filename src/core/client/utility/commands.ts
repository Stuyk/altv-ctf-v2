import * as alt from 'alt-client';
import { Events } from '../../shared/events';

alt.log('utility/commands.ts');

new alt.Utils.ConsoleCommand('/pos', () => {
    if (!alt.debug) {
        return;
    }

    console.log(alt.Player.local.pos);
});

new alt.Utils.ConsoleCommand('/rot', () => {
    if (!alt.debug) {
        return;
    }

    console.log(alt.Player.local.rot);
});

new alt.Utils.ConsoleCommand('/goto', (x: string | number, y: string | number, z: string | number) => {
    if (!alt.debug) {
        return;
    }

    x = typeof x === 'undefined' ? 0 : parseInt(String(x));
    y = typeof y === 'undefined' ? 0 : parseInt(String(y));
    z = typeof z === 'undefined' ? 0 : parseInt(String(z));
    alt.emitServerRaw(Events.toServer.goToPosition, new alt.Vector3(x, y, z));
});
