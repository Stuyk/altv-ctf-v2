import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface ICustomGlobalSyncedMeta {
        redFlagHolder: alt.Player;
        blueFlagHolder: alt.Player;

        redFlagPos: alt.IVector3;
        blueFlagPos: alt.IVector3;

        redScore: number;
        blueScore: number;

        playerCount: number;
    }
}

export interface ArenaInfo {
    /**
     * Maxmimum bounadries of the arena, including a Z height.
     *
     * @type {[alt.IVector3, alt.IVector3, alt.IVector3, alt.IVector3, number]}
     * @memberof Arena
     */
    boundaries: [alt.IVector3, alt.IVector3, alt.IVector3, alt.IVector3, number];

    /**
     * Team spawns for both red, and blue teams.
     *
     * @type {{
     *         red: alt.IVector3;
     *         blue: alt.IVector3;
     *     }}
     * @memberof Arena
     */
    spawns: {
        red: alt.IVector3;
        blue: alt.IVector3;
    };

    /**
     *
     *
     * @type {{
     *         red: alt.IVector3;
     *         blue: alt.IVector3;
     *     }}
     * @memberof Arena
     */
    flags: {
        red: alt.IVector3;
        blue: alt.IVector3;
    };

    /**
     * What melee weapon to give the players when they spawn.
     *
     * @type {string}
     * @memberof Arena
     */
    weapon: string;
}
