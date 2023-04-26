import * as alt from 'alt-server';

/**
 * Returns all authenticated players.
 *
 * @export
 * @return {alt.Player[]}
 */
export function getAuthenticatedPlayers(): alt.Player[] {
    return alt.Player.all.filter((x) => {
        return x.hasStreamSyncedMeta('authenticated');
    });
}

/**
 * Return all players that belong to a specific team.
 *
 * @export
 * @param {('red' | 'blue')} team
 * @return {alt.Player[]}
 */
export function getPlayersByTeam(team: 'red' | 'blue'): alt.Player[] {
    return alt.Player.all.filter((x) => {
        if (!x.hasStreamSyncedMeta('team')) {
            return false;
        }

        return team === x.getStreamSyncedMeta('team');
    });
}
