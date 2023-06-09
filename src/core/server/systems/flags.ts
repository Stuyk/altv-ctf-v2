import * as alt from 'alt-server';
import { getTeam } from './teams';
import { playAudio } from './audio';

let currentFlags: Flags;

export class Flags {
    private readonly redFlagPos: alt.IVector3;
    private readonly blueFlagPos: alt.IVector3;

    private isFlagAtRed = true;
    private isFlagAtBlue = true;

    private redFlagHolder: alt.Player;
    private blueFlagHolder: alt.Player;

    private redBlip: alt.Blip;
    private blueBlip: alt.Blip;

    private interval: number;

    constructor(redPos: alt.Vector3, bluePos: alt.Vector3) {
        if (currentFlags) {
            currentFlags.cleanup();
        }

        this.redFlagPos = redPos;
        this.blueFlagPos = bluePos;

        alt.setSyncedMeta('blueFlagPos', this.blueFlagPos);
        alt.setSyncedMeta('redFlagPos', this.redFlagPos);
        alt.setSyncedMeta('blueFlagHolder', undefined);
        alt.setSyncedMeta('redFlagHolder', undefined);

        this.redBlip = new alt.PointBlip(this.redFlagPos);
        this.redBlip.sprite = 570;
        this.redBlip.scale = 0.8;
        this.redBlip.color = 1;
        this.redBlip.priority = 9;

        this.blueBlip = new alt.PointBlip(this.blueFlagPos);
        this.blueBlip.sprite = 570;
        this.blueBlip.scale = 0.8;
        this.blueBlip.color = 3;
        this.blueBlip.priority = 9;

        this.interval = alt.setInterval(this.tick.bind(this), 0);

        currentFlags = this;
    }

    cleanup() {
        alt.clearInterval(this.interval);

        if (this.redBlip && this.redBlip.valid) {
            this.redBlip.destroy();
        }

        if (this.blueBlip && this.blueBlip.valid) {
            this.blueBlip.destroy();
        }
    }

    tick() {
        // Handles removing the red flag for a disconnected player
        if (this.redFlagHolder && !this.redFlagHolder.valid) {
            this.resetRedFlag();
        }

        // Handles removinghe blue flag for a disconnected player
        if (this.blueFlagHolder && !this.blueFlagHolder.valid) {
            this.resetBlueFlag();
        }

        // Handles moving the red flag position near other player
        if (this.redFlagHolder && this.redFlagHolder.valid) {
            alt.setSyncedMeta('redFlagPos', this.redFlagHolder.pos.add(0, 0, 1));
            this.redBlip.pos = new alt.Vector3(this.redFlagHolder.pos);
        } else {
            alt.setSyncedMeta('redFlagPos', this.redFlagPos);
            this.redBlip.pos = new alt.Vector3(this.redFlagPos);
        }

        // Handles moving the red flag position near other player
        if (this.blueFlagHolder && this.blueFlagHolder.valid) {
            alt.setSyncedMeta('blueFlagPos', this.blueFlagHolder.pos.add(0, 0, 1));
            this.blueBlip.pos = new alt.Vector3(this.blueFlagHolder.pos);
        } else {
            alt.setSyncedMeta('blueFlagPos', this.blueFlagPos);
            this.blueBlip.pos = new alt.Vector3(this.blueFlagPos);
        }
    }

    tryGrabbingAsRed(player: alt.Player) {
        if (!this.isFlagAtBlue) {
            return;
        }

        this.isFlagAtBlue = false;
        this.blueFlagHolder = player;
        alt.setSyncedMeta('blueFlagHolder', player);
        alt.setSyncedMeta('blueFlagPos', player.pos);
        playAudio('blue-flag-taken.ogg');
    }

    tryGrabbingAsBlue(player: alt.Player) {
        if (!this.isFlagAtRed) {
            return;
        }

        this.isFlagAtRed = false;
        this.redFlagHolder = player;
        alt.setSyncedMeta('redFlagHolder', player);
        alt.setSyncedMeta('redFlagPos', player.pos);
        playAudio('red-flag-taken.ogg');
    }

    tryScoringAsRed(player: alt.Player): boolean {
        if (!this.isFlagAtRed) {
            return false;
        }

        if (!this.blueFlagHolder) {
            return false;
        }

        if (this.blueFlagHolder && this.blueFlagHolder.id !== player.id) {
            return false;
        }

        playAudio('red-team-scored.ogg');
        this.resetBlueFlag();
        return true;
    }

    tryScoringAsBlue(player: alt.Player): boolean {
        if (!this.isFlagAtBlue) {
            return false;
        }

        if (!this.redFlagHolder) {
            return false;
        }

        if (this.redFlagHolder && this.redFlagHolder.id !== player.id) {
            return false;
        }

        playAudio('blue-team-scored.ogg');
        this.resetRedFlag();
        return true;
    }

    resetRedFlag() {
        this.isFlagAtRed = true;
        this.redFlagHolder = undefined;
        alt.setSyncedMeta('redFlagHolder', undefined);
        alt.setSyncedMeta('redFlagPos', this.redFlagPos);
    }

    resetBlueFlag() {
        this.isFlagAtBlue = true;
        this.blueFlagHolder = undefined;
        alt.setSyncedMeta('blueFlagHolder', undefined);
        alt.setSyncedMeta('blueFlagPos', this.blueFlagPos);
    }

    dropAsFlagHolder(player: alt.Player) {
        const team = getTeam(player);
        if (typeof team === 'undefined') {
            return;
        }

        if (team === 'red' && this.blueFlagHolder && this.blueFlagHolder.id === player.id) {
            playAudio('blue-flag-returned.ogg');
            this.resetBlueFlag();
        }

        if (team === 'blue' && this.redFlagHolder && this.redFlagHolder.id === player.id) {
            playAudio('red-flag-returned.ogg');
            this.resetRedFlag();
        }
    }
}
