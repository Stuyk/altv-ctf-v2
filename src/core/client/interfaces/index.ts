import * as alt from 'alt-client';

declare module 'alt-client' {
    export interface ICustomGlobalSyncedMeta {
        redFlagHolder: alt.Player;
        blueFlagHolder: alt.Player;

        redFlagPos: alt.IVector3;
        blueFlagPos: alt.IVector3;

        redScore: number;
        blueScore: number;
    }
}
