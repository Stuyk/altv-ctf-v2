import * as alt from 'alt-server';
import { Events } from '../../shared/events';
import { addToTeam, getNextAvailableTeam } from './teams';
import { getArena } from './arena';
import { getAuthenticatedPlayers } from '../utility/players';

let kickPlayerIn: { [id: number]: number } = {};

function handleAuthenticate(player: alt.Player) {
    Object.keys(kickPlayerIn).forEach((id) => {
        if (kickPlayerIn[id] > Date.now()) {
            return;
        }

        const somePlayer = alt.Player.all.find((x) => x.id === parseInt(id));
        if (!somePlayer) {
            delete kickPlayerIn[id];
            return;
        }

        somePlayer.kick('Failed to Login');
    });

    kickPlayerIn[player.id] = Date.now() + 60000 * 3;
    player.emitRaw(Events.toClient.authenticate);
}

async function handleFinishAuthenticate(player: alt.Player, bearerToken: string) {
    if (typeof bearerToken === 'undefined') {
        player.kick('Open Discord, and Rejoin the Server');
        return;
    }

    const request: Response = await fetch('https://discordapp.com/api/users/@me', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${bearerToken}`,
        },
    }).catch((err) => {
        console.log(err);
        return undefined;
    });

    if (!request || request.status !== 200) {
        player.kick('Open Discord, and Rejoin the Server');
        return;
    }

    const data = await request.json();
    if (!data) {
        player.kick('Failed to obtain discord name or discriminator.');
        return;
    }

    player.model = 'mp_m_freemode_01';
    player.spawn(36.19486618041992, 859.3850708007812, 197.71343994140625, 0);

    // Setup General Player Information
    const name = `${data.username}#${data.discriminator}`;
    player.setStreamSyncedMeta('authenticated', true);
    player.setStreamSyncedMeta('name', name);
    player.emitRaw(Events.toClient.startTickEvents);

    // Add a player to a specific team.
    const teamSelected = getNextAvailableTeam();
    addToTeam(player, teamSelected);

    await alt.Utils.waitFor(() => typeof getArena() !== 'undefined', 20000);
    const currentArena = getArena();

    if (teamSelected === 'red') {
        currentArena.spawnRed(player);
    } else {
        currentArena.spawnBlue(player);
    }

    delete kickPlayerIn[player.id];

    alt.setSyncedMeta('playerCount', getAuthenticatedPlayers().length);

    alt.emit('broadcastMessage', `${name} has joined team ${teamSelected}.`);
    alt.log(`${name} has joined the server.`);
}

alt.on('playerConnect', handleAuthenticate);
alt.onClient(Events.toServer.finishAuthenticate, handleFinishAuthenticate);

alt.on('playerDisconnect', (player: alt.Player) => {
    try {
        const name = player.getStreamSyncedMeta('name');
        alt.emit('broadcastMessage', `${name} has left the server.`);
    } catch (err) {}

    alt.setSyncedMeta('playerCount', getAuthenticatedPlayers().length);
});
