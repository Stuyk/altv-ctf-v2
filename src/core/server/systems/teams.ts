import * as alt from 'alt-server';
import { setClothes } from './clothes';
import { Events } from '../../shared/events';
import { getArena } from './arena';

const Teams: { [id: number]: 'red' | 'blue' } = {};

/**
 * Add a player to a team.
 *
 * @export
 * @param {alt.Player} player
 * @param {('red' | 'blue')} team
 */
export async function addToTeam(player: alt.Player, team: 'red' | 'blue') {
    Teams[player.id] = team;
    setClothes(player, team);
    player.setStreamSyncedMeta('team', team);
    player.emitRaw(Events.toClient.applyPlayerChanges);
}

/**
 * Remove a player from a team.
 *
 * @export
 * @param {(alt.Player | number)} player
 */
export function removeFromTeam(player: alt.Player | number) {
    if (player instanceof alt.Player) {
        player = player.id;
    }

    if (typeof player === 'undefined') {
        return;
    }

    delete Teams[player];
}

/**
 * Get the team of the player.
 *
 * @export
 * @param {alt.Player} player
 * @return {('red' | 'blue')}
 */
export function getTeam(player: alt.Player): 'red' | 'blue' {
    return player.getStreamSyncedMeta('team');
}

/**
 * Find an available team with a lower player count.
 *
 * @export
 * @return {('red' | 'blue')}
 */
export function getNextAvailableTeam(): 'red' | 'blue' {
    let redTeam = [];
    let blueTeam = [];

    for (let player of alt.Player.all) {
        const team = player.getStreamSyncedMeta('team');
        if (typeof team === 'undefined') {
            continue;
        }

        if (team === 'red') {
            redTeam.push(player);
        }

        if (team === 'blue') {
            blueTeam.push(player);
        }
    }

    if (redTeam.length > blueTeam.length) {
        return 'blue';
    }

    return 'red';
}

alt.on('playerDisconnect', removeFromTeam);
