import * as alt from 'alt-server';
import { AudioFiles } from '../../shared/audio';
import { Events } from '../../shared/events';

export function playAudio(audioName: AudioFiles) {
    alt.Player.all.forEach((player) => {
        player.emitRaw(Events.toClient.playAudio, audioName);
    });
}
