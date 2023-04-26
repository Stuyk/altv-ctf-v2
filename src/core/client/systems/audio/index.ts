import * as alt from 'alt-client';
import { AudioFiles } from '../../../shared/audio';
import { Events } from '../../../shared/events';

const view = new alt.WebView('http://resource/client/systems/audio/index.html');

export function play(audioName: AudioFiles) {
    const fullPath = `http://assets/audio/${audioName}`;
    view.emit('play:Audio', fullPath);
}

alt.onServer(Events.toClient.playAudio, play);
