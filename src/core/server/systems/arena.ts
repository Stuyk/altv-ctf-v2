import * as alt from 'alt-server';
import { getAuthenticatedPlayers } from '../utility/players';
import { shuffle, split } from '../../shared/array';
import { addToTeam } from './teams';
import * as I from '../interfaces/index';
import { Flags } from './flags';
import { arenas } from '../config/arenas';

const UID_BLUE_GOAL = 'goal-blue-uid';
const UID_RED_GOAL = 'goal-red-uid';

type GoalShape = alt.Checkpoint & { uid: string };
type BoundsShape = alt.ColshapePolygon & { uid: string };

let currentArena: Arena;

export class Arena {
    private arenaInfo: I.ArenaInfo;

    private goalRed: GoalShape;
    private goalBlue: GoalShape;

    private blipGoalRed: alt.Blip;
    private blipGoalBlue: alt.Blip;

    private boundaries: BoundsShape;

    private flags: Flags;

    private redScore = 0;
    private blueScore = 0;

    /**
     * Creates an instance of an Arena.
     *
     * Gather all players who are authenticated.
     * Shuffle the players into two teams.
     * Apply clothing, and spawn the players.
     *
     *
     * @param {I.ArenaInfo} arena
     * @memberof Arena
     */
    constructor(arena: I.ArenaInfo) {
        // Cleanup the previously stored arena...
        if (currentArena) {
            currentArena.cleanup();
        }

        this.arenaInfo = arena;
        const validPlayers = shuffle(getAuthenticatedPlayers());
        if (validPlayers.length >= 1) {
            // Red Team
            const [redTeam, blueTeam] = split(validPlayers);
            for (let player of redTeam) {
                addToTeam(player, 'red');
                this.spawnRed(player);
            }

            // Blue Team
            for (let player of blueTeam) {
                addToTeam(player, 'blue');
                this.spawnBlue(player);
            }
        }

        // Create new flag system, automatically cleans old system
        this.flags = new Flags(new alt.Vector3(this.arenaInfo.flags.red), new alt.Vector3(this.arenaInfo.flags.blue));
        this.buildGoals();

        alt.setSyncedMeta('blueScore', this.blueScore);
        alt.setSyncedMeta('redScore', this.redScore);

        currentArena = this;
    }

    private buildGoals() {
        // Create Blips
        this.blipGoalBlue = new alt.PointBlip(new alt.Vector3(this.arenaInfo.flags.blue));
        this.blipGoalBlue.scale = 1;
        this.blipGoalBlue.sprite = 309;
        this.blipGoalBlue.color = 3;

        this.blipGoalRed = new alt.PointBlip(new alt.Vector3(this.arenaInfo.flags.red));
        this.blipGoalRed.scale = 1;
        this.blipGoalRed.sprite = 309;
        this.blipGoalRed.color = 1;

        // Create Checkpoints
        this.goalBlue = new alt.Checkpoint(
            26,
            this.arenaInfo.flags.blue.x,
            this.arenaInfo.flags.blue.y,
            this.arenaInfo.flags.blue.z - 1,
            5,
            3,
            0,
            0,
            255,
            200
        ) as GoalShape;
        this.goalBlue.uid = UID_BLUE_GOAL;

        this.goalRed = new alt.Checkpoint(
            26,
            this.arenaInfo.flags.red.x,
            this.arenaInfo.flags.red.y,
            this.arenaInfo.flags.red.z - 1,
            5,
            3,
            255,
            0,
            0,
            200
        ) as GoalShape;
        this.goalRed.uid = UID_RED_GOAL;
    }

    async spawnRed(player: alt.Player) {
        player.spawn(this.arenaInfo.spawns.red);
        player.removeAllWeapons();
        player.giveWeapon(this.arenaInfo.weapon, 9999, true);
    }

    async spawnBlue(player: alt.Player) {
        player.spawn(this.arenaInfo.spawns.blue);
        player.removeAllWeapons();
        player.giveWeapon(this.arenaInfo.weapon, 9999, true);
    }

    /**
     * Cleanup the current Arena; and stop all functionality.
     *
     * @memberof Arena
     */
    cleanup() {
        if (this.boundaries && this.boundaries.valid) {
            this.boundaries.destroy();
        }

        if (this.goalRed && this.goalRed.valid) {
            this.goalRed.destroy();
        }

        if (this.goalBlue && this.goalBlue.valid) {
            this.goalBlue.destroy();
        }

        if (this.blipGoalBlue && this.blipGoalBlue.valid) {
            this.blipGoalBlue.destroy();
        }

        if (this.blipGoalRed && this.blipGoalRed.valid) {
            this.blipGoalRed.destroy();
        }
    }

    getFlags() {
        return this.flags;
    }

    incrementScore(team: 'red' | 'blue') {
        if (team === 'red') {
            this.redScore += 1;
            alt.setSyncedMeta('redScore', this.redScore);
        }

        if (team === 'blue') {
            this.blueScore += 1;
            alt.setSyncedMeta('blueScore', this.blueScore);
        }
    }
}

export function getArena(): Arena {
    return currentArena;
}

export function onCollision(colshape: GoalShape | BoundsShape, entity: alt.Player) {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!colshape.uid) {
        return;
    }

    const flags = currentArena.getFlags();
    if (colshape.uid === UID_BLUE_GOAL) {
        if (entity.getStreamSyncedMeta('team') === 'red') {
            flags.tryGrabbingAsRed(entity);
        }

        const didScore = flags.tryScoringAsBlue(entity);
        if (didScore) {
            currentArena.incrementScore('blue');
        }
        return;
    }

    if (colshape.uid === UID_RED_GOAL) {
        if (entity.getStreamSyncedMeta('team') === 'blue') {
            flags.tryGrabbingAsBlue(entity);
            return;
        }

        const didScore = flags.tryScoringAsRed(entity);
        if (didScore) {
            currentArena.incrementScore('red');
        }
        return;
    }
}

if (!currentArena) {
    currentArena = new Arena(arenas[0]);
}

alt.on('entityEnterColshape', onCollision);
